@echo off
rem taskkill /im gulp /im gulp.exe /im node /im node.exe

rem set NODE

rem echo Nuking BUILD directory:
rem call rimraf build


call node --es_staging   .\node_modules\gulp\bin\gulp.js %1 %2 %3 %4 %5 %6 %7
