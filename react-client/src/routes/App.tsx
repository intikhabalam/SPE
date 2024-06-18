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
import {
  Map20Regular,
  People20Regular,
  Open20Regular,
  Star20Regular,
  ChartMultiple20Regular,
  MoreVertical24Filled,
  Library20Regular,
  ChevronLeft20Regular,
  ChevronRight20Regular,
  Search12Regular,
  DismissCircle20Regular,
} from "@fluentui/react-icons";
import {
  ILabelStyles,
  INavLinkGroup,
  INavStyles,
  IStyleSet,
  Nav,
  registerIcons,
  Label,
} from "@fluentui/react";

import * as Constants from "../common/Constants";
import { Outlet } from "react-router-dom";

const navStyles: Partial<INavStyles> = {
  root: {
    color: "white",
    backgroundColor: "#393EB3",
    marginLeft: "-20px",
    paddingTop: "40px",
  },
  navItem: { paddingTop: "10px" },
  link: {
    color: "white",
    paddingLeft: "35px",
    backgroundColor: "#393EB3",
    selectors: {
      "&:hover": {
        fontWeight: "bold",
        backgroundColor: "#393EB3 ",
      },
      "&:active": {
        backgroundColor: "#393EB3 ",
      },
      "&.is-selected": {
        backgroundColor: "#393EB3 ",
      },
    },
  },
  linkText: {
    color: "white",
  },
  compositeLink: {
    selectors: {
      ":hover .ms-Nav-linkText": {
        fontWeight: "bold",
      },
      ":hover .ms-Button--action": { backgroundColor: "#393EB3 !important" },
    },
  },
};

const labelStyles: Partial<IStyleSet<ILabelStyles>> = {
  root: { marginTop: 10, fontSize: 14, fontWeight: "600" },
};

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
  const [searchQuery, setSearchQuery] = useState<string>(baseSearchQuery);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const loginRef = React.useRef(null);
  const onSearchTermChanged = useCallback(
    (e: CustomEvent<string>) => {
      const term = e.detail;
      const termQuery = term ? `'${term}'` : "";
      setSearchQuery(`${termQuery} ${baseSearchQuery}`);
      console.log(`${termQuery} ${baseSearchQuery}`);
    },
    [baseSearchQuery]
  );
  const [isPanelOpen, setPanelOpen] = useState(false);

  registerIcons({
    icons: {
      Map20Regular: <Map20Regular />,
      People20Regular: <People20Regular />,
      Open20Regular: <Open20Regular />,
      Star20Regular: <Star20Regular />,
      ChartMultiple20Regular: <ChartMultiple20Regular />,
      MoreVertical24Filled: <MoreVertical24Filled />,
      Search12Regular: <Search12Regular />,
      DismissCircle20Regular: <DismissCircle20Regular />,
    },
  });

  const searchIcon = {
    iconName: "Search12Regular",
    style: { color: "#616161" },
  };

  const navLinkGroups: INavLinkGroup[] = [
    {
      links: [
        {
          name: "Overview",
          url: "",
          iconProps: {
            iconName: "Map20Regular",
            style: { color: "#6DCCF4", width: "20px" },
          },
          key: "key1",
        },
        {
          name: "People",
          url: "",
          key: "key2",
          iconProps: {
            iconName: "People20Regular",
            style: { color: "#6DCCF4", width: "20px" },
          },
        },
        {
          name: "Openings",
          url: "",
          key: "key3",
          iconProps: {
            iconName: "Open20Regular",
            style: { color: "#6DCCF4", width: "20px" },
          },
        },
        {
          name: "Hiring",
          url: "",
          key: "key4",
          iconProps: {
            iconName: "Star20Regular",
            style: { color: "#6DCCF4", width: "20px" },
          },
        },
        {
          name: "Reports",
          url: "",
          key: "key5",
          iconProps: {
            iconName: "ChartMultiple20Regular",
            style: { color: "#6DCCF4", width: "20px" },
          },
        },
      ],
    },
  ];

  return (
    <FluentProvider>
      <div className="App">
        <div className="spe-app-main">
          <div className="spe-app-main-header">
            <div className="spe-app-main-header-title">
              SharePoint Embedded Demo app
            </div>
            <div className="spe-app-main-header-actions">
              <Text>About this Demo</Text>
              <Text>Learn & How to</Text>
              <Text>Show Code</Text>
            </div>
          </div>

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
                    <Nav
                      selectedKey="key4"
                      ariaLabel="Nav basic example"
                      groups={navLinkGroups}
                      styles={navStyles}
                    />
                  </FluentProvider>
                </div>
                <div className="spe-app-header-container">
                  <div className="spe-app-header">
                    <div className="spe-app-header-search">
                      <SearchBox
                        placeholder="Search"
                        onSearch={onSearchTermChanged}
                        onFocus={() => setShowSearchResults(true)}
                        onBlur={() =>
                          setTimeout(
                            setShowSearchResults.bind(null, false),
                            200
                          )
                        }
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
        </div>
      </div>
    </FluentProvider>
  );
}

export default App;
