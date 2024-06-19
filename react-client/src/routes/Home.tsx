import { Button, Link as FluentLink } from "@fluentui/react-components";
import { Login, ProviderState, Providers } from "@microsoft/mgt-react";
import { useEffect, useState } from "react";
import * as Constants from "../common/Constants";
//import { ContainersApiProvider } from "../providers/ContainersApiProvider";
import { Link } from "react-router-dom";
import { CreateContainerButton } from "../components/CreateContainerButton";

const useIsSignedIn = () => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  useEffect(() => {
    const updateIsSignedIn = () => {
      setIsSignedIn(Providers.globalProvider.state === ProviderState.SignedIn);
    };
    updateIsSignedIn();
    Providers.globalProvider.onStateChanged(updateIsSignedIn);
    return () => {
      Providers.globalProvider.removeStateChangedHandler(updateIsSignedIn);
    };
  }, []);
  return isSignedIn;
};

export const Home: React.FunctionComponent = () => {
  const isSignedIn = useIsSignedIn();
  const [registering, setRegistering] = useState<boolean>(false);
  const [registerResult, setRegisterResult] = useState<any>();

  let tenantId = "";
  let adminConsentLink = "";
  if (isSignedIn) {
    tenantId = Providers.globalProvider.getActiveAccount!()?.tenantId || "";
    adminConsentLink = `https://login.microsoftonline.com/${tenantId}/adminconsent?client_id=${Constants.REACT_APP_AZURE_SERVER_APP_ID}&redirect_uri=${window.location.origin}`;
  }

  // const onRegisterContainerType = async () => {
  //   setRegistering(true);
  //   const containersApi = ContainersApiProvider.instance;
  //   const result = await containersApi.registerContainerType();
  //   setRegistering(false);
  //   setRegisterResult(JSON.stringify(result));
  // };

  return (
    <div>
      <h1>Getting started with the SharePoint Embedded demo app</h1>
      <p>Follow the steps below to get your tenant setup</p>
      <ol className="setup-steps">
        {!isSignedIn && (
          <li>
            <Login /> using a gloabl admin account
          </li>
        )}
        {isSignedIn && (
          <li>
            <FluentLink href={adminConsentLink}>
              Grant admin consent to this demo app
            </FluentLink>
          </li>
        )}
        {isSignedIn && (
          <li>
            <CreateContainerButton />
            <span>
              {" "}
              this app's Container on your tenant. You may need to ensure to
              enable SPE in the SharePoint Admin center. Sometimes this
              registration will fail on the first try. If that happens, sign out
              of this app, sign in again, redo admin consent, and retry this
              registration.{" "}
            </span>
            {registering && <p>Registering...</p>}
            {!registering && (
              <p>
                <code>{registerResult}</code>
              </p>
            )}
          </li>
        )}
        {isSignedIn && (
          <li>
            Visit the <Link to="/jobs">Jobs</Link> page to use the demo app
          </li>
        )}
      </ol>
    </div>
  );
};
