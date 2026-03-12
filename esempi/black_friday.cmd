@echo off
(
echo window.CMD_PARAMS = { 
echo   users: 3000, counters: 20, avgTime: 4, multiplier: 100, web: 150, db: 400,
echo   traffic: [
echo     { h: '08:00', users: 300 }, { h: '10:00', users: 750 }, { h: '12:00', users: 950 }, { h: '14:00', users: 600 }
echo   ]
echo };
) > ..\params.js
start ..\index.html
echo Caricato scenario: Black Friday (Dati Unici)
pause
