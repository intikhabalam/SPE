
import { ConfidentialClientApplication } from '@azure/msal-node';
import { JwtProvider } from './JwtProvider';
import { InvalidAccessTokenError, MissingAccessTokenError } from '../common/Errors';

type AuthHandler = (done: AuthHandlerCallback) => void;
type AuthHandlerCallback = (error: any, accessToken: string | null) => void;

export abstract class AuthProvider {
    protected client: ConfidentialClientApplication;
    public constructor(private readonly _tid: string, public readonly scopes: string[] = ['https://graph.microsoft.com/.default']) {
        const authority = `https://login.microsoftonline.com/${_tid}`;
        console.log(`Authority: ${authority}`);
        console.log(`Client ID: ${process.env.AZURE_CLIENT_ID}`);
        console.log(`Client Secret: ${process.env.AZURE_CLIENT_SECRET}`);
        this.client = new ConfidentialClientApplication({
            auth: {
                clientId: process.env.AZURE_CLIENT_ID!,
                authority: authority,
                clientSecret: process.env.AZURE_CLIENT_SECRET
            }
        });
    }

    public static async verifyAuthHeader(auth: string | null): Promise<boolean> {
        if (!auth) {
            throw new MissingAccessTokenError();
        }
        const [bearer, token] = auth.split(' ');
        if (!token) {
            throw new MissingAccessTokenError();
        }
        const jwt = new JwtProvider(token);
        if (!await jwt.verify()) {
            throw new InvalidAccessTokenError();
        }
        return true;
    }

    public static getTokenFromAuthorizationHeader(auth: string | null): string | null {
        if (!auth) {
            return null;
        }
        const [bearer, token] = auth.split(' ');
        if (!token) {
            return null;
        }
        return token;
    }

    public abstract getToken(): Promise<string>;

    public getAuthHandler(): AuthHandler {
        return (done: AuthHandlerCallback) => {
            this.getToken().then(token => done(null, token)).catch(err => done(err, null));
        };
    }
}
