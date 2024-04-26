
export interface IJobClientCreateRequest {
    displayName: string;
    description?: string;
    itemMajorVersionLimit?: number;
    isItemVersioningEnabled?: boolean;
}

export interface IJobServerCreateRequest extends IJobClientCreateRequest {
    JobTypeId?: string;
}

export interface IJobUpdateRequest extends IJobServerCreateRequest {
    id?: string;
}

export interface IJob extends IJobUpdateRequest {
    id: string;
    status?: IJobStatus;
    createdDateTime?: string;
    customProperties?: IJobCustomProperties;
    permissions?: IJobPermissions;
    storageUsedInBytes?: number;
    columns: IJobColumn[];

    postingDoc?: IJobPostingDoc;
}


export interface IJobPostingDoc {
    id: string;
    lastModifiedDateTime: string;
    lastModifiedBy: {
        user?: {
            displayName?: string;
            email?: string;
            id?: string;
        }
    },
    webUrl: string;
    name: string;
}

export interface IJobColumn {
    id?: string;
    name?: string;
    displayName?: string;
    description?: string;
    indexed?: boolean;
    text?: {
        maxLength?: number;
    };
    boolean?: {};
    dateTime?: {
        format?: IJobColumnDateTimeFormat;
    };
    currency?: {
        locale?: string;
    };
    choice?: {
        choices?: string[];
    };
    hyperlinkOrPicture?: {
        isPicture?: boolean;
    };
    number?: {
        maximum?: number;
        minimum?: number;
    };
    personOrGroup?: {
        chooseFromType?: IJobColumnPersonOrGroupType;
    };
}

export type IJobColumnPersonOrGroupType = 'peopleOnly' | 'peopleAndGroups';
export type IJobColumnDateTimeFormat = 'dateOnly' | 'dateTime';
export type IJobStatus = 'active' | 'inactive';

export type IJobCustomProperties = {
    [key: string]: IJobCustomProperty;
}

export type IJobCustomProperty = {
    value: string;
    isSearchable: boolean;
}

export type IJobPermissions = IJobPermission[];

export type IJobPermission = {
    id: string,
    roles: IJobPermissionRole[],
    grantedToV2: {
        user: {
            userPrincipalName: string;
            email: string | null;
            displayName: string | null;
        }
    }
}

export type IJobPermissionRole = 'reader' | 'writer' | 'manager' | 'owner';