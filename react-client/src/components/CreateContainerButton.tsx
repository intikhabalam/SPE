import * as React from "react";
import { Button } from "@fluentui/react-components";
import { Dialog, DialogType, DialogFooter } from "@fluentui/react/lib/Dialog";
import { Spinner, SpinnerSize } from "@fluentui/react/lib/Spinner";
import { PrimaryButton, DefaultButton } from "@fluentui/react/lib/Button";
import { TextField } from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";

import {
  IContainer,
  IContainerClientCreateRequest,
} from "../../../common/schemas/ContainerSchemas";
import { ContainersApiProvider } from "../providers/ContainersApiProvider";
import { ILoaderParams } from "../common/ILoaderParams";

const containersApi = ContainersApiProvider.instance;

export async function loader({ params }: ILoaderParams): Promise<IContainer[]> {
  const contatinersLite = await ContainersApiProvider.instance.list();
  const containers = contatinersLite.map(async (container) => {
    return await ContainersApiProvider.instance.get(container.id);
  });
  return Promise.all(containers);
}

export type ICreateContainerButtonProps = {
  isOpen?: boolean;
  onAbort?: () => void;
  onContainerCreated?: (container: IContainer) => void;
};

const dialogContentProps = {
  type: DialogType.largeHeader,
  title: "Create a new job",
};

export const CreateContainerButton: React.FunctionComponent<
  ICreateContainerButtonProps
> = (props: ICreateContainerButtonProps) => {
  const [displayName, setDisplayName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const [containerCount, setContainerCount] = React.useState(0);

  const modalProps = {
    isBlocking: false,
    styles: {
      main: {
        width: "400px",
        display: "flex",
        flexDirection: "column",
        rowGap: "10px",
        marginBottom: "25px",
        color: "black",
        border: "none",
      },
    },
  };

  React.useEffect(() => {
    const fetchContainerCount = async () => {
      const containers = await ContainersApiProvider.instance.list();
      console.log(containers);
      setContainerCount(containers.length);
    };

    fetchContainerCount();
  }, []);

  const handleDisplayNameChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ): void => {
    setDisplayName(newValue || "");
  };

  const handleDescriptionChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ): void => {
    setDescription(newValue || "");
  };

  const onCreateClick = async (): Promise<void> => {
    if (!displayName) {
      return;
    }
    setSaving(true);
    try {
      const createContainerRequest: IContainerClientCreateRequest = {
        displayName: displayName,
        description: description,
      };
      const newContainer = await containersApi.create(createContainerRequest);
      props.onContainerCreated?.(newContainer);
      toggleHideDialog();
      setDisplayName("");
      setDescription("");
      setContainerCount(containerCount + 1);
    } catch (error) {
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Button
        appearance="primary"
        onClick={toggleHideDialog}
        style={{
          backgroundColor: "#393EB3",
          color: "white",
          padding: "5px",
          borderRadius: "5px",
        }}
        disabled={containerCount >= 5}
      >
        Create
      </Button>
      <Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={dialogContentProps}
        modalProps={modalProps}
      >
        <form noValidate autoComplete="off">
          <TextField
            id={displayName}
            label="Job name:"
            required
            value={displayName}
            onChange={handleDisplayNameChange}
          />
          <TextField
            id={description}
            label="Job description:"
            required
            value={description}
            onChange={handleDescriptionChange}
          />
        </form>
        {saving && (
          <Spinner
            size={SpinnerSize.medium}
            label="Creating job..."
            labelPosition="right"
            style={{ marginTop: "10px" }}
          />
        )}
        <DialogFooter>
          <PrimaryButton onClick={onCreateClick}>Create</PrimaryButton>
          <DefaultButton onClick={toggleHideDialog}>Cancel</DefaultButton>
        </DialogFooter>
      </Dialog>
    </>
  );
};
