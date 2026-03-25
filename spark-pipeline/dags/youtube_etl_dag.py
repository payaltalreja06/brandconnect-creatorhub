"""
================================================================================
BrandConnect CreatorHub — Airflow DAG
================================================================================
Purpose : Orchestrate the YouTube ETL pipeline
          1. Ingestion task  — validates raw data files exist in the volume
          2. Spark ETL task  — triggers spark-submit inside the Docker container
Author  : Data Engineering Team
Schedule: Daily at midnight UTC
================================================================================
"""

import logging
from datetime import datetime, timedelta

from airflow import DAG
from airflow.operators.bash import BashOperator
from airflow.operators.python import PythonOperator

log = logging.getLogger(__name__)

# ── Default DAG arguments ──────────────────────────────────────────────────────
default_args = {
    "owner":            "brandconnect-data-eng",
    "depends_on_past":  False,
    "start_date":       datetime(2026, 1, 1),
    "email_on_failure": False,   # set True + configure smtp in production
    "email_on_retry":   False,
    "retries":          2,
    "retry_delay":      timedelta(minutes=5),
    "execution_timeout": timedelta(minutes=30),
}

# ── DAG Definition ─────────────────────────────────────────────────────────────
with DAG(
    dag_id="brandconnect_youtube_etl",
    default_args=default_args,
    description="Ingest YouTube channel raw JSON → PySpark ETL → processed output",
    schedule_interval="0 0 * * *",   # daily at midnight UTC
    catchup=False,
    max_active_runs=1,
    tags=["brandconnect", "youtube", "etl", "spark"],
) as dag:

    # ── Task 1: Validate raw data exists on shared volume ─────────────────────
    def check_raw_data_exists(**context):
        """
        Python callable that checks whether the raw data directory on the shared
        Docker volume has at least one JSON file before handing off to Spark.
        Raises FileNotFoundError if empty — this causes the task to fail cleanly
        and prevents a wasted spark-submit call.
        """
        import os, glob
        raw_dir = "/opt/data/yt/raw/"
        files   = glob.glob(os.path.join(raw_dir, "*", "data.json"), recursive=False)
        if not files:
            msg = f"No data.json files found in {raw_dir}{{channelName}}/data.json. Ensure channel data has been fetched."
            log.error(msg)
            raise FileNotFoundError(msg)
        log.info(f"Found {len(files)} channel data file(s): {[os.path.basename(os.path.dirname(f)) for f in files]}")
        context["ti"].xcom_push(key="raw_files", value=files)

    ingestion = PythonOperator(
        task_id="validate_raw_data",
        python_callable=check_raw_data_exists,
        provide_context=True,
    )

    # ── Task 2: Spark ETL via docker exec ─────────────────────────────────────
    spark_job = BashOperator(
        task_id="spark_etl_youtube",
        bash_command=(
            "echo '[Airflow] Triggering Spark ETL job at $(date)' && "
            "docker exec spark spark-submit "
                "--conf spark.driver.memory=1g "
                "--conf spark.executor.memory=1g "
                "/opt/spark/jobs/etl.py && "
            "echo '[Airflow] Spark ETL job finished successfully at $(date)'"
        ),
        # If Spark exits with non-zero code, Airflow marks this task FAILED
        # and retries according to default_args.retries
        env={
            # Pass any env-vars Spark job needs
            "SPARK_MASTER":  "local[*]",
            # "MONGO_URI":   "{{ var.value.mongo_uri }}",  # uncomment when ready
        },
        append_env=True,
        do_xcom_push=False,
    )

    # ── Task 3: Post-ETL verification (optional sanity check) ─────────────────
    def verify_output(**context):
        """
        Checks that the processed directory has at least as many JSON files as
        there are raw inputs, confirming every channel was processed.
        """
        import os, glob
        processed_dir = "/opt/data/yt/processed/"
        raw_files     = context["ti"].xcom_pull(task_ids="validate_raw_data", key="raw_files") or []
        out_files     = glob.glob(os.path.join(processed_dir, "*.json"))

        log.info(f"Expected channels: {len(raw_files)}, Processed: {len(out_files)}")
        if len(out_files) < len(raw_files):
            log.warning(
                f"Only {len(out_files)} of {len(raw_files)} channels were processed. "
                "Check Spark logs for errors on missing channels."
            )
        else:
            log.info("All channels processed successfully.")

    post_check = PythonOperator(
        task_id="verify_etl_output",
        python_callable=verify_output,
        provide_context=True,
    )

    # ── Task Dependencies ──────────────────────────────────────────────────────
    # ingestion (validate files) → spark_job (ETL) → post_check (verify output)
    ingestion >> spark_job >> post_check
