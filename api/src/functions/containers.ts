import { app, HttpFunctionOptions, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { OboAuthProvider } from "../providers/OboAuthProvider";
import { GraphProvider } from "../providers/GraphProvider";
import { IContainerClientCreateRequest, IContainerUpdateRequest } from "../../../common/schemas/ContainerSchemas";
import { ApiError, InvalidAccessTokenError, MissingContainerDisplayNameError } from "../common/Errors";
import { AppAuthProvider } from "../providers/AppAuthProvider";
import { JwtProvider } from "../providers/JwtProvider";

export async function containers(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return request.method === 'POST' ? createContainer(request, context) : listContainers(request, context);
}

export async function listContainers(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const jwt = JwtProvider.fromAuthHeader(request.headers.get('Authorization'));
        if (!jwt || !await jwt.authorize() || !jwt.tid) {
            throw new InvalidAccessTokenError();
        }
        const authProvider = new AppAuthProvider(jwt.tid);
        // const token = await authProvider.getToken();
        // console.log(token);
        const graph = new GraphProvider(authProvider);
        const containers = await graph.listContainers();
        return { jsonBody: containers };
    } catch (error) {
        if (error instanceof ApiError) {
            return { status: error.status, body: error.message };
        }
        throw error; 
        return { status: 500, body: `List containers failed: ${error}` };
    }
}

export async function createContainer(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
        return { status: 500, body: `Create container failed: ${error}` };
    }
};

export async function container(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return request.method === 'PATCH' ? updateContainer(request, context) : getContainer(request, context);
}

export async function updateContainer(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
        return { status: 500, body: `Update container failed: ${error}` };
    }
}

export async function getContainer(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const jwt = JwtProvider.fromAuthHeader(request.headers.get('Authorization'));
        if (!jwt || !await jwt.authorize() || !jwt.tid) {
            throw new InvalidAccessTokenError();
        }
        const graph = new GraphProvider(new OboAuthProvider(jwt));
        const id = request.params.id;
        return { jsonBody: await graph.getContainer(id) };
    } catch (error) {
        if (error instanceof ApiError) {
            return { status: error.status, body: error.message };
        }
        return { status: 500, body: `Get container failed: ${error}` };
    }
};

export async function validate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const jwt = JwtProvider.fromAuthHeader(request.headers.get('Authorization'));
        const userToken = {
            token: jwt!.token,
            decoded: jwt!.decoded,
            tid: jwt!.tid,
            valid: await jwt!.verify(),
            authorized: await jwt!.authorize()
        }
        const appTokenString = await new AppAuthProvider(jwt!.tid!).getToken();
        const appJwt = new JwtProvider(appTokenString);
        const appToken = {
            token: appJwt!.token,
            decoded: appJwt!.decoded,
            tid: appJwt!.tid,
            valid: await appJwt!.verify(),
            authorized: await appJwt!.authorize()       
        }
        const response = {
            userToken: userToken,
            appToken: appToken
        }
        return { jsonBody: response };
    } catch (error) {
        if (error instanceof ApiError) {
            return { status: error.status, body: error.message };
        }
        return { status: 500, body: `Get container failed: ${error}` };
    }
};


app.http('validate', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: validate
});

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
