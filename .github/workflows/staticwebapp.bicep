@description('Name of the Static Web App')
param staticWebAppName string

@description('Name of the Resource Group where the Static Web App will be created')
param resourceGroupName string

@description('Prefix for resource group and static webapp')
param resourcePrefix string

@description('Location of the resource')
param location string

@description('SKU name for the Static Web App')
param skuName string

@description('SKU tier for the Static Web App')
param skuTier string

@description('GitHub Repository URL')
param repositoryUrl string

@description('Branch of the repository')
param branch string

@description('Environment tag')
param environment string

@description('Project tag')
param project string

resource staticSite 'Microsoft.Web/staticSites@2022-09-01' = {
  name: staticWebAppName
  location: location
  tags: {
    Environment: environment
    Project: project
  }
  sku: {
    name: skuName
    tier: skuTier
  }
  properties: {
    repositoryUrl: repositoryUrl
    branch: branch
    stagingEnvironmentPolicy: 'Enabled'
    allowConfigFileUpdates: true
    provider: 'GitHub'
    enterpriseGradeCdnStatus: 'Disabled'
  }
}

