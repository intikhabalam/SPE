import { Button } from "@fluentui/react-components";
import { Login, ProviderState, Providers } from "@microsoft/mgt-react";
import { useEffect, useState } from "react";
import * as Constants from "../common/Constants";
import { Link } from "react-router-dom";
import { CreateContainerButton } from "../components/CreateContainerButton";
import { ContainerSelector } from "../components/ContainerSelector";
import { ContainersApiProvider } from "../providers/ContainersApiProvider";
import { IContainer } from "../../../common/schemas/ContainerSchemas";

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
        const containerList = await containersApi.list();
        setContainers(containerList);
      } catch (error) {
        console.error(error);
      }
    };

    fetchContainers();
  }, [refreshKey, isSignedIn]);

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
            <span>
              Follow the readme steps to register your container type with VS
              Code & Postman
            </span>
          </li>
        )}

        {isSignedIn && (
          <li>
            <div style={{ display: "flex", alignItems: "center" }}>
              <CreateContainerButton
                onContainerCreated={handleContainerCreated}
              />
              {containers && containers.length === 0 && (
                <span style={{ margin: "0 5px" }}>your first job posting</span>
              )}

              {containers && containers.length > 0 && (
                <>
                  <span style={{ margin: "0 5px" }}>another job posting</span>
                  {/* <ContainerSelector refreshKey={refreshKey} /> */}
                </>
              )}
            </div>
          </li>
        )}
        {isSignedIn && containers && containers.length > 0 && (
          <li>
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
                to="/hiring"
                style={{ color: "white", textDecoration: "none" }}
              >
                Get Started
              </Link>
            </Button>
            <span> with your SharePoint Embedded Demo</span>
          </li>
        )}
      </ol>
    </div>
  );
};
