Set WshShell = CreateObject("WScript.Shell")
strPath = WshShell.CurrentDirectory
WshShell.Run """" & strPath & "\INICIAR-KOR-GENERADORES.bat""", 0, False
Set WshShell = Nothing
