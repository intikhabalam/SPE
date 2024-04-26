import { Form, Outlet, useHref, useLoaderData, useNavigate } from "react-router-dom";
import { IJob, IJobUpdateRequest } from "../../../common/schemas/JobSchemas";
import { ILoaderParams } from "../common/ILoaderParams";
import { JobsApiProvider } from "../providers/JobsApiProvider";
import { Job } from "../model/Job";
import { useEffect, useState } from "react";
import { GraphProvider } from "../providers/GraphProvider";
import { Breadcrumb, BreadcrumbButton, BreadcrumbDivider, BreadcrumbItem, Button, Divider, Input, Label, Tab, TabList, Tag, Textarea, Toolbar, ToolbarButton } from "@fluentui/react-components";
import { Edit20Filled, ArrowSync20Regular } from "@fluentui/react-icons";

let job: Job | undefined;

export async function loader({ params }: ILoaderParams): Promise<Job | undefined> {
    const jobId = params.jobId;
    return await JobsApiProvider.instance.get(jobId);
}

export async function action({ params, request }: ILoaderParams) {
    const formData = await request.formData();
    const fields = Object.fromEntries(formData);
    if (job && fields.createPostingDoc) {
        await JobsApiProvider.instance.createPostingDoc(job.id);
        job = await JobsApiProvider.instance.get(job.id);
        window.open(job.postingDoc?.webUrl, '_blank');
    }
    return job;
}

export const ViewJob: React.FunctionComponent = () => {
    job = useLoaderData() as Job | undefined;
    const [selectedTab, setSelectedTab] = useState<string>('details');
    const [postingEditLink, setPostingEditLink] = useState<string | undefined>(undefined);
    const [postingPreviewLink, setPostingPreviewLink] = useState<string | undefined>(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        updatePreviewLink();
    }, [job]);

    const updatePreviewLink = () => {
        if (job && job.postingDoc) {
            setPostingEditLink(job.postingDoc.webUrl);
            GraphProvider.instance.getPreviewUrl(job.id, job.postingDoc.id).then((url: URL) => {
                setPostingPreviewLink(url.href);
            });
        }
    }

    const deleteJob = async () => {
        if (job) {
            await JobsApiProvider.instance.deleteJob(job.id);
            navigate('/jobs');
        }
    }

    return (
        <>
        { job && (
        <div className="view-job">
            <div className="view-job-breadcrumb">
                <Breadcrumb size='large'>
                    <BreadcrumbItem>
                        <BreadcrumbButton size='large' onClick={() => navigate('/jobs')}>Jobs</BreadcrumbButton>
                    </BreadcrumbItem>
                    <BreadcrumbDivider />
                    <BreadcrumbItem>
                        <BreadcrumbButton size='large'>{job.displayName}</BreadcrumbButton>
                        <Tag appearance="brand">{job.state}</Tag>
                    </BreadcrumbItem>
                </Breadcrumb>
                {!job.isPublished && (<Button appearance="primary" size="large">Publish</Button>)}
                {job.isPublished && (<Button appearance="secondary" size="large">Unpublish</Button>)}
                <Button appearance="secondary" size="large" onClick={deleteJob}>Delete</Button>
            </div>
            <TabList className="view-job-tabs" selectedValue={selectedTab}>
                <Tab value="details" onClick={() => setSelectedTab('details')}>Details</Tab>
                <Tab value="applicants" onClick={() => setSelectedTab('applicants')}>Applicants</Tab>
                <Tab value="settings" onClick={() => setSelectedTab('settings')}>Settings</Tab>
            </TabList>
            <Form className="edit-job" action="patch">
                <div className="view-job-form-input">
                    <Label htmlFor="displayName" size="large">Job Title: </Label>
                    <Input className="view-job-displayName" type="text" disabled={true} name="displayName" placeholder="Job Title" defaultValue={job.displayName} />
                </div>
                <div className="view-job-form-input">
                    <Label htmlFor="description" size="large">Description: </Label>
                    <Input className="view-job-description" disabled={true} name="description" placeholder="Description" defaultValue={job.description} />
                </div>
                <div className="view-job-form-input">
                    <Label htmlFor="createdDate" size="large">Created: </Label>
                    <Input className="view-job-createdDate" disabled={true} name="createdDate" placeholder="Created" defaultValue={job.createdDateTime} />
                </div>
                <Button appearance="secondary">Edit</Button>
            </Form>

            <Divider />
            
            <>
            { !job.postingDoc && (
            <div className="create-posting-form">
                <p>No job posting yet -- create one!</p>
                <Form method="post">
                    <input type="hidden" name="createPostingDoc" value="true" />
                    <Button appearance="primary" type="submit">Create Posting</Button>
                </Form>
            </div>
            )}
            { job.postingDoc && (
            <div className="posting-content">
                { postingEditLink && (
                <p>
                    <Toolbar>
                        <ToolbarButton
                        aria-label="Edit job posting"
                        appearance="primary"
                        icon={<Edit20Filled />}
                        onClick={() => window.open(postingEditLink, '_blank')}
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
                { postingPreviewLink && (
                    <iframe title={job.displayName} src={postingPreviewLink} style={{ width: '75%', height: '600px' }}></iframe>
                )}
            </div>
            )}
            </>
        </div>
        )}
        </>
    );
}