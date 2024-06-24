import React from "react";
import { useState } from "react";
import { useSubmit } from "react-router-dom";
import { TextField } from "@fluentui/react";
import { Button } from "@fluentui/react-components";
import { Dialog, DialogType, DialogFooter } from "@fluentui/react/lib/Dialog";
import { Spinner, SpinnerSize } from "@fluentui/react/lib/Spinner";
import { PrimaryButton, DefaultButton } from "@fluentui/react/lib/Button";
import { useBoolean } from "@fluentui/react-hooks";

const dialogContentProps = {
  type: DialogType.largeHeader,
  title: "New Job Posting",
  subText:
    "Create a new job posting in a draft state. You can edit the posting in the next step before you publish it.",
};

export const CreateJobPostingButton: React.FC = () => {
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const [displayName, setDisplayName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [saving, setSaving] = React.useState(false);

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

  const submitCreateJob = async () => {
    if (!displayName || !description) return;
    setSaving(true);
    const formData = new FormData();
    formData.append("displayName", displayName);
    formData.append("description", description);
    await submit(formData, { method: "POST" });
    setDisplayName("");
    setDescription("");
    setSaving(false);
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
      <Button appearance="primary" onClick={toggleHideDialog}>
        + Create New Job Posting
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
            label="Creating storage Container..."
            labelPosition="right"
            style={{ marginTop: "10px" }}
          />
        )}
        <DialogFooter>
          <PrimaryButton onClick={submitCreateJob}>Create</PrimaryButton>
          <DefaultButton onClick={toggleHideDialog}>Cancel</DefaultButton>
        </DialogFooter>
      </Dialog>
    </>
  );
};
