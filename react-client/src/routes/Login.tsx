import "./App.css";
import React from "react";
import { Login } from "@microsoft/mgt-react";
import { FluentProvider, Text } from "@fluentui/react-components";

export const LoginPage: React.FunctionComponent = () => {
  const loginRef = React.useRef(null);
  
  return (
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
