# Azure serverless functions

This folder contains the source code for the Azure serverless functions. The functions are written in javascript and are deployed using the Azure Functions extension for Visual Studio Code.

## Running on local

To run the functions on your local machine, you need to have the Azure Functions extension installed in Visual Studio Code. Then create a local.settings.json file in the current folder and fill in the details for the chatbase API ID, key and also the {Enter password here} in the SQLConnectionString. This will allow the Azure local function to connect to the database. The schema for the database can be found in "schema.sql" file.

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "SQLConnectionString": "Server=tcp:cse210group6healthbot.database.windows.net,1433;Initial Catalog=healthbot;Persist Security Info=False;User ID=azureuser;Password={Enter password here};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;",
    "CHATBASE_API_ID_1": "<Enter chatbase API ID>",
    "CHATBASE_API_KEY_1": "<Enter chatbase API key>"
  }
}
```

Once you have this setup ready, change all occurences of `EXPO_PUBLIC_AZURE_URL` in the Expo client app to `EXPO_PUBLIC_AZURE_LOCAL_URL`. Then, simply do an `npm install` in the current folder to install the dependencies. Now you can run the Azure function by just going to one of the ".js" files in this folder and clicking on F5. It should run a local instance of the function and you should be able to see the APIs that can be called in the terminal window of VS Code.

For logging purposes, use `context.log` instead of `console.log`
