This article provides a comprehensive manual for deploying Microsoft Embedded systems. It guides you through the entire deployment process using all manual steps.


Before you begin there are some Pre-Requsites that are required.

1. Global Admin: SharePoint Online
2. Global Admin: Azure
3. Application: Windows Powershell
4. Application: [PostMan](https://www.postman.com/downloads/)
5. Application: Github account


# Pipeline deployment
While this has been automated to a high degree there are some manual steps that need to be added or completed as part of deployment process
## Step 1: Fork the SharePoint Embedded Repo
Create a new fork of the existing code. This will allow you to create any customisation that you want to the code will bringing over the automation pipelines for the deployment

Select **Fork - > Create new Fork** and create a new name
<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/20e1ce24-aa51-410b-9862-2d36d824d3d9)</kbd>
<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/a6d396e3-05d8-4203-bd46-14d002244104)</kbd>

Now that the we have a fork of the deployment code we will need to update some of the configuration variables. These are variables that are specific to you tenant.

Select **Settings -> Secrets and variables -> Actions**
<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/0d727d84-7c2b-4f63-8c67-617005822bd0)</kbd>

From this menu we will now create the folowing variables and secret

Variables:
1. AZURE_SERVICEPRICIPAL_CLIENT_ID : This is an App registration created to allow the pipeline to deploy into your subscription. See Step 1.2
2. AZURE_TENANT_ID: This is the azure tenant ID. 
3. SHAREPOINT_ADMIN_SITE_URL : This is the SharePoint administration site. This is in the format https://<TenantName>-admin.sharepoint.com

Secret:
1. AZURE_SUBSCRIPTION_ID: This is the ID of the subscription that you want to deploy into in Azure

## Step 1.2 Create App registration to allow for pipeline deployment
Application management in Microsoft Entra ID (Microsoft Entra ID) is the process of securely creating, configuring, managing, and monitoring applications in the cloud. When you register your application in a Microsoft Entra tenant, you configure secure user access. We will need this in order to deploy our Github pipeline to azure

Log into your Azure Subscription and navigate to **App Registrations** https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade

Select **New Registration**
<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/81c767d8-0ca7-45a6-a1c1-2fab540c1834)</kbd>

**Name:** Name of the Registration. Name this something that would apply to your purpose eg "My Embedded App"

**Supported account types:** Accounts in this organisational dectory only(Single Tenant)
<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/29ee8b00-d5c9-4b1b-bb2d-86cfd319a2cd)</kbd>

After the registration has been created we will need to secure it, we do this by creating a federated credential which is a replacement for the Client Secret
<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/b93640c8-15f9-4eba-bf0c-58c8f56d5117)</kbd>

From here we will create a GitHub deployed action
<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/87c0b0b1-6fa7-46bc-9eff-a289fe053aa8)</kbd>

For the default values they are the following from Github.

**GitHub Details**
- Orgainsation : This is the name of your repositiory
- Respoitory : This is the name of the forked repository
- Entity Type : Set this to Branch
- GitHub Branch Name : Set this to main

**Credential Details**
-  Name : This is a name for this credential
-  Description : Description of the credential


<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/494c7cd2-826b-4e49-ac27-534f8f51e3d4)</kbd>

Copy the application ID and set the variable AZURE_SERVICEPRICIPAL_CLIENT_ID to this value

## Step 1.3 Setting the rights of the app registration
We now need to set the permissions of the app registration to allow it to deploy out the code and set the variables and configurations needed for the applciation

Navigate to your subscription and select **Access Control (IAM) -> Add -> Add Role Assignment**

<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/3c2908d5-e251-4429-a870-96b855870ed1)</KBD>

We are planning to assign the app refgistraion owner permissions at this time to allow it to complete its actions [Permissions are still being validated for least privledges] 

<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/97de4aca-4f6a-442f-8a3d-2b3c06a11fd9)</kbd>

Select **Owner** and selct **Next**

<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/6ac42dd1-f181-473b-b21c-e97619f6a8da)</kbd>

Select Members and we want to add the name of the service pricipal that wa created above in step 1.2.

After the App Registration has been select **Next**. Select the Recommended "Allow user to assign all roles execpt privileged administrator roles Owner,UAA, BBAV"  

<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/62576f31-cfef-48c5-83d1-aad5d7fc56ca)</kbd>

Select **Next** and then **Review + Assign**

This will allow the Github pipeline to now deploy into your azure subscription


# Step 2: Deploy the GitHub Pipeline
Now that you have configure the access for the Github to deploy into azure you are now ready to deploy the pipeline

In Github Select Actions. And if you have not deployed a pipline before you will need to authorise and enable the pipelines

<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/d6907c1d-3fe3-40f8-9fe3-fbf35bf898ca)</kbd>

The pipeline that you need to run is the Deploy SharePoint Container Pipeline

<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/7470eba7-e6f1-4570-bcfc-a376c4b29bf7)</kbd>

Select the pipeline and select the main branch and select Run workflow

<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/3c8f2619-756d-47da-84f7-6020e0e5a8a2)</kbd>

The Pipeline deployment can take upwards to 15min to fully deploy and has 3 instances where you need to manually approve an Action

<KBD>![image](https://github.com/intikhabalam/SPE/assets/171198457/e52662d5-ebad-4fc6-ab1b-40f9226b416b)</KBD>

These steps will look like this
<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/f41f7cef-93ab-4683-bbf3-fb534921e2a0)</kbd>
















































































