import { Form, useLoaderData, useNavigate } from "react-router-dom";
import { ILoaderParams } from "../common/ILoaderParams";
import { JobsApiProvider } from "../providers/JobsApiProvider";
import { Job } from "../model/Job";
import { useEffect, useState } from "react";
import { GraphProvider } from "../providers/GraphProvider";
import {
  Icon,
  registerIcons,
  Pivot,
  PivotItem,
  DefaultButton,
  PrimaryButton,
} from "@fluentui/react";
import {
  Button,
  Divider,
  Input,
  Label,
  Tag,
  Toolbar,
  ToolbarButton,
} from "@fluentui/react-components";
import {
  Breadcrumb,
  IBreadcrumbItem,
  IBreadcrumbStyles,
  IDividerAsProps,
} from "@fluentui/react/lib/Breadcrumb";

import { mergeStyles } from "@fluentui/react/lib/Styling";
import {
  Edit20Filled,
  ArrowSync20Regular,
  ChevronRight20Regular,
} from "@fluentui/react-icons";
import { TextField } from "@fluentui/react/lib/TextField";
import ContainerBrowser from "../components/ContainerBrowser";
//import { mockJobs } from "../model/Job.mock";
import { ViewJobApplicants } from "../components/ViewJobApplicants";

let job: Job | undefined;

// To Be uncommented when APIs decide to work
export async function loader({ params }: ILoaderParams): Promise<Job | undefined> {
    const jobId = params.jobId;
    return await JobsApiProvider.instance.get(jobId);
}

// Uncommented for Local use
// export async function loader({
//   params,
// }: ILoaderParams): Promise<Job | undefined> {
//   const jobId = params.jobId;
//   console.log("Loader called with jobId:", jobId);
//   // Search for the job in mockJobs
//   const mockJob = mockJobs.find((job) => job.id === jobId);

//   if (mockJob) {
//     console.log("Job found:", mockJob);
//     return new Job(mockJob);
//   }

//   console.log("No job found for jobId:", jobId);
//   return undefined;
// }

export async function action({ params, request }: ILoaderParams) {
  const formData = await request.formData();
  const fields = Object.fromEntries(formData);
  if (job && fields.createPostingDoc) {
    await JobsApiProvider.instance.createPostingDoc(job.id);
    job = await JobsApiProvider.instance.get(job.id);
    window.open(job.postingDoc?.webUrl, "_blank");
  }
  return job;
}

const iconClass = mergeStyles({
  margin: "5px 0 0 0",
});

const breadcrumbStyles: Partial<IBreadcrumbStyles> = {
  root: {
    FontSize: "22px",
  },
};

export const ViewJob: React.FunctionComponent = () => {
  job = useLoaderData() as Job | undefined;
  const [postingEditLink, setPostingEditLink] = useState<string | undefined>(
    undefined
  );
  const [postingPreviewLink, setPostingPreviewLink] = useState<
    string | undefined
  >(undefined);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const navigate = useNavigate();

  const itemsWithHref: IBreadcrumbItem[] = [
    { text: "Jobs", key: "Jobs", href: "/hiring" },
    {
      text: job ? job.displayName : "",
      key: "f1",
      href: "",
    },
  ];

  registerIcons({
    icons: { ChevronRight20Regular: <ChevronRight20Regular /> },
  });

  useEffect(() => {
    updatePreviewLink();
  }, []);

  const updatePreviewLink = () => {
    if (job && job.postingDoc) {
      setPostingEditLink(job.postingDoc.webUrl);
      GraphProvider.instance
        .getPreviewUrl(job.id, job.postingDoc.id)
        .then((url: URL) => {
          setPostingPreviewLink(url.href);
        });
    }
  };

  const deleteJob = async () => {
    if (job) {
      await JobsApiProvider.instance.deleteJob(job.id);
      navigate("/jobs");
    }
  };

  function _getCustomDivider(dividerProps: IDividerAsProps): JSX.Element {
    return <Icon iconName="ChevronRight20Regular" className={iconClass} />;
  }

  return (
    <>
      {job && (
        <div className="view-job">
          <div className="view-job-breadcrumb">
            <Breadcrumb
              items={itemsWithHref}
              maxDisplayedItems={2}
              dividerAs={_getCustomDivider}
              styles={breadcrumbStyles}
            />
            <div
              style={{
                display: "inline-block",
                padding: "2px 8px",
                background: "#E4F1FD",
                color: "#0F6CBD",
              }}
            >
              <Tag appearance="brand">{job.customProperties?.state.value}</Tag>
            </div>
          </div>
          <Pivot>
            <PivotItem headerText="Details">
              {" "}
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
                    defaultValue={job.createdDateTime}
                  />
                </Form>
                <div
                  style={{
                    margin: "25px 0",
                    height: "1px",
                    width: "100%",
                    border: "1px solid #d1d1d1",
                  }}
                />
                <DefaultButton
                  text="Edit Details"
                  onClick={() => setIsReadOnly(false)}
                  style={{
                    padding: "5px",
                    borderRadius: "5px",
                    marginRight: "10px",
                  }}
                />
                {!job.isPublished && (
                  <PrimaryButton
                    text="Publish"
                    onClick={() => setIsReadOnly(true)}
                    style={{
                      backgroundColor: "#393EB3",
                      color: "white",
                      padding: "5px",
                      borderRadius: "5px",
                      marginRight: "10px",
                    }}
                  />
                )}
                <DefaultButton
                  text="Delete"
                  onClick={deleteJob}
                  style={{
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                />

                {/* <>
                  {!job.postingDoc && (
                    <div className="create-posting-form">
                      <p>No job posting yet -- create one!</p>
                      <Form method="post">
                        <input
                          type="hidden"
                          name="createPostingDoc"
                          value="true"
                        />
                        <Button appearance="primary" type="submit">
                          Create Posting
                        </Button>
                      </Form>
                    </div>
                  )}
                  {job.postingDoc && (
                    <div className="posting-content">
                      {postingEditLink && (
                        <p>
                          <Toolbar>
                            <ToolbarButton
                              aria-label="Edit job posting"
                              appearance="primary"
                              icon={<Edit20Filled />}
                              onClick={() =>
                                window.open(postingEditLink, "_blank")
                              }
                            >
                              Edit
                            </ToolbarButton>
                            <ToolbarButton
                              aria-label="Refresh"
                              icon={<ArrowSync20Regular />}
                              onClick={updatePreviewLink}
                            >
                              Refresh
                            </ToolbarButton>
                          </Toolbar>
                        </p>
                      )}
                      {postingPreviewLink && (
                        <iframe
                          title={job.displayName}
                          src={postingPreviewLink}
                          style={{ width: "75%", height: "600px" }}
                        ></iframe>
                      )}
                    </div>
                  )}
                </> */}
              </div>
            </PivotItem>
            <PivotItem headerText="Applicants">
              <ViewJobApplicants job={job} />
            </PivotItem>
            <PivotItem headerText="Setting">
              <ContainerBrowser />
            </PivotItem>
          </Pivot>
        </div>
      )}
    </>
  );
};
