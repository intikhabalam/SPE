
import * as Msal from '@azure/msal-browser';
import * as Constants from '../common/Constants';
import * as Scopes from '../common/Scopes';

export class CustomAppApiAuthProvider {

    private _initialized: boolean = false;
    private async initialize(): Promise<void> {
        if (!this._initialized) {
            await this.client.initialize();
            this._initialized = true;
        }
    }
    public client: Msal.PublicClientApplication;
    
    public constructor() {
        const msalConfig: Msal.Configuration = {
            auth: {
                clientId: Constants.AZURE_CLIENT_ID!,
                authority: Constants.AUTH_AUTHORITY,
            },
            cache: {
                cacheLocation: 'sessionStorage',
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
        await this.initialize();

        const tokenRequest: Msal.SilentRequest = {
            scopes: scopes,
            prompt: 'select_account',
            redirectUri: this.redirectUri,
        };
        let account = this.client.getActiveAccount();
        try {
            if (account) {
                tokenRequest.account = account;
                const result = await this.client.acquireTokenSilent(tokenRequest);
                this.client.setActiveAccount(result.account);
                return result.accessToken;
            }
            throw new Msal.InteractionRequiredAuthError();
        } catch (error) {
            if (error instanceof Msal.InteractionRequiredAuthError) {
                //await this.client.acquireTokenRedirect(tokenRequest);
                //return '';
                const result = await this.client.acquireTokenPopup(tokenRequest);
                this.client.setActiveAccount(result.account);
                return result.accessToken;
            } else {
                throw error;
            }
        }
    }
}
