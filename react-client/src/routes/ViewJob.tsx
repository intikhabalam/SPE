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
  TooltipHost,
  ITooltipHostStyles,
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
  Info20Regular,
} from "@fluentui/react-icons";
import { TextField } from "@fluentui/react/lib/TextField";
import ContainerBrowser from "../components/ContainerBrowser";
//import { mockJobs } from "../model/Job.mock";
import { ViewJobApplicants } from "../components/ViewJobApplicants";

let job: Job | undefined;

// To Be uncommented when APIs decide to work
export async function loader({
  params,
}: ILoaderParams): Promise<Job | undefined> {
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
    try {
      await JobsApiProvider.instance.createPostingDoc(job.id);
      job = await JobsApiProvider.instance.get(job.id);

      if (job.postingDoc?.webUrl) {
        window.open(job.postingDoc.webUrl, "_blank");
      } else {
        console.error("Failed to retrieve postingDoc URL");
      }
    } catch (error) {
      console.error("Error creating posting doc:", error);
    }
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

const tooltipHostStyles: Partial<ITooltipHostStyles> = {
  root: {
    display: "inline-block",
    marginLeft: "8px",
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
    icons: {
      ChevronRight20Regular: <ChevronRight20Regular />,
      Info20Regular: <Info20Regular />,
      Edit20Filled: <Edit20Filled />,
      ArrowSync20Regular: <ArrowSync20Regular />,
    },
  });

  const editIcon = { iconName: "Edit20Filled" };
  const refreshIcon = { iconName: "ArrowSync20Regular" };

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
              <Tag appearance="brand">{job.state}</Tag>
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

                <div className="view-job-posting-section">
                  {!job.postingDoc && (
                    <div className="create-posting-form">
                      <p>No job posting yet -- create one!</p>
                      <Form method="post">
                        <input
                          type="hidden"
                          name="createPostingDoc"
                          value="true"
                        />
                        <PrimaryButton
                          text="Create Posting"
                          type="submit"
                          style={{
                            backgroundColor: "#393EB3",
                            color: "white",
                            padding: "5px",
                            borderRadius: "5px",
                            marginRight: "10px",
                            marginBottom: "20px",
                          }}
                        />
                      </Form>
                    </div>
                  )}
                  {job.postingDoc && (
                    <div className="posting-content">
                      {postingEditLink && (
                        <div
                          style={{
                            width: "100%",
                            padding: "20px 10px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <TooltipHost
                              content="SharePoint Embedded contextual content displays within these tooltips"
                              id="postingTooltip"
                              calloutProps={{ gapSpace: 0 }}
                              styles={tooltipHostStyles}
                            >
                              <Icon
                                iconName="Info20Regular"
                                aria-describedby="postingTooltip"
                                style={{
                                  fontSize: "16px",
                                  color: "red",
                                  marginLeft: "4px",
                                }}
                              />
                            </TooltipHost>
                          </div>
                          <div>
                            <PrimaryButton
                              aria-label="Edit job posting"
                              text="Edit"
                              style={{
                                backgroundColor: "#393EB3",
                                color: "white",
                                padding: "5px",
                                borderRadius: "5px",
                                marginRight: "5px",
                              }}
                              iconProps={editIcon}
                              onClick={() =>
                                window.open(postingEditLink, "_blank")
                              }
                            />
                            <DefaultButton
                              aria-label="Refresh"
                              text="Refresh"
                              iconProps={refreshIcon}
                              onClick={updatePreviewLink}
                              style={{
                                border: "none",
                              }}
                            />
                          </div>
                        </div>
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
                </div>
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
