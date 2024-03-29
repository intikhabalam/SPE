import { OnBehalfOfRequest } from "@azure/msal-node";
import { AuthProvider } from "./AuthProvider";
import { MissingAccessTokenError } from "../common/Errors";

export class OboAuthProvider extends AuthProvider {
    public constructor(public userToken: string, scopes: string[] = ['FileStorageContainer.Selected']) {
        super(scopes);
    }
    public async getToken(): Promise<string> {
        const request: OnBehalfOfRequest = {
            oboAssertion: this.userToken,
            scopes: this.scopes
        };
        const result = await this.client.acquireTokenOnBehalfOf(request);
        return result!.accessToken;
    }
    public static fromAuthorizationHeader(auth: string | null): OboAuthProvider {
        if (!auth) {
            throw new MissingAccessTokenError();
        }
        const [bearer, token] = auth.split(' ');
        if (!token) {
            throw new MissingAccessTokenError();
        }
        return new OboAuthProvider(token);
    }
}
