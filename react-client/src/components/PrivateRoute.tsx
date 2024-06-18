import { Navigate, Outlet } from "react-router-dom";
import { Providers, ProviderState } from "@microsoft/mgt-react";
import { useEffect, useState } from "react";

const useIsSignedIn = () => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(true);

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

const PrivateRoute = () => {
  const isSignedIn = useIsSignedIn();

  console.log("isSignedIn", isSignedIn);
  console.log("Providers.globalProvider.state", Providers.globalProvider.state);
  console.log("ProviderState.SignedIn", ProviderState.SignedIn);
  console.log("Providers.globalProvider", Providers.globalProvider);
  console.log("ProviderState.SignedIn", ProviderState);

  return isSignedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
