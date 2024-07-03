import React, { useEffect } from "react";
import { useState } from "react";
import { useSubmit } from "react-router-dom";
import { IIconProps, TextField } from "@fluentui/react";
import { Dialog, DialogType, DialogFooter } from "@fluentui/react/lib/Dialog";
import { Spinner, SpinnerSize } from "@fluentui/react/lib/Spinner";
import {
  PrimaryButton,
  DefaultButton,
  CommandBarButton,
  IButtonStyles,
} from "@fluentui/react/lib/Button";

const dialogContentProps = {
  type: DialogType.largeHeader,
  title: "New Job Posting",
  subText:
    "Create a new job posting in a draft state. You can edit the posting in the next step before you publish it.",
};

const commandButtonStyles: IButtonStyles = {
  root: {
    padding: "10px 20px",
    justifyContent: "flex-end",
    alignItems: "center",
    borderRadius: "2px",
    border: "1px solid var(--Grey-palette-Grey110, #8A8886)",
    background: "var(--Grey-palette-White, #FFF)",
  },
};

export const CreateJobPostingButton: React.FC<{
  hideDialog: boolean;
  setHideDialog: React.Dispatch<React.SetStateAction<boolean>>;
  saving: boolean;
  setSaving: React.Dispatch<React.SetStateAction<boolean>>;
  formResetTrigger: number;
}> = ({ hideDialog, setHideDialog, saving, setSaving, formResetTrigger }) => {
  const [displayName, setDisplayName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (hideDialog) {
      setDisplayName("");
      setDescription("");
    }
  }, [hideDialog, formResetTrigger]);

  const addIcon: IIconProps = {
    iconName: "Add20Regular",
    styles: { root: { color: "black", height: "16px", width: "16px" } },
  };

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

  const submit = useSubmit();

  const submitCreateJob = async (): Promise<void> => {
    if (!displayName || !description) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("displayName", displayName);
      formData.append("description", description);
      await submit(formData, { method: "POST" });
    } catch (error) {
      console.error(error);
    }
  };

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

  return (
    <>
      <CommandBarButton
        text="Create New Job Posting"
        iconProps={addIcon}
        onClick={() => setHideDialog(false)}
        styles={commandButtonStyles}
      />

      <Dialog
        hidden={hideDialog}
        onDismiss={() => setHideDialog(true)}
        dialogContentProps={dialogContentProps}
        modalProps={modalProps}
      >
        <form noValidate autoComplete="off">
          <TextField
            id={displayName}
            label="Job title"
            required
            value={displayName}
            onChange={handleDisplayNameChange}
          />
          <TextField
            id={description}
            label="Container description:"
            required
            value={description}
            onChange={handleDescriptionChange}
          />
        </form>
        {saving && (
          <Spinner
            size={SpinnerSize.medium}
            label="Creating Job..."
            labelPosition="right"
            style={{ marginTop: "10px" }}
          />
        )}
        <DialogFooter>
          <PrimaryButton onClick={submitCreateJob}>Create</PrimaryButton>
          <DefaultButton onClick={() => setHideDialog(true)}>
            Cancel
          </DefaultButton>
        </DialogFooter>
      </Dialog>
    </>
  );
};
