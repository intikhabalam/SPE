import "./App.css";
import { Link, useActionData, useLoaderData } from "react-router-dom";
import { ILoaderParams } from "../common/ILoaderParams";
import { JobsApiProvider } from "../providers/JobsApiProvider";
import {
  IJob,
  IJobClientCreateRequest,
} from "../../../common/schemas/JobSchemas";
import { Tag } from "@fluentui/react-components";
import { IIconProps, Pivot, PivotItem } from "@fluentui/react";
import { MarqueeSelection } from "@fluentui/react/lib/MarqueeSelection";
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  IColumn,
  IDetailsListStyles,
} from "@fluentui/react/lib/DetailsList";
import { TooltipHost, ITooltipHostStyles } from "@fluentui/react/lib/Tooltip";
import { Job } from "../model/Job";
import { getFileTypeIconProps } from "@fluentui/react-file-type-icons";
import { Icon, registerIcons, Link as FluentLink } from "@fluentui/react";
import { CreateJobPostingButton } from "../components/CreateJobPostingButton";
//import { mockJobs } from "../model/Job.mock";
import { useRef, useState, useEffect } from "react";
import { Filter20Regular, Info20Regular } from "@fluentui/react-icons";

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

const tooltipHostStyles: Partial<ITooltipHostStyles> = {
  root: {
    display: "inline-block",
    marginLeft: "8px",
  },
};

export const Jobs: React.FunctionComponent = () => {
  const jobs = useLoaderData() as IJob[];
  const job = useActionData() as IJob | undefined;
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<IJob[]>(jobs);
  const [currentFilter, setCurrentFilter] = useState<string>("all");
  const [hideDialog, setHideDialog] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formResetTrigger, setFormResetTrigger] = useState(0);

  registerIcons({
    icons: {
      Info20Regular: <Info20Regular />,
      Filter20Regular: <Filter20Regular />,
    },
  });
  const filterIcon: IIconProps = {
    iconName: "Filter20Regular",
    styles: { root: { color: "black", height: "16px", width: "16px" } },
  };

  useEffect(() => {
    if (job) {
      setSaving(false);
      setHideDialog(true);
      setFormResetTrigger((prev) => prev + 1); // Trigger form reset
      // Add logic to refresh the jobs list if needed
    }
  }, [job]);

  const selection = useRef(
    new Selection({
      onSelectionChanged: () => selectionChangedHandler(),
    })
  ).current;

  const selectionChangedHandler = () => {
    const currentSelectedKeys = selection
      .getSelection()
      .map(({ key }) => key as string);
    setSelectedKeys(currentSelectedKeys);
  };

  const handleFilterChange = (item?: PivotItem) => {
    setCurrentFilter(item?.props.itemKey || "all");
  };

  useEffect(() => {
    let sortedFilteredJobs = [...jobs];
    if (currentFilter === "recent") {
      sortedFilteredJobs.sort(
        (a, b) =>
          new Date(b.createdDateTime || 0).getTime() -
          new Date(a.createdDateTime || 0).getTime()
      );
      // } else if (currentFilter === "fulltime") {
      //   sortedFilteredJobs = sortedFilteredJobs.filter(
      //     (job) => job.customProperties?.employmentType.value === "Full time"
      //   );
      // } else if (currentFilter === "parttime") {
      //   sortedFilteredJobs = sortedFilteredJobs.filter(
      //     (job) => job.customProperties?.employmentType.value === "Part time"
      //   );
    }
    setFilteredJobs(sortedFilteredJobs);
  }, [currentFilter, jobs]);

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
      onRender: (job: Job) => {
        const date = new Date(job.createdDateTime ?? 0);
        const formattedDate = date.toLocaleDateString();
        return <span>{formattedDate}</span>;
      },
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
          <Tag appearance="brand">{job.state}</Tag>
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
      name: (
        <div style={{ display: "flex", alignItems: "center" }}>
          Posting Document
          <TooltipHost
            content="Developers can use SharePoint Embedded containers to easily secure content at the application level. For example, all job specific content is stored in it's own container."
            id="postingTooltip"
            calloutProps={{ gapSpace: 0 }}
            styles={tooltipHostStyles}
          >
            <Icon
              iconName="Info20Regular"
              aria-describedby="postingTooltip"
              style={{ fontSize: "16px", color: "red", marginLeft: "4px" }}
            />
          </TooltipHost>
        </div>
      ) as any,
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
          <Pivot
            aria-label="Filter Jobs"
            selectedKey={currentFilter}
            onLinkClick={handleFilterChange}
          >
            <PivotItem headerText="All" itemKey="all" />
            <PivotItem headerText="Recent" itemKey="recent" />
          </Pivot>
        </div>
        <div className="spe-job-header-filter">
          <CreateJobPostingButton
            hideDialog={hideDialog}
            setHideDialog={setHideDialog}
            saving={saving}
            setSaving={setSaving}
            formResetTrigger={formResetTrigger}
          />
        </div>
      </div>
      <div style={{ height: "600px", overflowY: "auto" }}>
        <MarqueeSelection selection={selection}>
          <DetailsList
            items={filteredJobs}
            columns={columns}
            selection={selection}
            setKey="set"
            layoutMode={DetailsListLayoutMode.justified}
            selectionPreservedOnEmptyClick={true}
            ariaLabelForSelectionColumn="Toggle selection"
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
            checkButtonAriaLabel="select row"
            styles={detailListStyles}
          />
        </MarqueeSelection>
      </div>
    </div>
  );
};
