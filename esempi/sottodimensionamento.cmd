@echo off
(
echo window.CMD_PARAMS = { 
echo   users: 400, counters: 4, avgTime: 10, multiplier: 100, web: 80, db: 200,
echo   traffic: [
echo     { h: '08:00', users: 15 }, { h: '11:00', users: 45 }, { h: '14:00', users: 30 }, { h: '18:00', users: 10 }
echo   ]
echo };
) > ..\params.js
start ..\index.html
echo Caricato scenario: Sottodimensionamento (Dati Unici)
pause
