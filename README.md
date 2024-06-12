This article outlines the steps needed to deploy Microsoft embedded this article will walk through the steps for full deployment with minimal usage of scripts

## Each Section will be in the format
## Heading:
## Blurb about what we are doing in this step
## Actions that need to be completed

Before you begin there are some Pre-Requsites that are required.

1. Global Admin: SharePoint Online
2. Global Admin: Azure


Step 1: Enable SharePoint Containers on your SharePoint Online tenant

This is now enabled by default on all tenants. You cannot see this menu unless you are the global admin of a tenant see: Pre-Requsites

Step 2: Create App Registration

Log into Azure and navigate to App Registrations https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade

Select new Registration
![image](https://github.com/intikhabalam/SPE/assets/171198457/81c767d8-0ca7-45a6-a1c1-2fab540c1834)

Name: My Embedded App
Supported account types: Accounts in this organisational dectory only(Single Tenant)
![image](https://github.com/intikhabalam/SPE/assets/171198457/29ee8b00-d5c9-4b1b-bb2d-86cfd319a2cd)

Copy down the Application (Client) ID & Directory (tenant) ID as you will need these later

Step 3: Configure Authentication
This is the Public URL of the Embedded app

Select Manage > Authentication from the left navigation menu
{Image for authentication}

on the Configure single-page application pane, set the Redirect URL to [URL of Embedded App]
{Image for Menu}


Step 4: COnfigure API Permissions

This step you need to configure the API permissions for the app. What you are setting here is the the FileStorageContainer.Selected and Container.Selected permissions these are included on top of the existing User.Read Permissions 

navigate to the Manage -> Manifest. The following will need to be added to the manifest





















