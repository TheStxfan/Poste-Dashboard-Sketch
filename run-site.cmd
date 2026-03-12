@echo off

start "" "%localappdata%\Programs\Python\Python314\python.exe" -m http.server 8000
start http://localhost:8000/

exit