# ==============================================================================
# BrandConnect CreatorHub — Manual ETL Orchestrator
# ==============================================================================
# This script replaces the heavy Airflow setup for local development.
# It runs the Data Fetcher (API) and then the Spark ETL (Docker) in sequence.
#
# Usage:
#   .\orchestrate_etl.ps1                     <- Full Sync: discover all from MongoDB
#   .\orchestrate_etl.ps1 -Channel "@MrBeast" <- Manual Sync: individual channel
# ==============================================================================

param(
    [string[]]$Channel,
    [string]$ApiKey = $env:YT_API_KEY,
    [string]$MongoUri = ($env:MONGO_URI ? $env:MONGO_URI : $env:MONGODB_URI),
    [int]$MaxVideos = 20
)

# 1. Validate Keys
if (-not $ApiKey) {
    Write-Error "No YouTube API Key found! Set `$env:YT_API_KEY = '...'`"
    exit 1
}

# Use the venv python for the fetcher
$PythonExe = Join-Path $PSScriptRoot "venv\Scripts\python.exe"

Write-Host "`n>>> STEP 1: Fetching YouTube data..." -ForegroundColor Cyan

if ($Channel) {
    # Manual mode
    foreach ($c in $Channel) {
        & $PythonExe fetch_channel.py --channel "$c" --api-key "$ApiKey" --max-videos $MaxVideos
    }
} else {
    # Sync mode (reads from MongoDB)
    if (-not $MongoUri) {
        Write-Error "Sync Mode requires `$env:MONGO_URI`. Or pass -Channel explicitly."
        exit 1
    }
    & $PythonExe fetch_channel.py --sync --api-key "$ApiKey" --mongo-uri "$MongoUri" --max-videos $MaxVideos
}

if ($LASTEXITCODE -ne 0) {
    Write-Error "Data fetching failed. Aborting ETL."
    exit 1
}

Write-Host "`n>>> STEP 2: Running Spark ETL (Syncing to MongoDB Atlas)..." -ForegroundColor Cyan
# Run Spark directly in Lite Mode (Now that Java is installed!)
& $PythonExe jobs/etl.py

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ SUCCESS: ETL Pipeline Complete!" -ForegroundColor Green
    Write-Host "Check output in: ./data/yt/processed/" -ForegroundColor Gray
} else {
    Write-Error "Spark ETL failed! Check if everything is installed correctly."
}
