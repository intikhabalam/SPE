import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './routes/App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  redirect,
  RouterProvider
} from "react-router-dom";
import { CacheService, LoginType, Providers, ProviderState } from "@microsoft/mgt-element";
import { Msal2Provider, PromptType } from "@microsoft/mgt-msal2-provider";
import * as Constants from './common/Constants';
import * as Scopes from './common/Scopes';
import { initializeFileTypeIcons } from '@fluentui/react-file-type-icons';
import ErrorPage from './ErrorPage';
import { ContainerBrowser, loader as containerLoader } from './components/ContainerBrowser';
import { ContainersApiProvider } from './providers/ContainersApiProvider';
import { CustomAppApiAuthProvider } from './providers/CustomAppApiAuthProvider';
import { JobsApiProvider } from './providers/JobsApiProvider';
import { Jobs, loader as jobsLoader, action as createJobAction } from './routes/Jobs';
import { ViewJob, loader as jobLoader, action as updateJobAction } from './routes/ViewJob';
import { ViewJobPosting, loader as jobPostingLoader } from './routes/ViewJobPosting';
import { Home } from './routes/Home';

// Register icons and pull the fonts from the default Microsoft Fluent CDN:
initializeFileTypeIcons();

const provider = new Msal2Provider({
  clientId: Constants.REACT_APP_AZURE_SERVER_APP_ID,
  authority: Constants.AUTH_AUTHORITY,
  scopes: Scopes.GRAPH_SCOPES,
  redirectUri: window.location.origin,
  loginType: LoginType.Redirect,
  prompt: PromptType.SELECT_ACCOUNT,
});
Providers.globalProvider = provider;

provider.onStateChanged(() => {
  if (provider.state === ProviderState.SignedOut) {
    CustomAppApiAuthProvider.instance.client.clearCache();
  }
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/jobs",
        element: <Jobs />,
        loader: jobsLoader,
        action: createJobAction,
      },
      {
        path: "/jobs/:jobId",
        element: <ViewJob />,
        loader: jobLoader,
        action: updateJobAction,
      },
    ]
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
