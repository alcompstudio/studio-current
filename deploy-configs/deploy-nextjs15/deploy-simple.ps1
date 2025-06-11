# Studio App Deploy Script (Next.js 15) - Version 2.0
# Usage: .\deploy-simple.ps1 -ServerIP "157.180.87.32" -Username "deployuser"

param(
    [string]$ServerIP = "157.180.87.32",
    [string]$Username = "deployuser",
    [string]$DeployDir = "/var/www/studio-app",
    [string]$ArchiveName = "studio-deploy-simple.tar.gz",
    [switch]$CleanServer = $false
)

function Write-Log {
    param([string]$Message)
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
    exit 1
}

function Write-Step {
    param([string]$StepNumber, [string]$Description)
    Write-Host "`nSTEP ${StepNumber}: $Description" -ForegroundColor Cyan
    Write-Host ("=" * 60) -ForegroundColor Cyan
}

Write-Host @"
STUDIO APP DEPLOY (Next.js 15) v2.0
===============================================================
Server: $ServerIP
User: $Username  
Directory: $DeployDir
Archive: $ArchiveName
Clean Server: $CleanServer
===============================================================
"@ -ForegroundColor Magenta

try {
    # STEP 0: Clean server (optional)
    if ($CleanServer) {
        Write-Step "0" "Server cleanup"
        Write-Log "Cleaning server..."
        
        & ssh "$Username@$ServerIP" "pm2 delete all 2>/dev/null || true"
        & ssh "$Username@$ServerIP" "pm2 kill 2>/dev/null || true"
        & ssh "$Username@$ServerIP" "lsof -ti:3000 | xargs kill -9 2>/dev/null || true"
        & ssh "$Username@$ServerIP" "rm -rf $DeployDir"
        & ssh "$Username@$ServerIP" "mkdir -p $DeployDir"
        & ssh "$Username@$ServerIP" "pm2 flush 2>/dev/null || true"
        
        Write-Log "Server cleanup completed"
    }

    # STEP 1: Build project locally
    Write-Step "1" "Building project locally"
    Write-Log "Running npm run build..."
    
    $buildResult = & npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed!"
    }
    Write-Log "Build completed successfully"

    # STEP 2: Create archive
    Write-Step "2" "Creating deployment archive"
    Write-Log "Creating archive $ArchiveName..."
    
    if (Test-Path $ArchiveName) {
        Remove-Item $ArchiveName -Force
    }
    
    $filesToArchive = @(
        ".next",
        "package.json",
        "package-lock.json",
        "next.config.js",
        "tsconfig.json",
        "src",
        "public"
    )
    
    $existingFiles = @()
    foreach ($file in $filesToArchive) {
        if (Test-Path $file) {
            $existingFiles += $file
            Write-Log "Found: $file"
        } else {
            Write-Warning "Not found: $file"
        }
    }
    
    if ($existingFiles.Count -eq 0) {
        throw "No files found for archiving!"
    }
    
    try {
        $tarCommand = "tar -czf `"$ArchiveName`" " + ($existingFiles -join " ")
        Invoke-Expression $tarCommand
        Write-Log "Archive created with tar"
    }
    catch {
        Write-Warning "tar not available, using PowerShell..."
        $zipName = $ArchiveName.Replace(".tar.gz", ".zip")
        Compress-Archive -Path $existingFiles -DestinationPath $zipName -Force
        $ArchiveName = $zipName
        Write-Log "Archive created: $ArchiveName"
    }

    # STEP 3: Upload archive to server
    Write-Step "3" "Uploading archive to server"
    Write-Log "Copying $ArchiveName to server..."
    
    & scp "$ArchiveName" "$Username@$ServerIP`:$DeployDir/"
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to copy archive to server!"
    }
    Write-Log "Archive uploaded successfully"

    # STEP 4: Upload deploy script to server
    Write-Step "4" "Uploading deploy script to server"
    Write-Log "Copying deploy script to server..."
    
    & scp "deploy-configs/deploy-nextjs15/deploy-script.sh" "$Username@$ServerIP`:$DeployDir/"
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to copy deploy script to server!"
    }
    Write-Log "Deploy script uploaded"

    # STEP 5: Execute deployment on server
    Write-Step "5" "Executing deployment on server"
    Write-Log "Running deploy script on server..."
    
    & ssh "$Username@$ServerIP" "cd $DeployDir; chmod +x deploy-script.sh; ./deploy-script.sh $ArchiveName $ServerIP"
    
    if ($LASTEXITCODE -ne 0) {
        throw "Deployment failed on server!"
    }
    
    Write-Log "Deployment completed successfully!"

    # Clean up local archive
    Remove-Item $ArchiveName -Force
    Write-Log "Local archive removed"
    
    # STEP 6: Final check
    Write-Step "6" "Final verification"
    Write-Log "Checking application availability..."
    
    Start-Sleep -Seconds 10
    
    try {
        $response = Invoke-WebRequest -Uri "http://$ServerIP`:3000" -TimeoutSec 15 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Log "Application is responding successfully!"
        } else {
            Write-Warning "Application responding with code: $($response.StatusCode)"
        }
    }
    catch {
        Write-Warning "Cannot verify application availability: $_"
        Write-Log "Checking PM2 status on server..."
        & ssh "$Username@$ServerIP" "pm2 status"
    }
    
    Write-Host @"

DEPLOYMENT COMPLETED SUCCESSFULLY!
===============================================================
URL: http://$ServerIP`:3000
Status: Application running
PM2: studio-nextjs15
Directory: $DeployDir
PM2 Logs: ssh $Username@$ServerIP "pm2 logs studio-nextjs15"
===============================================================
"@ -ForegroundColor Green

} catch {
    Write-Error "Critical error: $_"
}
