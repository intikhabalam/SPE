This article provides a comprehensive manual for deploying Microsoft Embedded systems. It guides you through the entire deployment process with a focus on minimizing the use of scripts.


Before you begin there are some Pre-Requsites that are required.

1. Global Admin: SharePoint Online
2. Global Admin: Azure
3. Application: [PostMan](https://www.postman.com/downloads/)


# Step 1: Enable SharePoint Containers on your SharePoint Online tenant

**This is now enabled by default on all tenants. You cannot see this menu unless you are the global admin of a tenant see: Pre-Requsites**

To enable SharePoint Embedded navigate to the M365 admin centre https://portal.microsoft.com and sign in with the tenant admin account

Select Show All at the bottom of the left-hand menu, then select **Admin Centers -> SharePoint** 
<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/7899aa7d-6b36-4bde-98df-722c6bca2837)</kbd>

From the SharePoint Admin menu, select **Settings** from the left menu Locate and select SharePoint Embedded and review the terms of service and select Enable to enable on your tenant
<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/1c60ac95-aeeb-4249-af04-bb3ee1cf175d)</kbd>

If this setting is currently enabled you dont need to re-enable this.

# Step 2: Create App Registration

Application management in Microsoft Entra ID (Microsoft Entra ID) is the process of securely creating, configuring, managing, and monitoring applications in the cloud. When you register your application in a Microsoft Entra tenant, you configure secure user access.

Log into Azure and navigate to **App Registrations** https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade

Select **New Registration**
<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/81c767d8-0ca7-45a6-a1c1-2fab540c1834)</kbd>

**Name:** My Embedded App

**Supported account types:** Accounts in this organisational dectory only(Single Tenant)
<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/29ee8b00-d5c9-4b1b-bb2d-86cfd319a2cd)</kbd>

Copy down the **Application (Client) ID** & **Directory (tenant) ID** as you will need these later

## Step 2.1: Configure Authentication
This is the Public URL of the Embedded app

Select **Manage -> Authentication** from the left navigation menu

On the Configure single-page application pane, set the Redirect URL to [URL of Embedded App]
<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/cf2ba317-454e-40c6-82b7-e1cd88b0c13d)</kbd>





## Step 2.2: Configure API Permissions

This step you need to configure the API permissions for the app. What you are setting here is the the Container permissions.
<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/e3b0e62b-dd57-49e5-aa8d-3a4f7fd2ee50)</kbd>

navigate to the **Manage -> Manifest**. The following will need to be added to the manifest

Search the minifest for the following **resourceAppID: 00000003-0000-0000-c000-000000000000** and update it so it matches the below code which sets the **FileStorageContainer.Selected** permission 
```
{
  "resourceAppId": "00000003-0000-0000-c000-000000000000",
  "resourceAccess": [
      {
          "id": "37f7f235-527c-4136-accd-4a02d197296e",
          "type": "Scope"
      },
      {
          "id": "14dad69e-099b-42c9-810b-d002981feec1",
          "type": "Scope"
      },
      {
          "id": "7427e0e9-2fba-42fe-b0c0-848c9e6a8182",
          "type": "Scope"
      },
      {
          "id": "085ca537-6565-41c2-aca7-db852babc212",
          "type": "Scope"
      },
      {
          "id": "e1fe6dd8-ba31-4d61-89e7-88639da4683d",
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
      },
      {
          "id": "640ddd16-e5b7-4d71-9690-3f4022699ee7",
          "type": "Scope"
      }
  ]
}
],
```

## Step 2.3: Create Client Secret 
For the app to authenticate through Azure and M365 you will need a new client secret. you will need to note down the secret as this will only appear one time

Select **Manage -> Certificates and Secrets**
{Image of Secret Menu}

Set the Details of the certificate
- Description
- Secret duration

## Step 2.4: Create container Type
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
- {CONTAINER_TYPE_NAME} = This is the name of the new container. this can be anything you like
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

## Step 2.5: Create a Self signed Certificate
This step you will need to create a self signed certificate. this certificate is what is used for the app to securely connect with SharePoint. 

On your local Desktop open a powershell window as administrator run the below powershell code updating the following 

- {CERT NAME} = the name of the certificate. This can be anything you like
- {CERT_PATH} = The fully qualified path to the location of the *.cer file, such as c:\mycert.cer.

```
$cert = New-SelfSignedCertificate -Subject "CN={{CERT_NAME}}" -CertStoreLocation "Cert:\CurrentUser\My" -KeyExportPolicy Exportable -KeySpec Signature -KeyLength 2048 -KeyAlgorithm RSA -HashAlgorithm SHA256
Export-Certificate -Cert $cert -FilePath "{{CERT_PATH}}" -Force

# Private key to Base64
$privateKey = [System.Security.Cryptography.X509Certificates.RSACertificateExtensions]::GetRSAPrivateKey($cert)
$privateKeyBytes = $privateKey.Key.Export([System.Security.Cryptography.CngKeyBlobFormat]::Pkcs8PrivateBlob)
$privateKeyBase64 = [System.Convert]::ToBase64String($privateKeyBytes, [System.Base64FormattingOptions]::InsertLineBreaks)
$privateKeyString = @"
-----BEGIN PRIVATE KEY-----
$privateKeyBase64
-----END PRIVATE KEY-----
"@

# Print private key to output
Write-Host $privateKeyString
```

This will save a *.cer certificate file and in the powershell window you will have the private key displayed. Copy down the private key as this will only be displayed once and you will need it later. Be sure to also copy the opening and closing tags as well "-----BEGIN PRIVATE KEY-----" and "-----END PRIVATE KEY-----"

In the App Registraion from Step 2 select **Manage -> Certificates & Secrets** and Select **Certificates**

<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/f07ac849-bf82-4f1f-8993-452e6ef46d76)</kbd>

Upload the *.cer by selecting Upload certificate and navigate to the location where the *.cer is located. Make a note of the Thumbprint of certificate as this will be needed for later.

# Step 3: Registering the Container Type
These next steps are using commands to register the container type in SharePoint. There are no active menus to currently complete this so it is advised that SharePoint Rest API commands are used to complete these actions.

As per the the Postman pre requsite there is a handy  






















