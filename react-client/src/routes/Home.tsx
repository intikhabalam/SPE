import React, { useEffect, useState } from "react";
import { Button } from "@fluentui/react-components";
import { Login, ProviderState, Providers } from "@microsoft/mgt-react";
import * as Constants from "../common/Constants";
import { CreateContainerButton } from "../components/CreateContainerButton";
import { ContainersApiProvider } from "../providers/ContainersApiProvider";
import { IContainer } from "../../../common/schemas/ContainerSchemas";
import { Link } from "react-router-dom";
import GetStartedButton from "../components/GetStartedButton"; // Import the GetStartedButton component

const containersApi = ContainersApiProvider.instance;

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
  const [refreshKey, setRefreshKey] = useState(0);
  const [containers, setContainers] = useState<IContainer[] | undefined>();
  const [registerResult, setRegisterResult] = useState<any>();

  const handleContainerCreated = () => {
    setRefreshKey((prevKey) => prevKey + 1); // Increment the refresh key
  };

  let tenantId = "";
  let adminConsentLink = "";
  if (isSignedIn) {
    tenantId = Providers.globalProvider.getActiveAccount!()?.tenantId || "";
    adminConsentLink = `https://login.microsoftonline.com/${tenantId}/adminconsent?client_id=${Constants.REACT_APP_AZURE_SERVER_APP_ID}&redirect_uri=${window.location.origin}`;
  }

  useEffect(() => {
    const fetchContainers = async () => {
      try {
        if (isSignedIn) {
          const containerList = await containersApi.list();
          setContainers(containerList);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchContainers();
  }, [refreshKey, isSignedIn]);

  const onRegisterContainerType = async () => {
    setRegistering(true);
    const containersApi = ContainersApiProvider.instance;
    const result = await containersApi.registerContainerType();
    setRegistering(false);
    setRegisterResult(JSON.stringify(result));
  };

  const isDisabled = !containers || containers.length === 0;

  return (
    <div>
      <h1>Getting started with the SharePoint Embedded demo app</h1>
      <p>Follow the steps below to get your tenant setup</p>
      <ol className="setup-steps">
        {!isSignedIn && (
          <li>
            <Login /> using a global admin account
          </li>
        )}
        {isSignedIn && (
          <li>
            <span>Grant </span>
            <Button
              appearance="primary"
              disabled={registering}
              style={{
                backgroundColor: "#393EB3",
                color: "white",
                padding: "5px 10px",
                borderRadius: "5px",
              }}
            >
              <Link
                to={adminConsentLink}
                style={{ color: "white", textDecoration: "none" }}
              >
                Admin Consent
              </Link>
            </Button>
            <span> to this demo app</span>
          </li>
        )}
        {isSignedIn && (
          <li>
            <Button
              appearance="primary"
              disabled={registering}
              onClick={() => onRegisterContainerType()}
              style={{
                backgroundColor: "#393EB3",
                color: "white",
                padding: "5px",
                borderRadius: "5px",
              }}
            >
              Register
            </Button>
            <span> the Container Type with your SharePoint instance</span>
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
            <div style={{ display: "flex", alignItems: "center" }}>
              <CreateContainerButton
                onContainerCreated={handleContainerCreated}
              />
              <span style={{ margin: "0 5px" }}>your first job posting</span>
            </div>
          </li>
        )}
        {isSignedIn && (
          <li>
            <GetStartedButton isDisabled={isDisabled} />
            <span> with your SharePoint Embedded Demo</span>
          </li>
        )}
      </ol>
    </div>
  );
};
