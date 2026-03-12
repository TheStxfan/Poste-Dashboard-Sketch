@echo off
(
echo window.CMD_PARAMS = { 
echo   users: 5000, counters: 2, avgTime: 15, multiplier: 100, web: 1000, db: 2000,
echo   traffic: [
echo     { h: '08:00', users: 200 }, { h: '13:00', users: 1500 }, { h: '18:00', users: 200 }
echo   ]
echo };
) > ..\params.js
start ..\index.html
echo Caricato scenario: STRESS TEST (Dati Unici)
pause
