import { app, HttpFunctionOptions, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { OboAuthProvider } from "../providers/OboAuthProvider";
import { GraphProvider } from "../providers/GraphProvider";
import { IContainerClientCreateRequest, IContainerUpdateRequest } from "../../../common/schemas/ContainerSchemas";
import { ApiError, MissingContainerDisplayNameError } from "../common/Errors";
import { AppAuthProvider } from "../providers/AppAuthProvider";

export async function containers(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return request.method === 'POST' ? createContainer(request, context) : listContainers(request, context);
}

export async function listContainers(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const graph = new GraphProvider(new AppAuthProvider());
        const containers = await graph.listContainers();
        return { jsonBody: containers };
    } catch (error) {
        if (error instanceof ApiError) {
            return { status: error.status, body: error.message };
        }
        return { status: 500, body: `List containers failed: ${error}` };
    }
}

export async function createContainer(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const authProvider = OboAuthProvider.fromAuthorizationHeader(request.headers.get('Authorization'));
        const clientCreateRequest: IContainerClientCreateRequest = await request.json() as IContainerClientCreateRequest;
        if (!clientCreateRequest.displayName) {
            throw new MissingContainerDisplayNameError();
        }
        const graph = new GraphProvider(authProvider);
        return { jsonBody: await graph.createContainer(clientCreateRequest) };
    } catch (error) {
        if (error instanceof ApiError) {
            return { status: error.status, body: error.message };
        }
        return { status: 500, body: `Create container failed: ${error}` };
    }
};

export async function container(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return request.method === 'PATCH' ? updateContainer(request, context) : getContainer(request, context);
}

export async function updateContainer(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const authProvider = OboAuthProvider.fromAuthorizationHeader(request.headers.get('Authorization'));
        const id = request.params.id;
        const updateRequest: IContainerUpdateRequest = await request.json() as IContainerUpdateRequest;
        const graph = new GraphProvider(authProvider);
        return { jsonBody: await graph.updateContainer(id, updateRequest) };
    } catch (error) {
        if (error instanceof ApiError) {
            return { status: error.status, body: error.message };
        }
        return { status: 500, body: `Update container failed: ${error}` };
    }
}

export async function getContainer(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const authProvider = OboAuthProvider.fromAuthorizationHeader(request.headers.get('Authorization'));
        const id = request.params.id;
        const graph = new GraphProvider(authProvider);
        return { jsonBody: await graph.getContainer(id) };
    } catch (error) {
        if (error instanceof ApiError) {
            return { status: error.status, body: error.message };
        }
        return { status: 500, body: `Get container failed: ${error}` };
    }
};

app.http('containers', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: containers
});

app.http('container', {
    handler: container,
    trigger: {
        type: 'httpTrigger',
        name: 'container',
        authLevel: 'anonymous',
        methods: ['GET', 'PATCH'],
        route: 'containers/{id}'
    }
});
