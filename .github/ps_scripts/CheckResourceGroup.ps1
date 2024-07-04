param (
    [string]$resourceGroupName,
    [string]$location
)

# Check if the resource group exists
$resourceGroup = az group show --name $resourceGroupName -o json 2>&1

if ($resourceGroup -notmatch "ResourceNotFound") {
    Write-Output "Resource Group $resourceGroupName already exists"
    Write-Output "::set-output name=rg_exists::true"
} else {
    az group create --name $resourceGroupName --location $location
    Write-Output "Resource Group created."
}
# Exit script
exit