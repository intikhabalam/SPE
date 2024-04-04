
import './App.css';
import React, {
  useState, useEffect
} from "react";
import {
  Providers,
  ProviderState
} from "@microsoft/mgt-element";
import { Login, SearchBox } from "@microsoft/mgt-react";
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
  makeStyles,
  shorthands,
  webDarkTheme,
  webLightTheme
} from "@fluentui/react-components";
import {
  Map20Regular,
  People20Regular,
  Open20Regular,
  Star20Regular,
  ChartMultiple20Regular,

  Chat32Regular,
  MoreVertical24Filled,
} from '@fluentui/react-icons';
import './App.css';
import ContainersView from './components/ContainersView';
import * as Msal from '@azure/msal-browser';
import { ChatAuthProvider } from './providers/ChatAuthProvider';
import { EmbeddedChat } from './components/copilot/EmbeddedChat';
import { GraphAuthProvider } from './providers/GraphAuthProvider';
import { ContainerSelector } from './components/ContainerSelector';
import ContainerBrowser from './components/ContainerBrowser';
import { IContainer } from '../../common/schemas/ContainerSchemas';
import { CreateContainerButton } from './components/CreateContainerButton';
import { GraphProvider } from './providers/GraphProvider';

const chatAuthProvider = new ChatAuthProvider();


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
  const [spUrl, setSpUrl] = useState<string | null>(null);
  const [chatUrl, setChatUrl] = useState<string | null>(null);
  const [showChat, setShowChat] = useState<boolean>(false);
  const [selectedContainer, setSelectedContainer] = useState<IContainer | undefined>(undefined);
  const isSignedIn = useIsSignedIn();
  const mainContentRef = React.useRef(null);
  const sidebarRef = React.useRef<HTMLDivElement | null>(null);
  const sidebarResizerRef = React.useRef(null);
  /*const [account, setAccount] = useState<Msal.AccountInfo | null>(GraphAuthProvider.instance.account);
  
  useEffect(() => {
    if (!account) {
      GraphAuthProvider.instance.signIn();
    }
    setAccount(GraphAuthProvider.instance.account);
  }, []);
*/
  useEffect(() => {
    if (isSignedIn) {
      GraphProvider.instance.getSpUrl().then((url) => {
        setSpUrl(url);
        setChatUrl(`${url}/_layouts/15/chat.aspx`);
      });
    }
  }, [isSignedIn]);

  //const embeddedChatUrl = 'https://m365x87130202.sharepoint.com/_layouts/15/chat.aspx';
  const onEmbeddedChatLoad = () => {
    console.log('Embedded chat loaded');
  }
  const getChatToken = async (): Promise<string | undefined> => {
    if (spUrl) {
      const scope = `${spUrl}/Container.Selected`;
      return chatAuthProvider.getToken([scope]);
    }
  }

  const toggleChat = () => {
    setShowChat(!showChat);
  }

  const onResizerMouseDown = (e: React.MouseEvent) => {
    console.log('mouse down');
    if (!sidebarRef.current) {
      return;
    }
    const minSidebarWidth = 200;
    const maxSidebarWidth = 600;
    let prevX = e.clientX;
    let sidebarBounds = sidebarRef.current!.getBoundingClientRect();
    const onMouseMove = (e: MouseEvent) => {
      console.log('mouse move');
      const newX = prevX - e.x;
      const newWidth = Math.max(minSidebarWidth, Math.min(maxSidebarWidth, sidebarBounds.width + newX));
      sidebarRef.current!.style.minWidth = `${newWidth}px`;
      console.log(`Setting width to ${newWidth}px`);
    }

    const onMouseUp = (e: MouseEvent) => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  const loginRef = React.useRef(null);
  if (loginRef.current) {
    //applyTheme('dark', loginRef.current);
  }
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
            <SearchBox />
          </div>
          <div className="spe-app-header-actions">
            <Toolbar>
              {chatUrl && (<ToolbarButton onClick={toggleChat} icon={<Chat32Regular />} />)}
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
          <div className="spe-app-content-main" ref={mainContentRef}><FluentProvider theme={webDarkTheme}>
            <div className="main-content-header">
              <TabList size='large' selectedValue="documents">
                <Tab value="dashboard">Dashboard</Tab>
                <Tab value="requests">Requests</Tab>
                <Tab value="documents">Documents</Tab>
                <Tab value="settings">Settings</Tab>
              </TabList>
            </div></FluentProvider>
            <div className="main-content-body">
              {isSignedIn && selectedContainer && (
                <ContainerBrowser container={selectedContainer} />
              )}
            </div>
          </div>
          <div style={{ display: showChat ? 'block' : 'none' }} className="spe-app-content-sidebar" ref={sidebarRef}>
            <div className="sidebar-resizer" ref={sidebarResizerRef} onMouseDown={onResizerMouseDown} />
            <div className="sidebar-content">
              <div className="spe-embedded-chat">
                {isSignedIn && chatUrl && (
                  <EmbeddedChat
                    app='OneDriveForBusiness'
                    chatEmbeddedPageUrl={chatUrl}
                    onLoad={onEmbeddedChatLoad}
                    getAuthToken={getChatToken}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </FluentProvider>
  );
  /*
  return (
    <FluentProvider theme={webLightTheme}>
      <div className="App">
        <div className="spe-app-header">
          <div className="spe-header-title">
            <Text size={400} weight='bold'>Sample SPA SharePoint Embedded App</Text>
          </div>
          <div className="spe-header-search">
            <SearchBox style={{width: '500px'}} />
          </div>
          <div className="spe-header-actions">
            <Login ref={loginRef} loginView='avatar' showPresence={true} />
          </div>
        </div>
        <div className="spe-app-content">
          <div className="spe-app-main-page">
            {isSignedIn && (<ContainersView />)}
          </div>
          <div className="spe-embedded-chat">
            {isSignedIn && (
              <EmbeddedChat 
                app='OneDriveForBusiness' 
                chatEmbeddedPageUrl={embeddedChatUrl} 
                onLoad={onEmbeddedChatLoad}
                getAuthToken={getChatToken}
              />
            )}
          </div>
        </div>
      </div>
    </FluentProvider>
  );
  */
}

export default App;
