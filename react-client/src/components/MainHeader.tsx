import React from "react";
import { useConst } from "@fluentui/react-hooks";
import {
  DefaultButton,
  IContextualMenuProps,
  IContextualMenuStyles,
} from "@fluentui/react";
import { Toggle, IToggleStyles } from "@fluentui/react/lib/Toggle";

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

const MainHeader = ({
  showSidePanel,
  setShowSidePanel,
}: {
  showSidePanel: boolean;
  setShowSidePanel: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const toggleSidePanel = () => {
    setShowSidePanel(!showSidePanel);
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
  );
};

export default MainHeader;
