import "./App.css";
import { Form, useLoaderData } from "react-router-dom";
import { ILoaderParams } from "../common/ILoaderParams";
import { JobsApiProvider } from "../providers/JobsApiProvider";
import { Job } from "../model/Job";
import { useEffect, useState } from "react";
import { GraphProvider } from "../providers/GraphProvider";
import {
  Icon,
  Pivot,
  PivotItem,
  DefaultButton,
  PrimaryButton,
  TooltipHost,
  ITooltipHostStyles,
} from "@fluentui/react";
import { Tag } from "@fluentui/react-components";
import {
  Breadcrumb,
  IBreadcrumbItem,
  IBreadcrumbStyles,
  IDividerAsProps,
} from "@fluentui/react/lib/Breadcrumb";
import { mergeStyles } from "@fluentui/react/lib/Styling";
import ContainerBrowser from "../components/ContainerBrowser";
import { ViewJobApplicants } from "../components/ViewJobApplicants";
import { JobDetailsForm } from "../components/JobDetailsForm";

let job: Job | undefined;

export async function loader({
  params,
}: ILoaderParams): Promise<Job | undefined> {
  const jobId = params.jobId;
  return await JobsApiProvider.instance.get(jobId);
}

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

  const itemsWithHref: IBreadcrumbItem[] = [
    { text: "Hiring", key: "f0", href: "/hiring" },
    {
      text: job ? job.displayName : "",
      key: "f1",
      href: "",
    },
  ];

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
            <div className="view-job-breadcrumb-tag">
              <Tag appearance="brand">{job.state}</Tag>
            </div>
          </div>
          <Pivot>
            <PivotItem headerText="Details">
              <div>
                <JobDetailsForm job={job} />
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
                          className="primary-button"
                          text="Create Posting"
                          type="submit"
                          style={{
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
                        <div className="posting-edit-link-container">
                          <div>
                            <TooltipHost
                              content=" While SharePoint Embedded manages container permissions at the application level, documents can also be shared for collaboration across your organization"
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
                              className="primary-button"
                              aria-label="Edit job posting"
                              text="Edit"
                              style={{
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
