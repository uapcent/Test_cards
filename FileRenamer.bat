@echo off
setlocal enabledelayedexpansion

REM ===== CONFIGURATION =====
set "FOLDER=C:\Users\pucl\OneDrive - GFT Technologies SE\Documents\Projects\Test_cards\assets\minifigures_images"
set "FROM=.original.png"
set "TO=.png"
REM =========================

cd /d "%FOLDER%" || (
    echo Invalid folder path
    pause
    exit /b
)

for %%F in (*%FROM%*) do (
    set "OLDNAME=%%F"
    set "NEWNAME=!OLDNAME:%FROM%=%TO%!"

    if not exist "!NEWNAME!" (
        ren "%%F" "!NEWNAME!"
        echo Renamed: %%F ^> !NEWNAME!
    ) else (
        echo Skipped (target exists): !NEWNAME!
    )
)

pause
