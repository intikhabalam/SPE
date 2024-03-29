
import * as Constants from './Constants';

// microsoft graph scopes
export const GRAPH_USER_READ = 'User.Read';
export const GRAPH_USER_READ_ALL = 'User.Read.All';
export const GRAPH_FILES_READ_WRITE_ALL = 'Files.Read.All';
export const GRAPH_SITES_READ_ALL = 'Sites.Read.All';
export const GRAPH_OPENID_CONNECT_BASIC = ["openid", "profile", "offline_access"];
export const GRAPH_FILESTORAGECONTAINER_SELECTED= 'FileStorageContainer.Selected';

// microsoft graph scopes array
export const ALL_GRAPH_SCOPES = [
    GRAPH_USER_READ,
    GRAPH_USER_READ_ALL,
    GRAPH_FILESTORAGECONTAINER_SELECTED,
    ...GRAPH_OPENID_CONNECT_BASIC
];

// sample app API scopes
export const SAMPLE_API_CONTAINER_MANAGE = `api://${Constants.AZURE_CLIENT_ID}/Container.Manage`;

// sample app API scopes array
export const ALL_SAMPLE_API_SCOPES = [
    SAMPLE_API_CONTAINER_MANAGE
];
