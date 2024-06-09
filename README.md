This article outlines the steps needed to deploy Microsoft embedded this article will can be followed by either a technical engineer deploying via scripts or an administrator of a tenant

Before you begin there are some Pre-Requsites that are required.

1. Global Admin: SharePoint Online
2. Global Admin: Azure


Step 1: Enable SharePoint Containers on your SharePoint Online tenant

This is enabled by default on all tenants. You cannot see this unless you are the global admin of a tenant see: Pre-Requsites

Step 2: Create App Registration

Log into Azure and navigate to App Registrations https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade

Select new Registration
![image](https://github.com/intikhabalam/SPE/assets/171198457/81c767d8-0ca7-45a6-a1c1-2fab540c1834)

Name: My Embedded App
Supported account types: Accounts in this organisational dectory only(Single Tenant)
![image](https://github.com/intikhabalam/SPE/assets/171198457/29ee8b00-d5c9-4b1b-bb2d-86cfd319a2cd)

Copy down the Application (Client) ID & Directory (tenant) ID as you will need these later

Configure Authentication
This is the URL 
