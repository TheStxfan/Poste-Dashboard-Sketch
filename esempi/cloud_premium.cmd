@echo off
(
echo window.CMD_PARAMS = { 
echo   users: 1500, counters: 15, avgTime: 5, multiplier: 100, web: 300, db: 700,
echo   traffic: [
echo     { h: '08:00', users: 55 }, { h: '12:00', users: 185 }, { h: '16:00', users: 120 }, { h: '20:00', users: 65 }
echo   ]
echo };
) > ..\params.js
start ..\index.html
echo Caricato scenario: Cloud Premium (Dati Unici)
pause
