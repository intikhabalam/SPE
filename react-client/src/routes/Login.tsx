import "./App.css";
import React, { useEffect, useState } from "react";
import { Login, ProviderState, Providers } from "@microsoft/mgt-react";
import { FluentProvider, Text } from "@fluentui/react-components";
import { Navigate } from "react-router-dom";

const useIsSignedIn = () => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>();

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

export const LoginPage: React.FunctionComponent = () => {
  const loginRef = React.useRef(null);
  const isSignedIn = useIsSignedIn();

  return isSignedIn ? (
    <Navigate to={"/"} />
  ) : (
    <FluentProvider>
      <div className="Login">
        <div className="spe-app-header-title-login">
          <Text size={600} style={{ fontSize: "38px", color: "#fff" }}>
            contoso
          </Text>
          <Text
            size={700}
            weight="semibold"
            style={{ fontSize: "38px", color: "#60B1D4" }}
          >
            HR
          </Text>
        </div>
        <div className="spe-app-header-subtitle">
          <Text>SharePoint Embedded demo app</Text>
        </div>
        <div className="spe-app-header-subtitle-button">
          <Login
            ref={loginRef}
            loginView="avatar"
            showPresence={true}
            className="login"
          />
        </div>
      </div>
    </FluentProvider>
  );
};
