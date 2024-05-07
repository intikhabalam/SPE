import { Form, Link, useActionData, useLoaderData, useNavigate, useSubmit } from "react-router-dom";
import { ILoaderParams } from "../common/ILoaderParams";
import { JobsApiProvider } from "../providers/JobsApiProvider";
import { IJob, IJobClientCreateRequest } from "../../../common/schemas/JobSchemas";
import { Breadcrumb, BreadcrumbButton, BreadcrumbItem, Button, DataGrid, DataGridBody, DataGridCell, DataGridHeader, DataGridHeaderCell, DataGridRow, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Input, Label, TableCellLayout, TableColumnDefinition, Tag, createTableColumn } from "@fluentui/react-components";
import { useRef, useState } from "react";
import { Job } from "../model/Job";
import { getFileTypeIconProps } from "@fluentui/react-file-type-icons";
import { Icon, Link as FluentLink } from "@fluentui/react";
import { Spinner } from "@microsoft/mgt-react";

export async function loader({ params }: ILoaderParams): Promise<Job[]> {
    const jobsLite = await JobsApiProvider.instance.list();
    const jobs = jobsLite.map(async (job) => {
        return await JobsApiProvider.instance.get(job.id)
    });
    return Promise.all(jobs);
}

export async function action({ params, request }: ILoaderParams) {
    const formData = await request.formData();
    const job = Object.fromEntries(formData) as IJobClientCreateRequest;
    return await JobsApiProvider.instance.create(job);
  }

export const Jobs: React.FunctionComponent = () => {
    const [displayName, setDisplayName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
    const [showCreatingSpinner, setShowCreatingSpinner] = useState<boolean>(false);
    const navigate = useNavigate();
    const jobs = useLoaderData() as IJob[];
    const job = useActionData() as IJob | undefined;
    if (job) {
        //navigate(`/jobs/${job.id}`);
        //window.open(`/jobs/${job.id}`);
    }
    const submit = useSubmit();
    
    const submitCreateJob = async () => {
        setShowCreatingSpinner(true);
        const formData = new FormData();
        formData.append("displayName", displayName);
        formData.append("description", description);
        await submit(formData, { method: "POST" });
        setDisplayName("");
        setDescription("");
        setShowCreateDialog(false);
        setShowCreatingSpinner(false);
    }

    const columns: TableColumnDefinition<Job>[] = [
        createTableColumn({
            columnId: 'displayName',
            renderHeaderCell: () => {
                return 'Job Title'
            },
            renderCell: (job) => {
                return (
                    <TableCellLayout>
                        <Link to={job.id}>{job.displayName}</Link>
                    </TableCellLayout>
                )
            }
        }),
        createTableColumn({
            columnId: 'description',
            renderHeaderCell: () => {
                return 'Description'
            },
            renderCell: (job) => {
                return (
                    <TableCellLayout>
                        {job.description}
                    </TableCellLayout>
                )
            }
        }),
        createTableColumn({
            columnId: 'createdDate',
            renderHeaderCell: () => {
                return 'Created'
            },
            renderCell: (job) => {
                return (
                    <TableCellLayout>
                        {job.createdDateTime}
                    </TableCellLayout>
                )
            }
        }),
        createTableColumn({
            columnId: 'state',
            renderHeaderCell: () => {
                return 'State'
            },
            renderCell: (job) => {
                return (
                    <TableCellLayout>
                        <Tag appearance="brand">{job.state}</Tag>
                    </TableCellLayout>
                )
            }
        }),
        createTableColumn({
            columnId: 'posting',
            renderHeaderCell: () => {
                return 'Posting Document'
            },
            renderCell: (job) => {
                const iconProps = getFileTypeIconProps({ extension: 'docx', size: 24 });
                return (
                    <TableCellLayout>
                        {job.postingDoc && job.postingDoc.name && job.postingDoc.webUrl && (<>
                            <Icon {...iconProps} />
                            <FluentLink href={job.postingDoc?.webUrl} target="_blank" >{job.postingDoc?.name}</FluentLink>
                        </>)}
                    </TableCellLayout>
                )
            }
        }),
    ];


    const columnSizingOptions = {
        displayName: {
            minWidth: 250,
            defaultWidth: 250,
            idealWidth: 250
        },
        description: {
            minWidth: 190,
            defaultWidth: 190
        },
        createdDate: {
            minWidth: 190,
            defaultWidth: 190
        },
        state: {
            minWidth: 90,
            defaultWidth: 90
        },
    };

    return (
        <div>
            <div className="view-job-breadcrumb">
                <Breadcrumb size='large'>
                    <BreadcrumbItem>
                        <BreadcrumbButton size='large' onClick={() => navigate('/jobs')}>Jobs</BreadcrumbButton>
                    </BreadcrumbItem>
                </Breadcrumb>
            </div>
            <Form>
            <Dialog open={showCreateDialog}>
                <DialogTrigger disableButtonEnhancement>
                    <Button appearance="primary" onClick={() => setShowCreateDialog(true)}>Create New Job Posting</Button>
                </DialogTrigger>
                <DialogSurface>
                    {!showCreatingSpinner && (
                    <DialogBody>
                    <DialogTitle>New Job Posting</DialogTitle>
                    <DialogContent className="create-job-content">
                        Create a new job posting in a draft state. You can edit the posting in the next step before you publish it. 
                        <Label>Job title</Label>
                        <Input
                            placeholder="Job title"
                            aria-label="Job title"
                            type="text"
                            name="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            />
                        <Label>Job description</Label>
                        <Input
                            placeholder="Job description"
                            aria-label="Job description"
                            type="text"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            />
                    </DialogContent>
                    <DialogActions>
                        <Button appearance="primary" type="submit" onClick={submitCreateJob}>Create</Button>
                        <DialogTrigger disableButtonEnhancement>
                        <Button appearance="secondary" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                        </DialogTrigger>
                    </DialogActions>
                    </DialogBody>
                    )}
                    {showCreatingSpinner && (<>
                        <Spinner />
                        <p>Creating job...</p>
                    </>)}
                </DialogSurface>
                </Dialog>
            </Form>
            <h2>Recent</h2>
            <DataGrid
                items={jobs}
                columns={columns}
                getRowId={(item) => item.id}
                resizableColumns
                selectionMode="single"
                columnSizingOptions={columnSizingOptions}
                //selectedItems={selectedItems}
                //onSelectionChange={onSelectionChange}
            >
            <DataGridHeader>
                <DataGridRow
                    selectionCell={{checkboxIndicator: { "aria-label": "Select row" }}}
                >
                    {({ renderHeaderCell }) => (
                        <DataGridHeaderCell><b>{renderHeaderCell()}</b></DataGridHeaderCell>
                    )}
                </DataGridRow>
            </DataGridHeader>
            <DataGridBody<Job>>
                {({ item, rowId }) => (
                    <DataGridRow<Job> 
                        key={rowId}
                        selectionCell={{checkboxIndicator: { "aria-label": "Select row" }}}
                    >
                        {({ renderCell, columnId }) => (
                            <DataGridCell>
                                {renderCell(item)}
                            </DataGridCell>
                        )}
                    </DataGridRow>
                )}
            </DataGridBody>
        </DataGrid>
        </div>
    );
}