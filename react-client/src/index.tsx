import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ProviderState, Providers } from "@microsoft/mgt-element";
import { Msal2Provider } from "@microsoft/mgt-msal2-provider";
import * as Constants from './common/Constants';
import * as Scopes from './common/Scopes';
import { initializeFileTypeIcons } from '@fluentui/react-file-type-icons';
import { GraphAuthProvider } from './providers/GraphAuthProvider';

// Register icons and pull the fonts from the default Microsoft Fluent CDN:
initializeFileTypeIcons();

const provider = new Msal2Provider({
  clientId: Constants.AZURE_CLIENT_ID!,
  authority: Constants.AUTH_AUTHORITY,
  scopes: Scopes.GRAPH_SCOPES
});
//provider.login();
Providers.globalProvider = provider;

//GraphAuthProvider.instance.getToken().then(console.log);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
window.addEventListener('message', console.log)
