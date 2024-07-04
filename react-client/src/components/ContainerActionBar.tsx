import React, { useEffect, useRef, useState } from "react";
import { Button } from "@fluentui/react-components";
import { IContextualMenuProps, IIconProps } from "@fluentui/react";
import { Settings20Filled } from "@fluentui/react-icons";
import { DefaultButton } from "@fluentui/react/lib/Button";
import { Toggle } from "@fluentui/react/lib/Toggle";
import { IDriveItem } from "../common/FileSchemas";
import { GraphProvider } from "../providers/GraphProvider";
import { getFileTypeIconProps } from "@fluentui/react-file-type-icons";
import { IContainer } from "../../../common/schemas/ContainerSchemas";
import { ContainersApiProvider } from "../providers/ContainersApiProvider";

const containersApi = ContainersApiProvider.instance;
const filesApi = GraphProvider.instance;

type IPendingUpload = {
  driveId: string;
  parentId: string;
  file: File;
  uploadTask: Promise<IDriveItem>;
};

export interface IContainerActionBarProps {
  container: IContainer;
  parentId: string;
  selectedItem?: IDriveItem;
  onFilePreviewSelected?: (file: IDriveItem) => void;
  onItemsUpdated?: () => void;
}

const menuProps: IContextualMenuProps = {
  onDismiss: (ev) => {
    if (ev && "shiftKey" in ev) {
      ev.preventDefault();
    }
  },
  items: [
    {
      key: "wordDocument",
      text: "Word document",
      iconProps: {
        iconName: getFileTypeIconProps({ extension: "docx", size: 20 })
          .iconName,
      },
      onClick: () => console.log("New Word document"),
    },
    {
      key: "powerPointDocument",
      text: "PowerPoint document",
      iconProps: {
        iconName: getFileTypeIconProps({ extension: "pptx", size: 20 })
          .iconName,
      },
      onClick: () => console.log("New PowerPoint document"),
    },
    {
      key: "excelDocument",
      text: "Excel document",
      iconProps: {
        iconName: getFileTypeIconProps({ extension: "xlsx", size: 20 })
          .iconName,
      },
      onClick: () => console.log("New Excel document"),
    },
    {
      key: "newFolder",
      text: "Folder",
      iconProps: {
        iconName: "Folder24Filled",
        color: "#FFCE3D",
      },
      onClick: () => console.log("New Folder"),
    },
  ],
  directionalHintFixed: true,
};

export const ContainerActionBar: React.FunctionComponent<
  IContainerActionBarProps
> = (props: IContainerActionBarProps) => {
  //const [container, setContainer] = useState<IContainer>(props.container);
  // const [showContainerSettings, setShowContainerSettings] = useState(false);
  const [uploads, setUploads] = useState<Map<string, IPendingUpload>>(
    new Map<string, IPendingUpload>()
  );
  const [processingEnabled, setProcessingEnabled] = useState(
    props.container.customProperties?.docProcessingSubscriptionId !== undefined
  );
  const uploadFileRef = useRef<HTMLInputElement>(null);

  const addIcon: IIconProps = {
    iconName: "Add20Regular",
    styles: { root: { color: "black", height: "16px", width: "16px" } },
  };
  const upArrowIcon: IIconProps = {
    iconName: "ArrowUpload20Filled",
    styles: { root: { color: "black", height: "16px", width: "16px" } },
  };

  useEffect(() => {
    setProcessingEnabled(
      props.container.customProperties?.docProcessingSubscriptionId !==
        undefined
    );
  }, [props.container.customProperties?.docProcessingSubscriptionId]);

  const onUploadFileClick = () => {
    if (uploadFileRef.current) {
      uploadFileRef.current.click();
    }
  };

  const onUploadFileSelected = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }
    for (let i = 0; i < files.length; i++) {
      const upload: IPendingUpload = {
        driveId: props.container.id,
        parentId: props.parentId,
        file: files[i],
        uploadTask: filesApi.uploadFile(
          props.container.id,
          files[i],
          props.parentId
        ),
      };
      const uploadId = `${upload.driveId}/${upload.parentId}/${files[i].name}`;
      uploads.set(uploadId, upload);
      upload.uploadTask.then(() => {
        uploads.delete(uploadId);
        setUploads(new Map<string, IPendingUpload>(uploads));
        if (uploads.size === 0) {
          props.onItemsUpdated?.();
        }
      });
    }
    setUploads(new Map<string, IPendingUpload>(uploads));
  };

  const processingEnabledChanged = async (
    event: React.MouseEvent<HTMLElement>,
    checked?: boolean
  ) => {
    const isChecked =
      checked ?? (event.currentTarget as HTMLInputElement).checked;

    if (isChecked) {
      try {
        await containersApi.enableProcessing(props.container.id);
        setProcessingEnabled(true);
      } catch (error) {
        console.error(error);
        setProcessingEnabled(false);
      } finally {
        props.onItemsUpdated?.();
      }
    } else {
      try {
        await containersApi.disableProcessing(props.container.id);
        setProcessingEnabled(false);
      } catch (error) {
        console.error(error);
        setProcessingEnabled(true);
      } finally {
        props.onItemsUpdated?.();
      }
    }
  };

  return (
    <div className="action-bar">
      <div className="left-section">
        <input
          ref={uploadFileRef}
          type="file"
          multiple
          onChange={onUploadFileSelected}
          style={{ display: "none" }}
        />
        <DefaultButton
          onClick={onUploadFileClick}
          text="Upload"
          iconProps={upArrowIcon}
          style={{ border: "none" }}
        />
        <DefaultButton
          text="New item"
          iconProps={addIcon}
          menuProps={menuProps}
          style={{ border: "none" }}
        />
      </div>
      <div className="right-section">
        <Settings20Filled style={{ marginRight: "10px" }} />
        {uploads.size > 0 && (
          <Button disabled={true}>{uploads.size} files uploading</Button>
        )}
        <Toggle
          checked={processingEnabled}
          inlineLabel
          onChange={processingEnabledChanged}
          label="Receipt Processing"
          style={{ marginTop: "5px" }}
        />
      </div>
    </div>
  );
};

export default ContainerActionBar;
