import { Form, Outlet, useHref, useLoaderData, useNavigate } from "react-router-dom";
import { IJob, IJobUpdateRequest } from "../../../common/schemas/JobSchemas";
import { ILoaderParams } from "../common/ILoaderParams";
import { JobsApiProvider } from "../providers/JobsApiProvider";
import { Job } from "../model/Job";
import { useEffect, useState } from "react";
import { GraphProvider } from "../providers/GraphProvider";
import { Avatar, Body1, Breadcrumb, BreadcrumbButton, BreadcrumbDivider, BreadcrumbItem, Button, Caption1, Card, CardFooter, CardHeader, CardPreview, Divider, Input, Label, Tab, TabList, Tag, Textarea, Title1, Title2, Toolbar, ToolbarButton, makeStyles, shorthands } from "@fluentui/react-components";
import { Edit20Filled, ArrowSync20Regular, ArrowReplyRegular, ShareRegular, ContentView16Regular, Note16Regular, MegaphoneLoud16Regular, Pen16Regular } from "@fluentui/react-icons";
import { Panel } from "@fluentui/react";

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

const useStyles = makeStyles({
    card: {
      ...shorthands.margin("20px"),
      width: "720px",
      maxWidth: "100%",
    },
  });

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
    const styles = useStyles();
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
            </div>
            <TabList className="view-job-tabs" selectedValue={selectedTab}>
                <Tab value="details" onClick={() => setSelectedTab('details')}>Details</Tab>
                <Tab value="applicants" onClick={() => setSelectedTab('applicants')}>Applicants</Tab>
                <Tab value="settings" onClick={() => setSelectedTab('settings')}>Settings</Tab>
            </TabList>

            {selectedTab === 'details' && (
            <div>
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
                    <Button appearance="secondary" size="large">Edit Details</Button>
                    {!job.isPublished && (<Button appearance="primary" size="large">Publish</Button>)}
                    {job.isPublished && (<Button appearance="secondary" size="large">Unpublish</Button>)}
                    <Button appearance="secondary" size="large" onClick={deleteJob}>Delete</Button>
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

            {selectedTab === 'applicants' && (
            <div>
                <Card className={styles.card}>
                    <CardHeader
                        header={
                            <Body1>
                                <b>Megan Bowen</b> applied about 4 weeks ago
                            </Body1>                            
                        }
                        description={<Caption1>Status: <Tag appearance="brand" size="extra-small">Ready for offer</Tag></Caption1>}
                    >
                    </CardHeader>
                    <CardFooter>
                        <Button appearance="primary" size="small" icon={<MegaphoneLoud16Regular />}>Send Offer</Button>
                        <Button size="small" icon={<Note16Regular />}>View Interview Notes</Button>
                        <Button size="small" icon={<ContentView16Regular />}>View Resume</Button>
                        <Button size="small" icon={<ArrowReplyRegular fontSize={16} />}>Contact</Button>
                    </CardFooter>
                </Card>
                
                <Card className={styles.card}>
                    <CardHeader
                        header={
                            <Body1>
                                <b>Nestor Wilke</b> applied about 4 weeks ago
                            </Body1>                            
                        }
                        description={<Caption1>Status: <Tag appearance="brand" size="extra-small">Interviewed</Tag></Caption1>}
                    >
                    </CardHeader>
                    <CardFooter>
                        <Button size="small" icon={<Pen16Regular />}>Create Offer</Button>
                        <Button size="small" icon={<Note16Regular />}>View Interview Notes</Button>
                        <Button size="small" icon={<ContentView16Regular />}>View Resume</Button>
                        <Button size="small" icon={<ArrowReplyRegular fontSize={16} />}>Contact</Button>
                    </CardFooter>
                </Card>
                
                <Card className={styles.card}>
                    <CardHeader
                        header={
                            <Body1>
                                <b>Lynne Robbins</b> applied about 2 weeks ago
                            </Body1>                            
                        }
                        description={<Caption1>Status: <Tag appearance="brand" size="extra-small">Rejected</Tag></Caption1>}
                    >
                    </CardHeader>
                    <CardFooter>
                        <Button size="small" icon={<ContentView16Regular />}>View Resume</Button>
                        <Button size="small" icon={<ArrowReplyRegular fontSize={16} />}>Contact</Button>
                    </CardFooter>
                </Card>
                
                <Card className={styles.card}>
                    <CardHeader
                        header={
                            <Body1>
                                <b>Lee Gu</b> applied about 5 days ago
                            </Body1>                            
                        }
                        description={<Caption1>Status: <Tag appearance="brand" size="extra-small">Applied</Tag></Caption1>}
                    >
                    </CardHeader>
                    <CardFooter>
                        <Button size="small" icon={<ContentView16Regular />}>View Resume</Button>
                        <Button size="small" icon={<ArrowReplyRegular fontSize={16} />}>Contact</Button>
                    </CardFooter>
                </Card>
            </div>
            )}


        </div>
        )}
        </>
    );
}