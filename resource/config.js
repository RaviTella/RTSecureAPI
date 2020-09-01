import * as msal from '@azure/msal-browser'
export const msalConfig = {
  auth: {
      clientId: "ffa48457-3056-4308-8326-11338ed4db7e",
      authority: "https://login.microsoftonline.com/common",
      redirectUri: "http://localhost:8080/",
  },
  cache: {
      cacheLocation: "sessionStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
      loggerOptions: {
          loggerCallback: (level, message, containsPii) => {
              if (containsPii) {	
                  return;	
              }	
              switch (level) {	
                  case msal.LogLevel.Error:	
                      console.error(message);	
                      return;	
                  case msal.LogLevel.Info:	
                      console.info(message);	
                      return;	
                  case msal.LogLevel.Verbose:	
                      console.debug(message);	
                      return;	
                  case msal.LogLevel.Warning:	
                      console.warn(message);	
                      return;	
              }
          }
      }
  }
};

// Add here the scopes that you would like the user to consent during sign-in
export const loginRequest = {
  scopes: ["https://graph.microsoft.com/User.Read"]
};

// Add here the scopes to request when obtaining an access token for myAPI
export const tokenRequest = {
  scopes: ["api://cc4b2422-62d5-4be4-b055-02a5dc2add74/Weather.Read.All"],
  forceRefresh: false // Set this to "true" to skip a cached token and go to the server to get a new token
};

export const APIendPointConfig = {  
  myAPI: "https://localhost:44312/weatherforecast/get2"
};
