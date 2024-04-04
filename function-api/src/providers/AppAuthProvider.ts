
import { InvalidAccessTokenError, MissingAccessTokenError } from "../common/Errors";
import { AuthProvider } from "./AuthProvider";
import { JwtProvider } from "./JwtProvider";

export class AppAuthProvider extends AuthProvider {
    public constructor(tid: string, host: string = 'https://graph.microsoft.com') {
        if (host.charAt(host.length - 1) !== '/') {
            host += '/';
        }
        host += '.default';
        super(tid, [host]);
    }

    public async getToken(): Promise<string> {
        const result = await this.client.acquireTokenByClientCredential({
            scopes: this.scopes
        });
        return result!.accessToken;
    }
}