import { Form, Link, useActionData, useLoaderData, useNavigate, useSubmit } from "react-router-dom";
import { ILoaderParams } from "../common/ILoaderParams";
import { JobsApiProvider } from "../providers/JobsApiProvider";
import { IJob, IJobClientCreateRequest } from "../../../common/schemas/JobSchemas";
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Input, Label } from "@fluentui/react-components";
import { useRef, useState } from "react";


export async function loader({ params }: ILoaderParams): Promise<IJob[]> {
    return await JobsApiProvider.instance.list();
}

export async function action({ params, request }: ILoaderParams) {
    const formData = await request.formData();
    const job = Object.fromEntries(formData) as IJobClientCreateRequest;
    return await JobsApiProvider.instance.create(job);
  }

export const Jobs: React.FunctionComponent = () => {
    const [displayName, setDisplayName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const navigate = useNavigate();
    const jobs = useLoaderData() as IJob[];
    const job = useActionData() as IJob | undefined;
    if (job) {
        navigate(`/jobs/${job.id}`);
    }
    const submit = useSubmit();
    
    const submitCreateJob = async () => {
        const formData = new FormData();
        formData.append("displayName", displayName);
        formData.append("description", description);
        submit(formData, { method: "POST" });
        setDisplayName("");
        setDescription("");
    }

    return (
        <div>
            <Form>
            <Dialog>
                <DialogTrigger disableButtonEnhancement>
                    <Button appearance="primary">Create New Job Posting</Button>
                </DialogTrigger>
                <DialogSurface>
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
                        <Button appearance="secondary">Cancel</Button>
                        </DialogTrigger>
                    </DialogActions>
                    </DialogBody>
                </DialogSurface>
                </Dialog>
            </Form>
            <h1>Recent Jobs</h1>
            <ul>
                {jobs.map((job: IJob) => (
                    <li key={job.id}>
                        <Link to={job.id} >{ job.displayName }</Link>
                    </li>
                ))}
            </ul>
            <h1>New Job</h1>
            <Form method="POST">
                <Label>Job title</Label>
                <input
                    placeholder="Job title"
                    aria-label="Job title"
                    type="text"
                    name="displayName"
                />
                <Button appearance="primary" type="submit">
                    Create
                </Button>
            </Form>
        </div>
    );
}