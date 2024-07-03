import "./App.css";
import React, { useState, useCallback } from "react";
import { Login } from "@microsoft/mgt-react";
import { ISearchBoxStyles, SearchBox } from "@fluentui/react/lib/SearchBox";
import {
  FluentProvider,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Text,
  Toolbar,
  ToolbarButton,
  webLightTheme,
} from "@fluentui/react-components";
import { MoreVertical24Filled } from "@fluentui/react-icons";
import { IStyleSet } from "@fluentui/react";
import * as Constants from "../common/Constants";
import { Outlet } from "react-router-dom";
import CodeDisplay from "../components/CodeDisplay";
import { Navigation } from "../components/Navigation";
import MainHeader from "../components/MainHeader";

const searchBoxStyles: Partial<IStyleSet<ISearchBoxStyles>> = {
  root: {
    width: "344px",
    height: "38px",
    border: "none",
    backgroundColor: "#f4f7fa",
    borderRadius: "4px",
    marginLeft: "44px",
  },
};

function App() {
  const containerTypeId = Constants.SPE_CONTAINER_TYPE_ID;
  const baseSearchQuery = `ContainerTypeId:${containerTypeId} AND Title:'[Job Posting]*'`;
  const loginRef = React.useRef(null);
  const [showSidePanel, setShowSidePanel] = useState(false);

  const onSearchTermChanged = useCallback(
    (e: CustomEvent<string>) => {
      const term = e.detail;
      const termQuery = term ? `'${term}'` : "";
      console.log(`${termQuery} ${baseSearchQuery}`);
    },
    [baseSearchQuery]
  );

  const searchIcon = {
    iconName: "Search12Regular",
    style: { color: "#616161" },
  };

  return (
    <FluentProvider>
      <div className={`App ${showSidePanel ? "show-side-panel" : ""}`}>
        <div className="spe-app-main">
          <MainHeader
            showSidePanel={showSidePanel}
            setShowSidePanel={setShowSidePanel}
          />
          <div className="spe-app-main-description">
            Build a custom document management system using SharePoint Embedded,
            to organize, store, and manage documents.
          </div>

          <div className="spe-app-main-content">
            <div className="spe-app-content-container">
              <div className="spe-app-content">
                <div className="spe-app-content-navigation">
                  <div className="spe-app-header-title">
                    <Text
                      size={600}
                      style={{ fontSize: "22px", color: "#fff" }}
                    >
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
                  <FluentProvider theme={webLightTheme}>
                    <Navigation />
                  </FluentProvider>
                </div>
                <div className="spe-app-header-container">
                  <div className="spe-app-header">
                    <div className="spe-app-header-search">
                      <SearchBox
                        placeholder="Search"
                        onSearch={onSearchTermChanged}
                        iconProps={searchIcon}
                        styles={searchBoxStyles}
                      />
                    </div>
                    <div className="spe-app-header-actions">
                      <Toolbar>
                        <Login
                          ref={loginRef}
                          loginView="avatar"
                          showPresence={true}
                          className="login"
                        />
                        <Menu>
                          <MenuTrigger>
                            <ToolbarButton
                              aria-label="More"
                              icon={<MoreVertical24Filled />}
                            />
                          </MenuTrigger>

                          <MenuPopover>
                            <MenuList>
                              <MenuItem>Hi!</MenuItem>
                            </MenuList>
                          </MenuPopover>
                        </Menu>
                      </Toolbar>
                    </div>
                  </div>
                  <div className="spe-app-content-main">
                    <div className="main-content-body">
                      <Outlet />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showSidePanel && (
            <div className="custom-side-panel">
              <CodeDisplay />
            </div>
          )}
        </div>
      </div>
    </FluentProvider>
  );
}

export default App;
