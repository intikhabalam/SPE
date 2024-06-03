
import * as Constants from './Constants';

// microsoft graph scopes
export const GRAPH_USER_READ = 'User.Read';
export const GRAPH_USER_READ_ALL = 'User.Read.All';
export const GRAPH_FILES_READ_WRITE_ALL = 'Files.ReadWrite.All';
export const GRAPH_SITES_READ_ALL = 'Sites.Read.All';
export const GRAPH_PRESENCE_READ_ALL = 'Presence.Read.All';
export const GRAPH_OPENID_CONNECT_BASIC = ["openid", "profile", "offline_access"];
export const GRAPH_FILESTORAGECONTAINER_SELECTED= 'FileStorageContainer.Selected';

// microsoft graph scopes array
export const GRAPH_SCOPES = [
    GRAPH_USER_READ,
    GRAPH_USER_READ_ALL,
    GRAPH_FILES_READ_WRITE_ALL,
    GRAPH_SITES_READ_ALL,
    GRAPH_PRESENCE_READ_ALL,
    GRAPH_FILESTORAGECONTAINER_SELECTED,
    ...GRAPH_OPENID_CONNECT_BASIC
];

// sample app API scopes
export const SAMPLE_API_CONTAINER_MANAGE = `api://e3c5d971-4f7a-4bb4-b5cd-7bafd998b190/Container.Manage`;

// sample app API scopes array
export const SAMPLE_API_SCOPES = [
    SAMPLE_API_CONTAINER_MANAGE
];

// sharepoint scopes
export const SP_CONTAINER_SELECTED = `${Constants.SP_ROOT_SITE_URL}/Container.Selected`;

// embedded chat scopes
export const CHAT_SCOPES = [
    SP_CONTAINER_SELECTED
];
