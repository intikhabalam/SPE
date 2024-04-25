
import './App.css';
import React, {
  useState, useEffect,
  useCallback
} from "react";
import {
  Providers,
  ProviderState
} from "@microsoft/mgt-element";
import { Login, SearchBox, SearchResults } from "@microsoft/mgt-react";
import {
  Divider,
  FluentProvider,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Tab,
  TabList,
  Text,
  Toolbar,
  ToolbarButton,
  webDarkTheme,
  webLightTheme
} from "@fluentui/react-components";
import {
  Map20Regular,
  People20Regular,
  Open20Regular,
  Star20Regular,
  ChartMultiple20Regular,
  MoreVertical24Filled,
} from '@fluentui/react-icons';
import './App.css';
import * as Constants from '../common/Constants';
import { ContainerSelector } from '../components/ContainerSelector';
import ContainerBrowser from '../components/ContainerBrowser';
import { IContainer } from '../../../common/schemas/ContainerSchemas';
import { CreateContainerButton } from '../components/CreateContainerButton';
import { Outlet } from 'react-router-dom';


const useIsSignedIn = () => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  useEffect(() => {
    const updateIsSignedIn = () => {
      setIsSignedIn(Providers.globalProvider.state === ProviderState.SignedIn);
    }
    updateIsSignedIn();
    Providers.globalProvider.onStateChanged(updateIsSignedIn);
    return () => {
      Providers.globalProvider.removeStateChangedHandler(updateIsSignedIn);
    }
  }, []);
  return isSignedIn;
}

function App() {  
  const containerTypeId = Constants.SPE_CONTAINER_TYPE_ID;
  const baseSearchQuery = `ContainerTypeId:${containerTypeId} AND Title:'posting'`;
  const [selectedContainer, setSelectedContainer] = useState<IContainer | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>(baseSearchQuery)
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const isSignedIn = useIsSignedIn();
  const mainContentRef = React.useRef(null);
  const loginRef = React.useRef(null);
  const onSearchTermChanged = useCallback((e: CustomEvent < string > ) => {
    const term = e.detail;   
    const termQuery = term ? `'${term}'` : '';
    setSearchQuery(`${termQuery} ${baseSearchQuery}`);
    console.log(`${termQuery} ${baseSearchQuery}`);
  }, [baseSearchQuery]);

  return (
    <FluentProvider theme={webLightTheme}>
      <div className="App">
        <div className="spe-app-header">
          <div className="spe-app-header-title">
            <Text size={600}>
              Contoso
              <Text size={700} weight='semibold'>H</Text>
              <Text size={700} weight='semibold'>R</Text>
            </Text>
          </div>
          <div className="spe-app-header-search">
            <SearchBox 
              searchTermChanged={onSearchTermChanged}
              onFocus={() => setShowSearchResults(true)}
              onBlur={() => setTimeout(setShowSearchResults.bind(null, false), 200)}
            />
            {showSearchResults && (
            <SearchResults 
              className="spe-app-search-results"
              entityTypes={['driveItem']} 
              fetchThumbnail={true} 
              queryString={searchQuery} 
            />
            )}
          </div>
          <div className="spe-app-header-actions">
            <Toolbar>
              <Login ref={loginRef} loginView='avatar' showPresence={true} />
              <Menu>
                <MenuTrigger>
                  <ToolbarButton aria-label="More" icon={<MoreVertical24Filled />} />
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
        <div className="spe-app-content">
          <div className="spe-app-content-navigation"><FluentProvider theme={webDarkTheme}>
            <div className="navigation-tabs">
              <TabList vertical={true} size='large' selectedValue="hiring">
                <Tab value="overview" icon={<Map20Regular />}>Overview</Tab>
                <Tab value="people" icon={<People20Regular />}>People</Tab>
                <Tab value="openings" icon={<Open20Regular />}>Openings</Tab>
                <Tab value="hiring" icon={<Star20Regular />}>Hiring</Tab>
                <Tab value="reports" icon={<ChartMultiple20Regular />}>Reports</Tab>
              </TabList>
            </div></FluentProvider>
            <div className="navigation-divider">
              <Divider />
            </div>
            <div className="navigation-containers">
              {isSignedIn && (<>
                <ContainerSelector onContainerSelected={setSelectedContainer} />
                <CreateContainerButton />
              </>)}
            </div>
          </div>
          <div className="spe-app-content-main" ref={mainContentRef}>
            <div className="main-content-header" />
            {/*
            <FluentProvider theme={webDarkTheme}>
            <div className="main-content-header">
              <TabList size='large' selectedValue="documents">
                <Tab value="dashboard">Dashboard</Tab>
                <Tab value="requests">Requests</Tab>
                <Tab value="documents">Documents</Tab>
                <Tab value="settings">Settings</Tab>
              </TabList>
            </div>
            </FluentProvider>
            */}
            <div className="main-content-body">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </FluentProvider>
  );
}

export default App;
