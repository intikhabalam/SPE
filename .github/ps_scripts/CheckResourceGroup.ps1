param (
    [string]$resourceGroupName,
    [string]$location
)

try {
    # Check if the resource group exists
    $resourceGroup = az group show --name $resourceGroupName -o json
    Write-Output "Resource Group $resourceGroupName already exists"
    echo "rg_exists=true" >> $env:GITHUB_ENV
} catch {
    # If the resource group does not exist, create it
    if ($_ -match "ResourceGroupNotFound") {
        az group create --name $resourceGroupName --location $location
        Write-Output "Resource Group $resourceGroupName created."
        echo "rg_exists=false" >> $env:GITHUB_ENV
    } else {
        # If there's another error, output the error message and fail the script
        Write-Error "An error occurred: $_"
        exit 1
    }
}
