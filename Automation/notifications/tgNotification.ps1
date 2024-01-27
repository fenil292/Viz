try
{	
    Add-Type -AssemblyName System.Web	
		 
	$Env:APP_VERSION = (gc $ENV:APP_CHANGELOG -First 1)  
	$lines = (gc $ENV:APP_CHANGELOG -First 10 | select -first 10 -skip 1)
    $lineResult = [System.Collections.Arraylist]@()

    foreach ($line in $lines) 
    {
        if($line -eq ''){        
            break
        }
        else{
            $lineResult.Add($line+'<br/>')
        }    
    }

    $Env:APP_CHANGES = $lineResult
    $tgChanel = $ENV:tg_alias
	$app = $ENV:APP_NAME
    $version = $Env:APP_VERSION  
	$changes = $Env:APP_CHANGES
    $notifier = $ENV:notifier
    
    (gc release_tab_tg_template.html).replace("PH_APP", $app).replace("PH_VERSION", $version).replace("PH_CHANGES", $changes) | Out-File release_tab_tg.html	

	Write-Host "Notifier: '$notifier'" -ForegroundColor Green

	Start-Process -FilePath $notifier -ArgumentList "--p release_tab_tg.html --f TEST --c $tgChanel --m Html" -Wait -Verbose   
}
catch [System.Exception]
{
    $errType = $_.Exception.GetType().FullName
    $message = $_.Exception.Message

    Write-Host "ERROR: '$errType' '$message'" -ForegroundColor Red
    exit 1
}