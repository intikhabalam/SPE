This article provides a comprehensive manual for deploying Microsoft Embedded systems. It guides you through the entire deployment process using a GitHub pipeline.


Before you begin there are some Pre-Requsites that are required.

1. Global Admin: SharePoint Online
2. Global Admin: Azure
3. Application: Github account
4. Application: VSCode
5. Application: Postman


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

From this menu we will now create the folowing variables

Variables:
1. AZURE_SERVICEPRICIPAL_CLIENT_ID : This is an App registration created to allow the pipeline to deploy into your subscription. See Step 1.2
2. AZURE_TENANT_ID: This is the azure tenant ID. 
3. SHAREPOINT_ADMIN_SITE_URL : This is the SharePoint administration site. This is in the format https://{TenantName}-admin.sharepoint.com eg https://contoso-admin.sharepoint.com 
4. AZURE_SUBSCRIPTION_ID: This is the ID of the subscription that you want to deploy into in Azure


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

These steps will look like this. All 3 are covered under the "Create Service Principal and Get Credentials" step and the code will stop until you have submitted the auth codes. 
<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/f41f7cef-93ab-4683-bbf3-fb534921e2a0)</kbd>

**The codes do have a time out so the pipline might fail if the code is not entered in a timely manner**


# Step 2.1 Create Single Page Application
Another setting that needs to be manually set is the Single Page Application as the there is not parameter to set this 

<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/3ac96fd3-2410-493e-8501-33a0cec57ca5)</kbd>

the redirect URIs for the single page application is the url of the application built in the pipeline

<kbd>![image](https://github.com/intikhabalam/SPE/assets/171198457/b29e58b3-e1f0-4a08-91f4-64c909ca4107)</kbd>

# Step 3 Register Container Type
The App should now be online and avilable for use. The final configuration step is to register the container type which you will need to be done manually by using VS Code and Postman for this. 

# Step 3.1 VSCode SharePoint Embedded Extension - Export Environment Settings File
The first step to to create the environment configuration file through VScode.

To install VSCode if you have not already the installer can be downloaded online https://code.visualstudio.com/download.

Select the relevant Operating system that you are using

After VSCode is installed, install the SharePoint Embedded Extension in VS Code https://learn.microsoft.com/en-us/sharepoint/dev/embedded/getting-started/spembedded-for-vscode

Sign into the Microsoft 365 tenant with the Account that you have been using to consent the deployment tasks. 
![Screenshot 2024-06-28 144736](https://github.com/hamishhill/SPE-Hamish/assets/1449800/8b1bae81-6621-43ed-870b-0fc1598e63ff)

Expand the ‘Development’ section 

Select ‘Container types’ 

Select ‘SPE-Demo-ContainerType' 

![Screenshot 2024-06-28 152143](https://github.com/hamishhill/SPE-Hamish/assets/1449800/46367cbb-c38c-40b8-b677-e8a5d8b51b3f)

Right click SPE-Demo-SPE_App_Reg 

Select ‘Setup Postman collection’ 

Select ‘Export environment settings file’ 
![Screenshot 2024-06-28 152323](https://github.com/hamishhill/SPE-Hamish/assets/1449800/5e1ddada-517f-4c04-ad9e-d39f44e42f4e)
The following prompts will be presented in the bottom right corner 

"No Client secret was found. Would you like to create one for this app?"

   Select "No" 

"No certificate was found. Would you like to create one for this app?" 

   Select: "Yes" 

This will put your app's secret and other settings in a plain text Postman environment file on your local machine. Are you sure you want to continue? 

   Click OK 


Choose a location to save the environment details. 


# Step 3.2 PostMan - Registering the Container Type
Import the SharePoint Embedded collection can be found at https://github.com/microsoft/SharePoint-Embedded-Samples/blob/main/Postman/SharePoint%20Embedded.postman_collection.json

Select ‘Environments’ in the left navigation

Select 'Import'
   ![Screenshot 2024-06-28 155045](https://github.com/hamishhill/SPE-Hamish/assets/1449800/bdd54953-c474-4ef0-904f-16fe44683fb8)

Select 'files'

Navigate to the file location you selected in VS Code

Select the file

Click 'Open'
 ![Screenshot 2024-06-28 155248](https://github.com/hamishhill/SPE-Hamish/assets/1449800/70aab4bf-6147-496f-b58b-e3d73862c1b8)

You will now see the ‘SPE-Demo-ContainerType' environment listed. 

A grey tick indicates that this environment is active

![Screenshot 2024-06-28 155453](https://github.com/hamishhill/SPE-Hamish/assets/1449800/d70485b2-8888-4ed9-b3c4-8295659ce95c)

Select ‘Collections’ from the left navigation

Expand SharePoint Embedded 

Expand Application 

Expand Containers 

Select ' PUT Register ContainerType
![Postman-SPE-conttype-reg](https://github.com/hamishhill/SPE-Hamish/assets/1449800/30e4a5f1-dcb2-4937-bda8-3fec12291eee)

Conftirm the right environment is selected in the top right

Click 'Send'

You will see ‘200 OK’ if successful. 

Now your container registration is complete, return to the demo application. 
![Screenshot 2024-06-28 160352](https://github.com/hamishhill/SPE-Hamish/assets/1449800/fe586396-5872-46ef-a9ad-2344e3fe902b)




