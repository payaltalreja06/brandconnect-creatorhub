# ──────────────────────────────────────────────────────────────────────────────
# Dockerfile — Apache Spark + PySpark (for ETL job execution)
# ──────────────────────────────────────────────────────────────────────────────
# Build: docker build -t brandconnect-spark .
# ──────────────────────────────────────────────────────────────────────────────

FROM apache/spark:3.5.0-python3

# Switch to root to install dependencies
USER root

# Install Python requirements
COPY requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt

# Copy ETL job into the Spark jobs directory
COPY jobs/ /opt/spark/jobs/

# Create data volume mount points
RUN mkdir -p /opt/data/yt/raw /opt/data/yt/processed

# Ownership: spark user (uid 185 in official image)
RUN chown -R 185:185 /opt/spark/jobs /opt/data

USER 185

# Default: run the ETL when container starts
# Override this in docker-compose or CI for different modes
CMD ["spark-submit", "/opt/spark/jobs/etl.py"]
