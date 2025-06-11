# Simple Deploy Script v3.0 for Studio App (Next.js 15)
param(
    [string]$ServerIP = "157.180.87.32",
    [string]$Username = "deployuser",
    [string]$DeployDir = "/var/www/studio-app",
    [string]$ArchiveName = "studio-deploy-v3.tar.gz",
    [switch]$CleanServer = $false,
    [switch]$CreateAdmin = $true
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
}

Write-Host "Starting Studio App Deploy v3.0..." -ForegroundColor Cyan
Write-Host "Server: $ServerIP" -ForegroundColor Cyan
Write-Host "User: $Username" -ForegroundColor Cyan
Write-Host "Deploy Dir: $DeployDir" -ForegroundColor Cyan
Write-Host "Archive: $ArchiveName" -ForegroundColor Cyan
Write-Host "Clean Server: $CleanServer" -ForegroundColor Cyan
Write-Host "Create Admin: $CreateAdmin" -ForegroundColor Cyan

try {
    # Step 0: Clean server if requested
    if ($CleanServer) {
        Write-Log "Cleaning server..."
        & ssh "$Username@$ServerIP" "pm2 delete all 2>/dev/null || true"
        & ssh "$Username@$ServerIP" "pm2 kill 2>/dev/null || true"
        & ssh "$Username@$ServerIP" "lsof -ti:3000 | xargs kill -9 2>/dev/null || true"
        & ssh "$Username@$ServerIP" "rm -rf $DeployDir"
        & ssh "$Username@$ServerIP" "mkdir -p $DeployDir"
        & ssh "$Username@$ServerIP" "pm2 flush 2>/dev/null || true"
        Write-Log "Server cleaned"
    }

    # Step 1: Check and create public folder
    Write-Log "Checking public folder..."
    if (-not (Test-Path "public")) {
        Write-Log "Creating public folder..."
        New-Item -ItemType Directory -Path "public" -Force | Out-Null
        
        # Create robots.txt
        "User-agent: *`nAllow: /`n`nSitemap: http://$ServerIP`:3000/sitemap.xml" | Out-File -FilePath "public/robots.txt" -Encoding UTF8
        
        # Create simple next.svg
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80"><path fill="#000" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0Z"/></svg>' | Out-File -FilePath "public/next.svg" -Encoding UTF8
        
        # Create simple vercel.svg
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 283 64"><path fill="black" d="m141.04 16 c0 11 9 20 20 20s20-9 20-20-9-20-20-20-20 9-20 20z"/></svg>' | Out-File -FilePath "public/vercel.svg" -Encoding UTF8
        
        Write-Log "Public folder created with files"
    } else {
        Write-Log "Public folder already exists"
    }

    # Step 2: Build project
    Write-Log "Building project..."
    $buildResult = & npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed!"
    }
    Write-Log "Build completed"

    # Step 3: Create archive
    Write-Log "Creating archive..."
    if (Test-Path $ArchiveName) {
        Remove-Item $ArchiveName -Force
    }
    
    $filesToArchive = @(".next", "package.json", "package-lock.json", "next.config.js", "src", "public")
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

    # Step 4: Upload archive
    Write-Log "Uploading archive to server..."
    & scp "$ArchiveName" "$Username@$ServerIP`:$DeployDir/"
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to upload archive!"
    }
    Write-Log "Archive uploaded"

    # Step 5: Upload deploy script
    Write-Log "Uploading deploy script..."
    & scp "deploy-configs/deploy-nextjs15/deploy-script-v3.sh" "$Username@$ServerIP`:$DeployDir/deploy-script.sh"
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to upload deploy script!"
    }
    Write-Log "Deploy script uploaded"

    # Step 6: Execute deploy on server
    Write-Log "Executing deploy on server..."
    $deployArgs = "$ArchiveName $ServerIP"
    if ($CreateAdmin) {
        $deployArgs += " --create-admin"
    }
    
    & ssh "$Username@$ServerIP" "cd $DeployDir; chmod +x deploy-script.sh; ./deploy-script.sh $deployArgs"
    
    if ($LASTEXITCODE -ne 0) {
        throw "Deploy execution failed!"
    }
    
    Write-Log "Deploy completed successfully!"

    # Clean up local archive
    Remove-Item $ArchiveName -Force
    Write-Log "Local archive removed"
    
    # Step 7: Final check
    Write-Log "Checking application availability..."
    Start-Sleep -Seconds 15
    
    try {
        $response = Invoke-WebRequest -Uri "http://$ServerIP`:3000" -TimeoutSec 15 -UseBasicParsing
        if ($response.StatusCode -eq 307 -or $response.StatusCode -eq 200) {
            Write-Log "Application is responding! Status: $($response.StatusCode)"
        } else {
            Write-Warning "Application responding with unexpected status: $($response.StatusCode)"
        }
    }
    catch {
        Write-Warning "Cannot check application availability: $_"
        Write-Log "Checking PM2 status on server..."
        & ssh "$Username@$ServerIP" "pm2 status"
    }
    
    # Step 8: Check auth page
    Write-Log "Checking auth page..."
    try {
        $authResponse = Invoke-WebRequest -Uri "http://$ServerIP`:3000/auth" -TimeoutSec 15 -UseBasicParsing
        if ($authResponse.StatusCode -eq 200) {
            Write-Log "Auth page is available!"
        } else {
            Write-Warning "Auth page responding with status: $($authResponse.StatusCode)"
        }
    }
    catch {
        Write-Warning "Cannot check auth page: $_"
    }
    
    Write-Host "`n=== DEPLOY COMPLETED SUCCESSFULLY ===" -ForegroundColor Green
    Write-Host "URL: http://$ServerIP`:3000" -ForegroundColor Green
    Write-Host "Auth: http://$ServerIP`:3000/auth" -ForegroundColor Green
    Write-Host "Admin: admin@taskverse.test / password" -ForegroundColor Green
    Write-Host "PM2: studio-nextjs15" -ForegroundColor Green
    Write-Host "Directory: $DeployDir" -ForegroundColor Green
    Write-Host "Logs: ssh $Username@$ServerIP `"pm2 logs studio-nextjs15`"" -ForegroundColor Green
    Write-Host "====================================" -ForegroundColor Green

} catch {
    Write-Error "Critical error: $_"
    exit 1
}
