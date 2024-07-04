param (
    [string]$resourceGroupName,
    [string]$staticWebAppName
)

# Deploy Azure Static Webapp
az deployment group create --resource-group $resourceGroupName --template-file .github/workflows/staticwebapp.bicep --parameters .github/workflows/parameters.json --parameters resourceGroupName=$resourceGroupName --parameters staticWebAppName=$staticWebAppName

# Get the Static Web App token
$staticWebAppToken = az staticwebapp secrets list -n $staticWebAppName --resource-group $resourceGroupName --query "properties.apiKey" -o tsv
Write-Output "STATIC_WEBAPP_TOKEN=$staticWebAppToken" >> $env:GITHUB_ENV

# Get the Static Web App URL
$staticWebAppUrl = az staticwebapp show -n $staticWebAppName --resource-group $resourceGroupName --query "defaultHostname" -o tsv
Write-Output "STATIC_WEBAPP_URL=$staticWebAppUrl" >> $env:GITHUB_ENV

