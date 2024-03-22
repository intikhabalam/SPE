
// microsoft graph scopes
export const GRAPH_USER_READ = 'User.Read';
export const GRAPH_USER_READ_ALL = 'User.Read.All';
export const GRAPH_FILES_READ_WRITE_ALL = 'Files.Read.All';
export const GRAPH_SITES_READ_ALL = 'Sites.Read.All';
export const GRAPH_OPENID_CONNECT_BASIC = ["openid", "profile", "offline_access"];

// SharePoint Embedded scopes
export const SPEMBEDDED_FILESTORAGECONTAINER_SELECTED= 'FileStorageContainer.Selected';

export const ALL_FRONTEND_SCOPES = [
    GRAPH_USER_READ,
    GRAPH_USER_READ_ALL,
    SPEMBEDDED_FILESTORAGECONTAINER_SELECTED,
    ...GRAPH_OPENID_CONNECT_BASIC
];