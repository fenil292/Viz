	
if ($null -eq $env:notifier) 
{
    #for local test. Will get from GoCD
    $ENV:notifier = "C:\WORK\GIT\Framework\Utility\GO_CD_TOOLS\TelegramBotNotifier\TelegramBotNotifier.exe"	
}

$ENV:APP_CHANGELOG = "..\..\src\Changelog.txt"

$ENV:APP_NAME = "VizToc WEB"

if ($null -eq $env:tg_alias) 
{
    #for local test. Will get from GoCD
    $ENV:tg_alias = "ViztocTEST"
}

.\tgNotification.ps1