# Manual Steps
## Step 1: Enable SharePoint Containers on your SharePoint Online tenant

**This is now enabled by default on all tenants. You cannot see this menu unless you have the SharePoint Embedded Administrator role. Global Admin has this permission by default**

To confirm that SharePoint Embedded is enabled navigate to the SharePoint admin centre by navigating to https://portal.microsoft.com and signning in with the tenant admin account

<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/7899aa7d-6b36-4bde-98df-722c6bca2837)</kbd>
<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/1cae2c07-f3b8-4157-a381-3c91091e32b0)</kbd>

**Currently there is a limit on the number of containers that can be active at one time through using SharePoint Embedded which is 5. This also includes containers that are deleted if you need to create a new container you will need to delete an existing container and permanantly delete it from the deleted location**

## Step 2: Create App Registration

Application management in Microsoft Entra ID (Microsoft Entra ID) is the process of securely creating, configuring, managing, and monitoring applications in the cloud. When you register your application in a Microsoft Entra tenant, you configure secure user access.

Log into your Azure Subscription and navigate to **App Registrations** https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade

Select **New Registration**
<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/81c767d8-0ca7-45a6-a1c1-2fab540c1834)</kbd>

**Name:** Name of the Registration. Name this something that would apply to your purpose eg "My Embedded App"

**Supported account types:** Accounts in this organisational dectory only(Single Tenant)
<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/29ee8b00-d5c9-4b1b-bb2d-86cfd319a2cd)</kbd>

Copy down the **Application (Client) ID** & **Directory (tenant) ID** as you will need these later

### Step 2.1: Configure Authentication
This is the Public URL of the Embedded app and any urls that are in the app

Select **Manage -> Authentication** from the left navigation menu

On the Configure single-page application pane, set the Redirect URL to [URL of Embedded App]
<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/cf2ba317-454e-40c6-82b7-e1cd88b0c13d)</kbd>





### Step 2.2: Configure API Permissions

This step you need to configure the API permissions for the app. What you are setting here is the the Graph API permissions that the app reigstration is allowed to use / allowed access to. This is based on the least privledges principal.
<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/e3b0e62b-dd57-49e5-aa8d-3a4f7fd2ee50)</kbd>

Navigate to the **Manage -> Manifest**. The following will need to be added to the manifest

Search the minifest for the following **resourceAppID: 00000003-0000-0000-c000-000000000000** and update it so it matches the below code. This sets all the Microsoft Graph permissions as shown in the image above
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

Next Search the minifest for the following **resourceAppID: 00000003-0000-0ff1-ce00-000000000000** and update it so it matches the below code. This sets the permissions for SharePoint Online
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

When you have updated the Manifest you will need to approve and authorise the permissions. You would normally set the the button "Grant admin consent for {{Tenant Name}}" but due to their being permissions being set that do not have a qualified name at this time (See IDs in the image above) the option does not work. In order to approve the permissions you will need to go into the Enterprise application and approve it through here instead

--Screenshots of Enterprise app accept permissions--

### Step 2.3: Create Client Secret 
For the app to authenticate through Azure and M365 you will need a new client secret on the app registration. You will need to note down the secret as this will only appear one time when you create the secret. You are also unable to view a previously created secret.

Select **Manage -> Certificates and Secrets**
<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/97802d92-f653-4a1d-89d2-0226d56c1cd0)</kbd>


Set the Details of the Secret
- Description: Name of the secret e.g. EmbeddedSecret
- Secret duration Eg 1year

### Step 2.4: Create container Type
This step we need to create the container type. At the time of writing there are no UI options to create this therefore this will need to be created using powershell. 

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

### Step 2.5: Create a Self signed Certificate
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

## Step 3: Registering the Container Type
These next steps are using commands to register the container type in SharePoint. There are no active menus to currently complete this so it is advised that SharePoint Rest API commands are used to complete these actions.

As per the the Postman pre requsite there is a git repo with all the required Rest commands ready for you to use
https://github.com/microsoft/SharePoint-Embedded-Samples


Download the Zip file from the about github Repo. **Code -> Download Zip**
<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/02492231-5a05-4c33-9041-e670825c2fe6)</kbd>

Unzip the package and open Postman. Select Import and select the unzipped files 

<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/548eb9ae-5a74-4e82-90bc-a54aca09a079)</kbd>

<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/73786d2a-8cb8-4335-99b6-af2e4fd4f3d6)</kbd>

Select the Enviroments tab and add the following information

- **ClientID:** This is the Secret ID created in Step 2.3
- **ClientSecret:** This is the Secret Password created in Step 2.3
- **ConsumingTenantId:** This is your tenant and is found in Azure when you select your subscription
- **TenantName:** The name of your tenant. That's subdomain portion of your SharePoint Online site.
- **RootSiteUrl:** The root URL of your tenant.
- **ContainerTypeID:** The GUID of the Container Type created in Step 2.4
- **CertThumbprint:** This is the thumbprint that is shown in Step 2.5
- **CertPrivateKey:** This is the private key of the cert which includes "-----BEGIN PRIVATE KEY-----" and "-----END PRIVATE KEY-----"

<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/b9323b1c-a7c3-401b-9192-b0164f237bb8)</kbd>

When you have set these up you then need to run the **Register ContainerType** located under **Application -> Containers**

--Add Steps here on running the command and the expected result--

--Add Manual Steps to authenticate here--

















