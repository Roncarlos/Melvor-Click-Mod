$sourceFolder = "../mod"
$destinationFolder = "../deploy"

# Create the destination folder if it doesn't exist
if (-not (Test-Path -Path $destinationFolder)) {
    New-Item -ItemType Directory -Path $destinationFolder | Out-Null
}

$zipFileName = "mod.zip"
$zipFilePath = Join-Path -Path $destinationFolder -ChildPath $zipFileName

# Before compression copy eveyrthing from the source folder to deploy/temp

Copy-Item -Path $sourceFolder -Destination "$destinationFolder/temp" -Recurse -Force

# Now replace inside the temp folder manifest.json file the version with the current date "YYYY.MM.DD.HHMM"

$manifestFilePath = Join-Path -Path $destinationFolder -ChildPath "temp/manifest.json"

$manifest = Get-Content -Path $manifestFilePath -Raw | ConvertFrom-Json

$manifest.version = (Get-Date).ToString("yyyy.MM.dd.HHmm")

$manifest | ConvertTo-Json -Depth 100 | Set-Content -Path $manifestFilePath -Encoding UTF8

# Now compress the temp folder content into a zip file

Compress-Archive -Path "$destinationFolder/temp/*" -DestinationPath $zipFilePath -Force
