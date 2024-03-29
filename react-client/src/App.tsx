
import './App.css';
import React, {
  useState, useEffect
} from "react";
import {
  Providers,
  ProviderState
} from "@microsoft/mgt-element";
import { Login } from "@microsoft/mgt-react";
import {
  FluentProvider,
  Text,
  webLightTheme
} from "@fluentui/react-components";
import './App.css';
import { Containers } from './components/Containers';
import ContainersView from './components/ContainersView';


function useIsSignedIn() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const updateState = async () => {
      const provider = Providers.globalProvider;
      setIsSignedIn(provider && provider.state === ProviderState.SignedIn);
    };

    Providers.onProviderUpdated(updateState);
    updateState();

    return () => {
      Providers.removeProviderUpdatedListener(updateState);
    }
  }, []);

  return isSignedIn;
}

function App() {
  const isSignedIn = useIsSignedIn();
  
  return (
    <FluentProvider theme={webLightTheme}>
      <div className="App">
        <Text size={900} weight='bold'>Sample SPA SharePoint Embedded App</Text>
        <Login />
        <div>
          {isSignedIn && (<ContainersView />)}
        </div>
      </div>
    </FluentProvider>
  );
}

export default App;
