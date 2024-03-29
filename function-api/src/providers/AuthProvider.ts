
import { ConfidentialClientApplication } from '@azure/msal-node';

type AuthHandler = (done: AuthHandlerCallback) => void;
type AuthHandlerCallback = (error: any, accessToken: string | null) => void;

export abstract class AuthProvider {
    protected client: ConfidentialClientApplication;
    public constructor(public scopes: string[] = ['https://graph.microsoft.com/.default']) {
        const authority = `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`;
        this.client = new ConfidentialClientApplication({
            auth: {
                clientId: process.env.AZURE_CLIENT_ID!,
                authority: authority,
                clientSecret: process.env.AZURE_CLIENT_SECRET
            }
        });
    }

    public abstract getToken(): Promise<string>;

    public getAuthHandler(): AuthHandler {
        return (done: AuthHandlerCallback) => {
            this.getToken().then(token => done(null, token)).catch(err => done(err, null));
        };
    }
}
