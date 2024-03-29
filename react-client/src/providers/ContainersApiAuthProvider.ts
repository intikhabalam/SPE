
import * as Msal from '@azure/msal-browser';
import * as Constants from '../common/Constants';
import * as Scopes from '../common/Scopes';

export class ContainersApiAuthProvider {

    public client: Msal.PublicClientApplication;
    
    public constructor() {
        const msalConfig: Msal.Configuration = {
            auth: {
                clientId: Constants.AZURE_CLIENT_ID!,
                authority: Constants.AUTH_AUTHORITY,
            },
            cache: {
                cacheLocation: 'localStorage',
                storeAuthStateInCookie: false
            }
        };
        this.client = new Msal.PublicClientApplication(msalConfig);
    }

    private get redirectUri(): string {
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        let port = `:${window.location.port}`;
        if (port === '80' || port === '443') {
            port = '';
        }
        return `${protocol}//${hostname}${port}`;
    }

    public async getToken(scopes: string[] = [Scopes.SAMPLE_API_CONTAINER_MANAGE]): Promise<string> {
        await this.client.initialize();
        const tokenRequest: Msal.SilentRequest = {
            scopes: scopes,
            prompt: 'select_account',
            redirectUri: this.redirectUri
        };
        try {
            return (await this.client.acquireTokenSilent(tokenRequest)).accessToken;
        } catch (error) {
            if (error instanceof Msal.InteractionRequiredAuthError) {
                return (await this.client.acquireTokenPopup(tokenRequest)).accessToken;
            } else {
                throw error;
            }
        }
    }
}
