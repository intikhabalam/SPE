import "./App.css";
import React, { useState, useCallback } from "react";
import { Login, SearchBox, SearchResults } from "@microsoft/mgt-react";
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
} from "@fluentui/react-icons";
import "./App.css";
import * as Constants from "../common/Constants";
import { Outlet } from "react-router-dom";
import { INavLinkGroup, INavStyles, Nav, registerIcons } from "@fluentui/react";

const navStyles: Partial<INavStyles> = {
  root: {
    color: "white",
    backgroundColor: "#4854ee",
    marginLeft: "-20px",
    paddingTop: "40px",
  },
  navItem: { paddingTop: "10px" },
  link: {
    color: "white",
    paddingLeft: "35px",
    backgroundColor: "#4854ee",
    selectors: {
      "&:hover": {
        fontWeight: "bold",
        backgroundColor: "#4854ee",
      },
      "&:active": {
        backgroundColor: "#4854ee",
      },
      "&.is-selected": {
        backgroundColor: "#4854ee",
      },
    },
  },
  linkText: {
    color: "white",
  },
  compositeLink: {
    selectors: {
      ":hover .ms-Nav-linkText": {
        color: "#6DCCF4",
        fontWeight: "bold",
      },
    },
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

  registerIcons({
    icons: {
      Map20Regular: <Map20Regular />,
      People20Regular: <People20Regular />,
      Open20Regular: <Open20Regular />,
      Star20Regular: <Star20Regular />,
      ChartMultiple20Regular: <ChartMultiple20Regular />,
      MoreVertical24Filled: <MoreVertical24Filled />,
    },
  });

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
        <div className="spe-app-content">
          <div className="spe-app-content-navigation">
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

            <FluentProvider theme={webLightTheme}>
              <Nav
                selectedKey="key4"
                ariaLabel="Nav basic example"
                groups={navLinkGroups}
                styles={navStyles}
              />
            </FluentProvider>
          </div>

          <div className="spe-app-header-main-container">
            <div className="spe-app-header">
              <div className="spe-app-header-search">
                <SearchBox
                  searchTermChanged={onSearchTermChanged}
                  onFocus={() => setShowSearchResults(true)}
                  onBlur={() =>
                    setTimeout(setShowSearchResults.bind(null, false), 200)
                  }
                />
                {showSearchResults && (
                  <div className="spe-app-search-results-background">
                    <SearchResults
                      className="spe-app-search-results"
                      entityTypes={["driveItem"]}
                      fetchThumbnail={true}
                      queryString={searchQuery}
                    />
                  </div>
                )}
              </div>
              <div className="spe-app-header-actions">
                <Toolbar>
                  <Login
                    ref={loginRef}
                    loginView="avatar"
                    showPresence={true}
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
    </FluentProvider>
  );
}

export default App;
