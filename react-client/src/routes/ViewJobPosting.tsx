import { Form, useLoaderData } from "react-router-dom";
import { IJob, IJobPostingDoc, IJobUpdateRequest } from "../../../common/schemas/JobSchemas";
import { ILoaderParams } from "../common/ILoaderParams";
import { JobsApiProvider } from "../providers/JobsApiProvider";
import { Job } from "../model/Job";



export async function loader({ params }: ILoaderParams): Promise<IJobPostingDoc | undefined> {
    const jobId = params.jobId;
    return await JobsApiProvider.instance.getPostingDoc(jobId) ||  { foobar: true };
}

export async function action({ params, request }: ILoaderParams) {
    const formData = await request.formData();
    const job = Object.fromEntries(formData) as IJobUpdateRequest;
    return await JobsApiProvider.instance.create(job);
}

export const ViewJobPosting: React.FunctionComponent = () => {
    const postingDoc = useLoaderData() as IJobPostingDoc | undefined;
    console.log('hi from posting');
    return (
        <>
        { !postingDoc && (
        <div>
            <p>No job posting yet -- create one!</p>
            <Form method="post">
                <input type="hidden" name="createPostingDoc" value="true" />
                <button type="submit">Create Posting</button>
            </Form>
        </div>
        )}
        </>
    );
}