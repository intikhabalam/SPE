import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./routes/App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginType, Providers, ProviderState } from "@microsoft/mgt-element";
import { Msal2Provider, PromptType } from "@microsoft/mgt-msal2-provider";
import * as Constants from "./common/Constants";
import * as Scopes from "./common/Scopes";
import { initializeFileTypeIcons } from "@fluentui/react-file-type-icons";
import ErrorPage from "./ErrorPage";
import { CustomAppApiAuthProvider } from "./providers/CustomAppApiAuthProvider";
import {
  Jobs,
  loader as jobsLoader,
  action as createJobAction,
} from "./routes/Jobs";
import {
  ViewJob,
  loader as jobLoader,
  action as updateJobAction,
} from "./routes/ViewJob";
import { Home } from "./routes/Home";
import { GraphNetListenerProvider } from "./context/GraphNetListener";
import {
  MoreVertical24Filled,
  Search12Regular,
  Map20Regular,
  People20Regular,
  Open20Regular,
  Star20Regular,
  ChartMultiple20Regular,
  DismissCircle20Regular,
  Settings20Regular,
  Filter20Regular,
  Info20Regular,
  ArrowUpload20Filled,
  Folder24Filled,
  Add20Regular,
  Edit20Filled,
  ArrowSync20Regular,
  ChevronRight20Regular,
} from "@fluentui/react-icons";
import { registerIcons } from "@fluentui/react";

initializeFileTypeIcons();

registerIcons({
  icons: {
    MoreVertical24Filled: <MoreVertical24Filled />,
    Search12Regular: <Search12Regular />,
    Map20Regular: <Map20Regular />,
    People20Regular: <People20Regular />,
    Open20Regular: <Open20Regular />,
    Star20Regular: <Star20Regular />,
    ChartMultiple20Regular: <ChartMultiple20Regular />,
    Info20Regular: <Info20Regular />,
    Filter20Regular: <Filter20Regular />,
    DismissCircle20Regular: <DismissCircle20Regular />,
    Settings20Regular: <Settings20Regular />,
    Add20Regular: <Add20Regular />,
    Folder24Filled: <Folder24Filled />,
    ArrowUpload20Filled: <ArrowUpload20Filled />,
    ChevronRight20Regular: <ChevronRight20Regular />,
    Edit20Filled: <Edit20Filled />,
    ArrowSync20Regular: <ArrowSync20Regular />,
  },
});

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
        element: <Home />,
      },
      {
        path: "/hiring",
        element: <Jobs />,
        loader: jobsLoader,
        action: createJobAction,
      },
      {
        path: "/hiring/:jobId",
        element: <ViewJob />,
        loader: jobLoader,
        action: updateJobAction,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <GraphNetListenerProvider>
      <RouterProvider router={router} />
    </GraphNetListenerProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
