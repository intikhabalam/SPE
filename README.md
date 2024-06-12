This article outlines the steps needed to deploy Microsoft embedded this article will walk through the steps for full deployment with minimal usage of scripts

Each Section will be in the format
Heading:
Blurb about what we are doing in this step
Actions that need to be completed

Before you begin there are some Pre-Requsites that are required.

1. Global Admin: SharePoint Online
2. Global Admin: Azure


# Step 1: Enable SharePoint Containers on your SharePoint Online tenant

This is now enabled by default on all tenants. You cannot see this menu unless you are the global admin of a tenant see: Pre-Requsites

# Step 2: Create App Registration

Log into Azure and navigate to App Registrations https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade

Select new Registration
![image](https://github.com/intikhabalam/SPE/assets/171198457/81c767d8-0ca7-45a6-a1c1-2fab540c1834)

Name: My Embedded App
Supported account types: Accounts in this organisational dectory only(Single Tenant)
![image](https://github.com/intikhabalam/SPE/assets/171198457/29ee8b00-d5c9-4b1b-bb2d-86cfd319a2cd)

Copy down the Application (Client) ID & Directory (tenant) ID as you will need these later

# Step 3: Configure Authentication
This is the Public URL of the Embedded app

Select Manage > Authentication from the left navigation menu
{Image for authentication}

on the Configure single-page application pane, set the Redirect URL to [URL of Embedded App]
{Image for Menu}


# Step 4: Configure API Permissions

This step you need to configure the API permissions for the app. What you are setting here is the the FileStorageContainer.Selected and Container.Selected permissions these are included on top of the existing User.Read Permissions 

navigate to the Manage -> Manifest. The following will need to be added to the manifest

Search the minifest for the following **resourceAppID: 00000003-0000-0000-c000-000000000000** and update it so it matches the below code which sets the **FileStorageContainer.Selected** permission 
```
{
  "resourceAppId": "00000003-0000-0000-c000-000000000000",
  "resourceAccess": [
    {
      "id": "085ca537-6565-41c2-aca7-db852babc212",
      "type": "Scope"
    },
    {
      "id": "40dc41bc-0f7e-42ff-89bd-d9516947e474",
      "type": "Role"
    }
  ]
}
```

Next Search the minifest for the following **resourceAppID: 00000003-0000-0ff1-ce00-000000000000** and update it so it matches the below code which sets the **Container.Selected** permission 
```
{
  "resourceAppId": "00000003-0000-0ff1-ce00-000000000000",
  "resourceAccess": [
    {
      "id": "4d114b1a-3649-4764-9dfb-be1e236ff371",
      "type": "Scope"
    },
    {
      "id": "19766c1b-905b-43af-8756-06526ab42875",
      "type": "Role"
    }
  ]
},
```

# Step 5: Create Client Secret 
For the app to authenticate through Azure and M365 you will need a new client secret. you will need to note down the secret as this will only appear one time

Select manage -> Certificates and Secrets
{Image of Secret Menu}

Set the Details of the certificate
- Description
- Secret duration

# Step 6: Create container Type
This step we need to create the container type. At th etime of writing there are no UI options to create this therefore you will need to run powershell. 

On your computer run powershell as administrator. You will need the Sharepoint powershell module.

If you dont have the module you can install it using the following.
```
Install-Module "Microsoft.Online.SharePoint.PowerShell"
```
or if you have it installed 
```
Update-Module "Microsoft.Online.SharePoint.PowerShell"
```

When this has been installed / updated you then need to run the following to create the container type.

- {SPO_ADMIN_URL} = This is the sharepoint admin url.
- {CONTAINER_TYPE_NAME} = This is the name of the new container eg "MyFirstSpeContainerType"
- {AZURE_ENTRA_APP_ID} = This is the Client ID of the app created in Step 2

```
Import-Module "Microsoft.Online.SharePoint.PowerShell"
Connect-SPOService -Url "https://{{SPO_ADMIN_URL}}"
New-SPOContainerType -TrialContainerType
                     -ContainerTypeName "{{CONTAINER_TYPE_NAME}}"
                     -OwningApplicationId "{{AZURE_ENTRA_APP_ID}}"
```

After this has been executed the output shoule be similar to the following
```
Container Type ID:
===============================================================================
ContainerTypeId     : 1e59a44b-b77e-051e-3cba-dbf83007b520
ContainerTypeName   : MyFirstSpeContainerType
OwningApplicationId : 520e6e65-1143-4c87-a7d3-baf242915dbb
Classification      : Trial
AzureSubscriptionId : 00000000-0000-0000-0000-000000000000
ResourceGroup       :
Region              :
```
Note down the container type ID as this will be required later






