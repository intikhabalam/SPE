param (
    [string]$staticWebAppName,
    [string]$resourceGroupName
)

# Check if the static web app exists
$staticWebApp = az staticwebapp show --name $staticWebAppName --resource-group $resourceGroupName -o json 2>&1

if ($staticWebApp -notmatch "ResourceNotFound") {
    Write-Output "Static Web App exists."
    Write-Output "staticWebApp_exists=true" >> $env:GITHUB_ENV
} else {
    Write-Output "Static Web App does not exist."
    Write-Output "staticWebApp_exists=false" >> $env:GITHUB_ENV
}
