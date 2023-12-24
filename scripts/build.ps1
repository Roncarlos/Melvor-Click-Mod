$sourceFolder = "./mod"
$destinationFolder = "./deploy"

# Create the destination folder if it doesn't exist
if (-not (Test-Path -Path $destinationFolder)) {
    Write-Host "Creating destination folder $destinationFolder"
    New-Item -ItemType Directory -Path $destinationFolder | Out-Null
}

$zipFileName = "mod.zip"
$zipFilePath = Join-Path -Path $destinationFolder -ChildPath $zipFileName

# Before compression copy eveyrthing from the source folder to deploy/temp
Write-Host "Copying files from $sourceFolder to $destinationFolder/temp"
Copy-Item -Path $sourceFolder -Destination "$destinationFolder/temp" -Recurse -Force

# Now replace inside the temp folder manifest.json file the version with the current date "YYYY.MM.DD.HHMM"

$manifestFilePath = Join-Path -Path $destinationFolder -ChildPath "temp/manifest.json"

Write-Host "Updating manifest file $manifestFilePath"
$manifest = Get-Content -Path $manifestFilePath -Raw | ConvertFrom-Json

$manifest.version = (Get-Date).ToString("yyyy.MM.dd.HHmm")
Write-Host "New version is $($manifest.version)"

Write-Host "Saving manifest file $manifestFilePath"
$manifest | ConvertTo-Json -Depth 100 | Set-Content -Path $manifestFilePath -Encoding UTF8


# Now compress the temp folder content into a zip file
Write-Host "Compressing $destinationFolder/temp into $zipFilePath"
Compress-Archive -Path "$destinationFolder/temp/*" -DestinationPath $zipFilePath -Force
