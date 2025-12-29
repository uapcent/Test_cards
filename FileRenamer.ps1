# ===== CONFIGURATION =====
$Folder = "C:\Users\pucl\Documents\Test_cards\assets\minifigures_images"
$From   = ".original.png"
$To     = ".png"
# =========================

if (-not (Test-Path $Folder)) {
    Write-Host "Invalid folder path"
    exit
}

Get-ChildItem -Path $Folder -File | ForEach-Object {
    if ($_.Name -like "*$From*") {
        $NewName = $_.Name.Replace($From, $To)
        $NewPath = Join-Path $_.DirectoryName $NewName

        if (-not (Test-Path $NewPath)) {
            Rename-Item -Path $_.FullName -NewName $NewName
            Write-Host "Renamed: $($_.Name) -> $NewName"
        } else {
            Write-Host "Skipped (target exists): $NewName"
        }
    }
}
