import { useState, useEffect, useCallback } from "react";
import { INavLinkGroup, INavStyles, Nav } from "@fluentui/react";
import { ContainersApiProvider } from "../providers/ContainersApiProvider";
import { IContainer } from "../../../common/schemas/ContainerSchemas";
import { ProviderState, Providers } from "@microsoft/mgt-react";

const containersApi = ContainersApiProvider.instance;

const useIsSignedIn = () => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

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
        color: "white",
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

export const Navigation = () => {
  const [containers, setContainers] = useState<IContainer[] | undefined>();
  const isSignedIn = useIsSignedIn();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleContainerCreated = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

  useEffect(() => {
    const fetchContainers = async () => {
      try {
        if (isSignedIn) {
          const containerList = await containersApi.list();
          setContainers(containerList);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchContainers();
  }, [refreshKey, isSignedIn]);

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
          disabled: !containers || containers.length === 0,
          key: "key4",
          iconProps: {
            iconName: "Star20Regular",
            style: {
              color:
                !containers || containers.length === 0 ? "#A6A6A6" : "#6DCCF4",
              width: "20px",
            },
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

  return (
    <Nav
      selectedKey={getSelectedKey()}
      ariaLabel="Nav basic example"
      groups={navLinkGroups}
      styles={navStyles}
    />
  );
};
