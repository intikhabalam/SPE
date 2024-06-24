import "./App.css";
import { Link, useActionData, useLoaderData } from "react-router-dom";
import { ILoaderParams } from "../common/ILoaderParams";
import { JobsApiProvider } from "../providers/JobsApiProvider";
import {
  IJob,
  IJobClientCreateRequest,
} from "../../../common/schemas/JobSchemas";
import { Tag } from "@fluentui/react-components";
import { Pivot, PivotItem } from "@fluentui/react";
import { MarqueeSelection } from "@fluentui/react/lib/MarqueeSelection";
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  IColumn,
  IDetailsListStyles,
} from "@fluentui/react/lib/DetailsList";

import { Job } from "../model/Job";
import { getFileTypeIconProps } from "@fluentui/react-file-type-icons";
import { Icon, Link as FluentLink } from "@fluentui/react";
import { CreateJobPostingButton } from "../components/CreateJobPostingButton";
//import { mockJobs } from "../model/Job.mock";

// To Be uncommented when APIs decide to work
export async function loader({ params }: ILoaderParams): Promise<Job[]> {
  const jobsLite = await JobsApiProvider.instance.list();
  const jobs = jobsLite.map(async (job) => {
    return await JobsApiProvider.instance.get(job.id);
  });
  return Promise.all(jobs);
}

// To Be uncommented for Local use
// export async function loader({ params }: ILoaderParams): Promise<IJob[]> {
//   return mockJobs; // Return mock data directly
// }

export async function action({ params, request }: ILoaderParams) {
  const formData = await request.formData();
  const job = Object.fromEntries(formData) as IJobClientCreateRequest;
  return await JobsApiProvider.instance.create(job);
}

const detailListStyles: Partial<IDetailsListStyles> = {
  root: { marginTop: "20px" },
  headerWrapper: { backgroundColor: "#f4f7fa !important", fontWeight: "bold" },
};

export const Jobs: React.FunctionComponent = () => {
  const jobs = useLoaderData() as IJob[];
  const job = useActionData() as IJob | undefined;
  if (job) {
    //navigate(`/jobs/${job.id}`);
    //window.open(`/jobs/${job.id}`);
  }
  const selection = new Selection({
    onSelectionChanged: () => {
      const selectionDetails = getSelectionDetails();
      console.log(selectionDetails);
      // You can also update the state or perform other actions here
    },
  });

  const getSelectionDetails = (): string => {
    const selectionCount = selection.getSelectedCount();
    switch (selectionCount) {
      case 0:
        return "No items selected";
      case 1:
        return (
          "1 item selected: " +
          (selection.getSelection()[0] as IJob).displayName
        );
      default:
        return `${selectionCount} items selected`;
    }
  };

  const columns: IColumn[] = [
    {
      key: "displayName",
      name: "Job Title",
      fieldName: "displayName",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: (job: Job) => <Link to={job.id}>{job.displayName}</Link>,
      styles: {
        cellTitle: {
          display: "flex",
          alignItems: "center",
        },
      },
    },
    {
      key: "description",
      name: "Description",
      fieldName: "description",
      minWidth: 200,
      maxWidth: 300,
      isResizable: true,
      onRender: (job: Job) => <span>{job.description}</span>,
      styles: {
        cellTitle: {
          display: "flex",
          alignItems: "center",
        },
      },
    },
    {
      key: "createdDate",
      name: "Created",
      fieldName: "createdDate",
      minWidth: 50,
      maxWidth: 100,
      isResizable: true,
      onRender: (job: Job) => <span>{job.createdDateTime}</span>,
      styles: {
        cellTitle: {
          display: "flex",
          alignItems: "center",
        },
      },
    },
    {
      key: "state",
      name: "State",
      fieldName: "state",
      minWidth: 25,
      maxWidth: 100,
      isResizable: true,
      onRender: (job: Job) => (
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
      ),
      styles: {
        cellTitle: {
          display: "flex",
          alignItems: "center",
        },
      },
    },
    {
      key: "posting",
      name: "Posting Document",
      fieldName: "posting",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      styles: {
        cellTitle: {
          display: "flex",
          alignItems: "center",
        },
      },
      onRender: (job: Job) => {
        const iconProps = getFileTypeIconProps({ extension: "docx", size: 24 });

        return (
          <>
            {job.postingDoc && job.postingDoc.name && job.postingDoc.webUrl && (
              <>
                <Icon {...iconProps} />
                <FluentLink
                  href={job.postingDoc.webUrl}
                  target="_blank"
                  style={{ paddingLeft: "5px" }}
                >
                  {job.postingDoc.name}
                </FluentLink>
              </>
            )}
          </>
        );
      },
    },
  ];

  return (
    <div>
      <div className="spe-job-header">
        <div className="spe-job-header-filter">
          <Pivot aria-label="Filter Jobs">
            <PivotItem headerText="All" itemKey="all" />
            <PivotItem headerText="Recent" itemKey="recent" />
            <PivotItem headerText="Full time" itemKey="fulltime" />
            <PivotItem headerText="Part time" itemKey="parttitme" />
          </Pivot>
        </div>
        <CreateJobPostingButton />
      </div>
      <MarqueeSelection selection={selection}>
        <DetailsList
          items={jobs}
          columns={columns}
          setKey="set"
          layoutMode={DetailsListLayoutMode.justified}
          selection={selection}
          selectionPreservedOnEmptyClick={true}
          ariaLabelForSelectionColumn="Toggle selection"
          ariaLabelForSelectAllCheckbox="Toggle selection for all items"
          checkButtonAriaLabel="select row"
          styles={detailListStyles}
        />
      </MarqueeSelection>
    </div>
  );
};
