@echo off
taskkill /im gulp
taskkill /im node
taskkill /im gulp
taskkill /im node

node --es_staging   .\node_modules\gulp\bin\gulp.js %1 %2 %3 %4 %5 %6 %7
