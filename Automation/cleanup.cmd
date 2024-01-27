del /q "..\dist"
FOR /D %%p IN ("..\dist.*") DO rmdir "%%p" /s /q
