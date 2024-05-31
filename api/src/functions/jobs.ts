import { app, HttpFunctionOptions, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { OboAuthProvider } from "../providers/OboAuthProvider";
import { GraphProvider } from "../providers/GraphProvider";
import { IContainerClientCreateRequest, IContainerUpdateRequest } from "../../../common/schemas/ContainerSchemas";
import { ApiError, InvalidAccessTokenError, MissingContainerDisplayNameError } from "../common/Errors";
import { AppAuthProvider } from "../providers/AppAuthProvider";
import { JwtProvider } from "../providers/JwtProvider";

export async function jobs(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return request.method === 'POST' ? create(request, context) : list(request, context);
}

export async function list(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const jwt = JwtProvider.fromAuthHeader(request.headers.get('Authorization'));
        if (!jwt || !await jwt.authorize() || !jwt.tid) {
            throw new InvalidAccessTokenError();
        }
        const authProvider = new AppAuthProvider(jwt.tid);
        const graph = new GraphProvider(authProvider);
        const containers = await graph.listContainers();
        return { jsonBody: containers };
    } catch (error) {
        if (error instanceof ApiError) {
            return { status: error.status, body: error.message };
        }
        return { status: 500, body: `List jobs failed: ${error}` };
    }
}

export async function create(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const jwt = JwtProvider.fromAuthHeader(request.headers.get('Authorization'));
        if (!jwt || !await jwt.authorize() || !jwt.tid) {
            throw new InvalidAccessTokenError();
        }
        const graph = new GraphProvider(new OboAuthProvider(jwt));
        const clientCreateRequest: IContainerClientCreateRequest = await request.json() as IContainerClientCreateRequest;
        if (!clientCreateRequest.displayName) {
            throw new MissingContainerDisplayNameError();
        }
        return { jsonBody: await graph.createContainer(clientCreateRequest) };
    } catch (error) {
        if (error instanceof ApiError) {
            return { status: error.status, body: error.message };
        }
        return { status: 500, body: `Create job failed: ${error}` };
    }
};

export async function job(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    if (request.method === 'PATCH') {
        return update(request, context);
    } else if (request.method === 'DELETE') {
        return deleteJob(request, context);
    } else {
        return get(request, context);
    }
}

export async function update(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const jwt = JwtProvider.fromAuthHeader(request.headers.get('Authorization'));
        if (!jwt || !await jwt.authorize() || !jwt.tid) {
            throw new InvalidAccessTokenError();
        }
        const graph = new GraphProvider(new OboAuthProvider(jwt));
        const id = request.params.id;
        const updateRequest: IContainerUpdateRequest = await request.json() as IContainerUpdateRequest;
        return { jsonBody: await graph.updateContainer(id, updateRequest) };
    } catch (error) {
        if (error instanceof ApiError) {
            return { status: error.status, body: error.message };
        }
        return { status: 500, body: `Update job failed: ${error}` };
    }
}

export async function get(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const jwt = JwtProvider.fromAuthHeader(request.headers.get('Authorization'));
        if (!jwt || !await jwt.authorize() || !jwt.tid) {
            throw new InvalidAccessTokenError();
        }
        const graph = new GraphProvider(new OboAuthProvider(jwt));
        const id = request.params.id;
        const containerProps = await graph.getContainer(id);
        const postingName = getPostingFileName(containerProps.displayName);
        let posting: any;
        try {
            posting = await graph.getDriveItemByPath(id, postingName);
        } catch (e) {
            posting = null;
        }
        const response = {
            ...containerProps,
            postingDoc: posting
        };
        return { jsonBody: response };
    } catch (error) {
        if (error instanceof ApiError) {
            return { status: error.status, body: error.message };
        }
        return { status: 404, body: `Job not found` };
    }
};

export async function deleteJob(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const jwt = JwtProvider.fromAuthHeader(request.headers.get('Authorization'));
        if (!jwt || !await jwt.authorize() || !jwt.tid) {
            throw new InvalidAccessTokenError();
        }
        const graph = new GraphProvider(new OboAuthProvider(jwt));
        const id = request.params.id;
        await graph.deleteContainer(id);
        return { jsonBody: { } };
    } catch (error) {
        if (error instanceof ApiError) {
            return { status: error.status, body: error.message };
        }
        return { status: 404, body: `Job not found` };
    }
};

export async function posting(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const jwt = JwtProvider.fromAuthHeader(request.headers.get('Authorization'));
        if (!jwt || !await jwt.authorize() || !jwt.tid) {
            throw new InvalidAccessTokenError();
        }
        const graph = new GraphProvider(new OboAuthProvider(jwt));
        const id = request.params.id;
        const job = await graph.getContainer(id);
        const postingName = getPostingFileName(job.displayName);
        const posting = await graph.getDriveItemByPath(id, postingName);
        return { jsonBody: posting };
    } catch (error) {
        if (error instanceof ApiError) {
            return { status: error.status, body: error.message };
        }
        return { status: 404, body: `Job not found` };
    }
};

function getPostingFileName(jobName: string): string {
    return `[Job Posting] ${jobName}.docx`;
}

export async function createPosting(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const jwt = JwtProvider.fromAuthHeader(request.headers.get('Authorization'));
        if (!jwt || !await jwt.authorize() || !jwt.tid) {
            throw new InvalidAccessTokenError();
        }
        const graph = new GraphProvider(new OboAuthProvider(jwt));
        const id = request.params.id;
        const job = await graph.getContainer(id);
        const postingName = getPostingFileName(job.displayName);
        const posting = await graph.createDriveItemAtRoot(id, postingName);
        return { jsonBody: posting };
    } catch (error) {
        if (error instanceof ApiError) {
            return { status: error.status, body: error.message };
        }
        console.log(error);
        return { status: 500, body: `Failed to create posting doc: ${error}` };
    }
};


app.http('jobs', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: jobs
});

app.http('job', {
    handler: job,
    trigger: {
        type: 'httpTrigger',
        name: 'job',
        authLevel: 'anonymous',
        methods: ['GET', 'PATCH', 'DELETE'],
        route: 'jobs/{id}'
    }
});

app.http('posting', {
    handler: posting,
    trigger: {
        type: 'httpTrigger',
        name: 'posting',
        authLevel: 'anonymous',
        methods: ['GET'],
        route: 'jobs/{id}/posting'
    }
});

app.http('createPosting', {
    handler: createPosting,
    trigger: {
        type: 'httpTrigger',
        name: 'createPosting',
        authLevel: 'anonymous',
        methods: ['POST'],
        route: 'jobs/{id}/posting/create'
    }
});
