import "../routes/App.css";
import { Form, useNavigate } from "react-router-dom";
import { TextField } from "@fluentui/react/lib/TextField";
import { Job } from "../model/Job";
import { useState } from "react";
import { DefaultButton, PrimaryButton } from "@fluentui/react";
import { JobsApiProvider } from "../providers/JobsApiProvider";

export interface IJobDetailsFormProps {
  job: Job | undefined;
}

export const JobDetailsForm: React.FunctionComponent<IJobDetailsFormProps> = (
  props: IJobDetailsFormProps
) => {
  const job = props.job;
  const [isReadOnly, setIsReadOnly] = useState(true);
  const navigate = useNavigate();

  const formatDate = (dateString: string | number | Date | undefined) => {
    if (!dateString) {
      return "";
    }
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const deleteJob = async () => {
    if (job) {
      await JobsApiProvider.instance.deleteJob(job.id);
      navigate("/jobs");
    }
  };

  return (
    <>
      {job && (
        <div>
          <Form className="edit-job" action="patch">
            <TextField
              className="view-job-form-input"
              label="Job Title"
              readOnly={isReadOnly}
              defaultValue={job.displayName}
            />
            <TextField
              className="view-job-form-textarea"
              label="Description"
              multiline
              rows={3}
              readOnly={isReadOnly}
              defaultValue={job.description}
            />
            <TextField
              className="view-job-form-input"
              label="Created"
              readOnly={isReadOnly}
              defaultValue={formatDate(job.createdDateTime)}
            />
          </Form>
          <div className="button-action-bar">
            <DefaultButton
              className="default-button"
              text="Edit Details"
              onClick={() => setIsReadOnly(false)}
              style={{ marginTop: "25px", marginRight: "10px" }}
            />
            {!job.isPublished && (
              <PrimaryButton
                className="primary-button"
                text="Publish"
                onClick={() => setIsReadOnly(true)}
                style={{ marginRight: "10px" }}
              />
            )}
            <DefaultButton
              className="default-button"
              text="Delete"
              onClick={deleteJob}
            />
          </div>
        </div>
      )}
    </>
  );
};
