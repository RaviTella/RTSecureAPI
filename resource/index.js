import * as Msal from '@azure/msal-browser'
import * as config from '../config/index'



export default class AuthService {
  
  constructor() {    
    this.msalObj = new Msal.PublicClientApplication(config.msalConfig);
    this.username = "";
  }

signIn() {  
    this.msalObj.loginPopup(config.loginRequest).then(response => {      
     
      console.log("JWT ID token " + response.idToken)
      console.log("JWT Access token " + response.accessToken)
      const currentAccounts = this.msalObj.getAllAccounts();
      if (currentAccounts === null) {
          return;
      } else if (currentAccounts.length > 1) {
          // Add choose account code here
          console.warn("Multiple accounts detected.");
      } else if (currentAccounts.length === 1) {   
          this.username = currentAccounts[0].username;      
          
      }
      return
    }).catch(error => {
        console.error(error);
    });
}

 signOut() {
    const logoutRequest = {
        account: this.msalObj.getAccountByUsername(this.username)
    };

    this.msalObj.logout(logoutRequest);
}

  async getTokenPopup(request) {
  request.account = this.msalObj.getAccountByUsername(this.username);
  try {
      return this.msalObj.acquireTokenSilent(request);
    }
    catch (error) {
      console.warn("silent token acquisition fails. acquiring token using redirect");

      if (error instanceof Msal.InteractionRequiredAuthError) {
        // fallback to interaction when silent call fails
        return myMSALObj.acquireTokenPopup(request).then(tokenResponse => {
          console.log(tokenResponse);

          return tokenResponse;
        }).catch(error_1 => {
          console.error(error_1);
        });
      }
      else {
        console.warn(error);
      }
    }
}

callMyAPI() {
  this.getTokenPopup(config.tokenRequest).then(response => {
    console.log("JWT access token for MyAPI " + response.accessToken)
      this.callAPI(config.APIendPointConfig.myAPI, response.accessToken);
  }).catch(error => {
      console.error(error);
  });
}

callAPI(endpoint, token, callback) {
  const headers = new Headers();
  const bearer = `Bearer ${token}`;

  headers.append("Authorization", bearer);

  const options = {
      method: "GET",
      headers: headers
  }

  fetch(endpoint, options)
      .then(response => response.json())
      .then(response => callback(response, endpoint))
      .catch(error => console.log(error));
}



  getUser() {    
     return this.username
  }
}

