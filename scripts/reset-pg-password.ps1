# Run this in an ELEVATED PowerShell (Run as Administrator).
# It resets the Postgres `postgres` superuser password and creates the vision_one DB.

$ErrorActionPreference = "Stop"

$service  = "postgresql-x64-17"
$dataDir  = "C:\Program Files\PostgreSQL\17\data"
$psql     = "D:\PostgreSQL\bin\psql.exe"
$hbaFile  = Join-Path $dataDir "pg_hba.conf"
$hbaBak   = Join-Path $dataDir "pg_hba.conf.bak"

# CHANGE THIS to the password you want for the postgres superuser:
$newPassword = "postgres"
$dbName      = "vision_one"

Write-Host "[1/6] Backing up pg_hba.conf..."
Copy-Item $hbaFile $hbaBak -Force

Write-Host "[2/6] Writing trust-auth pg_hba.conf..."
@"
# TEMPORARY trust auth for password reset
local   all             all                                     trust
host    all             all             127.0.0.1/32            trust
host    all             all             ::1/128                 trust
"@ | Set-Content -Encoding ASCII $hbaFile

Write-Host "[3/6] Restarting $service..."
Restart-Service $service
Start-Sleep -Seconds 2

Write-Host "[4/6] Resetting password and creating $dbName..."
& $psql -U postgres -h 127.0.0.1 -d postgres -c "ALTER USER postgres WITH PASSWORD '$newPassword';"
& $psql -U postgres -h 127.0.0.1 -d postgres -c "CREATE DATABASE $dbName;" 2>$null
Write-Host "  (CREATE DATABASE may report 'already exists' — that's fine.)"

Write-Host "[5/6] Restoring original pg_hba.conf..."
Move-Item $hbaBak $hbaFile -Force

Write-Host "[6/6] Restarting $service one more time..."
Restart-Service $service
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "Done." -ForegroundColor Green
Write-Host "  New postgres password: $newPassword"
Write-Host "  Database: $dbName"
Write-Host ""
Write-Host "Now back in the regular dev shell, run:"
Write-Host "  (Claude will update .env, then run prisma migrate + seed)"
