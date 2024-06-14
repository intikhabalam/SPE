import "./App.css";
import React from "react";
import { Login } from "@microsoft/mgt-react";
import { FluentProvider, Text } from "@fluentui/react-components";

export const LoginPage: React.FunctionComponent = () => {
  const loginRef = React.useRef(null);
  return (
    <FluentProvider>
      <div className="Login">
        <div className="spe-app-header-title">
          <Text size={600} style={{ fontSize: "22px", color: "#fff" }}>
            contoso
          </Text>
          <Text
            size={700}
            weight="semibold"
            style={{ fontSize: "22px", color: "#60B1D4" }}
          >
            HR
          </Text>
        </div>
        <div className="spe-app-header-subtitle">
          <Text size={400} style={{ fontSize: "14px", color: "#fff" }}>
            SharePoint Embedded demo app
          </Text>
        </div>
        <div className="spe-app-header-subtitle">
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
