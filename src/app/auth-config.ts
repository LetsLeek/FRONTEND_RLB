import { PublicClientApplication, BrowserCacheLocation, LogLevel } from '@azure/msal-browser';

// MSAL Konfigurationsobjekt
export const msalConfig = {
  auth: {
    clientId: 'YOUR_CLIENT_ID',
    authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID',
    redirectUri: 'http://localhost:8080'
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (logLevel: LogLevel, message: string, containsPii: boolean) => {
        console.log(`[${LogLevel[logLevel]}]: ${message}`); // Beispiel-Logausgabe
      },
      logLevel: LogLevel.Info, // Hier kannst du den gewünschten Log-Level angeben
      piiLoggingEnabled: false
    }
  }
};
