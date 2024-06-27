import "./App.css";
import React, { useState, useCallback } from "react";
import { Login } from "@microsoft/mgt-react";
import { ISearchBoxStyles, SearchBox } from "@fluentui/react/lib/SearchBox";
import {
  IContextualMenuProps,
  IContextualMenuStyles,
} from "@fluentui/react/lib/ContextualMenu";
import { IToggleStyles, Toggle } from "@fluentui/react/lib/Toggle";
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
  Search12Regular,
  DismissCircle20Regular,
  Settings20Regular,
} from "@fluentui/react-icons";
import {
  ILabelStyles,
  INavLinkGroup,
  INavStyles,
  IStyleSet,
  Nav,
  registerIcons,
  Link,
  DefaultButton,
} from "@fluentui/react";
import { useConst } from "@fluentui/react-hooks";
import * as Constants from "../common/Constants";
import { Outlet } from "react-router-dom";
import CodeDisplay from "../components/CodeDisplay";

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
      "&:hover:not(.is-disabled)": {
        fontWeight: "bold",
        backgroundColor: "#393EB3",
        color: "white", // Ensuring hover color for non-disabled links
      },
      "&:active": {
        backgroundColor: "#393EB3",
      },
      "&.is-selected": {
        backgroundColor: "#393EB3",
      },
      "&.is-disabled": {
        color: "#A6A6A6",
        cursor: "default",
        backgroundColor: "#393EB3",
        fontWeight: "normal",
        pointerEvents: "none",
      },
    },
  },
  compositeLink: {
    selectors: {
      ":hover .ms-Button--action": {
        backgroundColor: "#393EB3 !important",
      },
    },
  },
};

// const labelStyles: Partial<IStyleSet<ILabelStyles>> = {
//   root: { marginTop: 10, fontSize: 14, fontWeight: "600" },
// };

const linkStyles: Partial<IStyleSet<ILabelStyles>> = {
  root: {
    color: "white",
    fontSize: "14px",
    fontWeight: "600",
    padding: "8px 12px",
  },
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

const contextMenuStyles: Partial<IContextualMenuStyles> = {
  root: { border: "none", color: "white", backgroundColor: "#242424" },
  title: {
    color: "white",
    backgroundColor: "#242424",
    border: "none",
    fontSize: "14px",
    fontWeight: "600",
    padding: "2px 12px",
    ":hover": { backgroundColor: "white" },
    ":selected": { backgroundColor: "white" },
  },
};

const toggleStyles: Partial<IToggleStyles> = {
  root: { padding: "2px 12px" },
  label: { color: "white" },
};

function App() {
  const containerTypeId = Constants.SPE_CONTAINER_TYPE_ID;
  const baseSearchQuery = `ContainerTypeId:${containerTypeId} AND Title:'[Job Posting]*'`;
  //const [searchQuery, setSearchQuery] = useState<string>(baseSearchQuery);
  // const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const loginRef = React.useRef(null);
  const onSearchTermChanged = useCallback(
    (e: CustomEvent<string>) => {
      const term = e.detail;
      const termQuery = term ? `'${term}'` : "";
      // setSearchQuery(`${termQuery} ${baseSearchQuery}`);
      console.log(`${termQuery} ${baseSearchQuery}`);
    },
    [baseSearchQuery]
  );
  const [showSidePanel, setShowSidePanel] = useState(false);
  const toggleSidePanel = () => {
    setShowSidePanel(!showSidePanel);
  };

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
      Settings20Regular: <Settings20Regular />,
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
          disabled: true,
          iconProps: {
            iconName: "Map20Regular",
            style: { color: "#A6A6A6", width: "20px" },
          },
          key: "key1",
        },
        {
          name: "People",
          url: "",
          disabled: true,
          key: "key2",
          iconProps: {
            iconName: "People20Regular",
            style: { color: "#A6A6A6", width: "20px" },
          },
        },
        {
          name: "Openings",
          url: "",
          disabled: true,
          key: "key3",
          iconProps: {
            iconName: "Open20Regular",
            style: { color: "#A6A6A6", width: "20px" },
          },
        },
        {
          name: "Hiring",
          url: "/hiring",
          key: "key4",
          iconProps: {
            iconName: "Star20Regular",
            style: { color: "#6DCCF4", width: "20px" },
          },
        },
        {
          name: "Reports",
          url: "",
          disabled: true,
          key: "key5",
          iconProps: {
            iconName: "ChartMultiple20Regular",
            style: { color: "#A6A6A6", width: "20px" },
          },
        },
        {
          name: "Admin",
          url: "/",
          key: "key6",
          iconProps: {
            iconName: "Settings20Regular",
            style: { color: "#6DCCF4", width: "20px" },
          },
        },
      ],
    },
  ];

  const getSelectedKey = () => {
    for (const group of navLinkGroups) {
      for (const link of group.links) {
        if (link.url === window.location.pathname) {
          return link.key;
        }
      }
    }
  };

  const menuProps = useConst<IContextualMenuProps>(() => ({
    shouldFocusOnMount: true,
    items: [
      {
        key: "link1",
        text: "About this Demo",
        href: "https://aka.ms/start-spe",
      },
      {
        key: "link2",
        text: "Sample Code",
        href: "https://aka.ms/spe-sample",
      },
      {
        key: "link3",
        text: "SharePoint Embedded YouTube",
        href: "https://aka.ms/spe-playlist",
      },
      {
        key: "link4",
        text: "Custom Copilot Demo",
        href: "https://aka.ms/spe-copilot",
      },
    ],
  }));

  return (
    <FluentProvider>
      <div className={`App ${showSidePanel ? "show-side-panel" : ""}`}>
        <div className="spe-app-main">
          <div className="spe-app-main-header">
            <div className="spe-app-main-header-title">
              SharePoint Embedded Demo app
            </div>
            <div className="spe-app-main-header-actions">
              <DefaultButton
                text="About this Demo"
                href={"https://aka.ms/spe-playlist"}
                styles={contextMenuStyles}
              />
              <DefaultButton
                text="Learn More"
                menuProps={menuProps}
                styles={contextMenuStyles}
              />
              <Toggle
                className="action-show-code"
                label="Show Code"
                inlineLabel
                checked={showSidePanel}
                onChange={toggleSidePanel}
                styles={toggleStyles}
              />
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
                      selectedKey={getSelectedKey()}
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
                        //  onFocus={() => setShowSearchResults(true)}
                        // onBlur={() =>
                        //   setTimeout(
                        //     setShowSearchResults.bind(null, false),
                        //     200
                        //   )
                        // }
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

          {/* Custom Side Panel */}
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
