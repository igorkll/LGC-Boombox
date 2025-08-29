REM === LGCBoombox software updater ===

REM === Kill processes ===
taskkill /IM boomUI.exe /F >nul 2>&1
taskkill /IM AudioCapture.exe /F >nul 2>&1
taskkill /IM A2DPSink.exe /F >nul 2>&1

REM === Get the current script folder ===
setlocal
set "SRC=%~dp0"
set "DST=C:\WinboxProgram"

REM === Create destination folder if it does not exist ===
if not exist "%DST%" mkdir "%DST%"

REM === Copy all files and subfolders with overwrite ===
xcopy "%SRC%*" "%DST%\" /E /H /C /Y

REM === Launch boomUI.exe from the new folder ===
start "" "%DST%\boomUI.exe"

endlocal
exit
