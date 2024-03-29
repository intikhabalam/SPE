
import { AuthProvider } from "./AuthProvider";

export class AppAuthProvider extends AuthProvider {
    public constructor(host: string = 'https://graph.microsoft.com') {
        if (host.charAt(host.length - 1) !== '/') {
            host += '/';
        }
        host += '.default';
        super([host]);
    }
    public async getToken(): Promise<string> {
        const result = await this.client.acquireTokenByClientCredential({
            scopes: this.scopes
        });
        return result!.accessToken;
    }
}