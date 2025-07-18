# Startup Script
# This script is used to start the Gasculator application.
# It sets up the environment and starts the server (React frontend) and client (fastAPI backend).

Write-Host "Starting Gasculator Application..." -ForegroundColor Green
Write-Host "Current Directory: $(Get-Location)" -ForegroundColor Yellow

$ClientExists = Test-Path "client"

Write-Host "Checking if 'client' directory exists -> ${ClientExists}" -ForegroundColor Cyan

if (-not (Test-Path "client")){
    Write-Host "No client directory found..." -ForegroundColor Red
    exit 1
} 

if (-not (Test-Path "server")) {
    Write-Host "No server directory found..." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "venv/Scripts/activate.ps1")) {
    Write-Host "No virtual environment found. Creating a new one with python -m venv venv..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "Virtual environment created." -ForegroundColor Green
}

function Install-Dependencies {
    Write-Host "Installing dependencies..." -ForegroundColor Cyan
    if (Test-Path "client/package.json") {
        Write-Host "Installing client dependencies..." -ForegroundColor Cyan
        Set-Location "client"
        npm install
        Write-Host "Client dependencies installed." -ForegroundColor Green
        Set-Location ..
    } else {
        Write-Host "No package.json found in client directory." -ForegroundColor Red
    }

    if (Test-Path "server/requirements.txt") {
        Write-Host "Installing server dependencies..." -ForegroundColor Cyan
        .\venv\Scripts\Activate.ps1
        Set-Location "server"
        pip install -r requirements.txt
        Write-Host "Server dependencies installed." -ForegroundColor Green
        Set-Location ..
    } else {
        Write-Host "No requirements.txt found in server directory." -ForegroundColor Red
    }
}

# Install dependencies if not already installed
Install-Dependencies

Write-Host "Dependencies installed successfully." -ForegroundColor Green


# Starting React frontend
Write-Host "Starting frontend..." -ForegroundColor Cyan

Set-Location "client"
$reactJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal
Set-Location ..

# Delay for React frontend
Start-Sleep -Seconds 3

# Starting fastAPI backend
Write-Host "Starting backend..." -ForegroundColor Cyan
Set-Location "server"

& "../venv/Scripts/Activate.ps1"

# Starting uvicorn
uvicorn main:app --reload
# Cleanup function
function Cleanup {
    Write-Host "`Shutting down servers..." -ForegroundColor Red
    
    # Stop the React development server

    Write-Host "Stopping frontend server..." -ForegroundColor Cyan
    Stop-Job -Job $reactJob
    Remove-Job -Job $reactJob
    Write-Host "React development server stopped." -ForegroundColor Green
    
    Write-Host "Stopping backend server..." -ForegroundColor Cyan
    deactivate
    Set-Location ..
    # Kill any remaining processes (optional, more aggressive cleanup)
    Get-Process | Where-Object {$_.ProcessName -like "*node*" -or $_.ProcessName -like "*uvicorn*"} | Stop-Process -Force -ErrorAction SilentlyContinue
    
    Write-Host "Development environment stopped!" -ForegroundColor Green

    Set-Location .. # Go back to the original directory
}

# Register cleanup function to run when script is terminated
Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action { Cleanup }

# Handle Ctrl+C
[Console]::TreatControlCAsInput = $false
[Console]::CancelKeyPress += { 
    Cleanup
    exit 0
}