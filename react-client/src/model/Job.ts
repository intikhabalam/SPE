import { IJob, IJobColumn, IJobCustomProperties, IJobPermissions, IJobPostingDoc, IJobStatus } from "../../../common/schemas/JobSchemas";

export class Job implements IJob {
    public readonly id: string;
    public readonly status?: IJobStatus | undefined;
    public readonly createdDateTime?: string | undefined;
    public readonly customProperties?: IJobCustomProperties | undefined;
    public readonly permissions?: IJobPermissions | undefined;
    public readonly storageUsedInBytes?: number | undefined;
    public readonly columns: IJobColumn[];
    public readonly JobTypeId?: string | undefined;
    public readonly displayName: string;
    public readonly description?: string | undefined;
    public readonly itemMajorVersionLimit?: number | undefined;
    public readonly isItemVersioningEnabled?: boolean | undefined;
    public readonly postingDoc?: IJobPostingDoc | undefined;

    public get state(): IJobState {
        return this.customProperties?.state?.value as IJobState || 'Draft';
    }
    public get isPublished(): boolean {
        return this.state === 'Published';
    }
    public get isUnpublished(): boolean {
        return this.state === 'Unpublished';
    }

    public constructor (props: IJob) {
        this.id = props.id;
        this.status = props.status;
        this.createdDateTime = props.createdDateTime;
        this.customProperties = props.customProperties;
        this.permissions = props.permissions;
        this.storageUsedInBytes = props.storageUsedInBytes;
        this.columns = props.columns;
        this.JobTypeId = props.JobTypeId;
        this.displayName = props.displayName;
        this.description = props.description;
        this.itemMajorVersionLimit = props.itemMajorVersionLimit;
        this.isItemVersioningEnabled = props.isItemVersioningEnabled;
        this.postingDoc = props.postingDoc;
    }
}

export type IJobState = 'Draft' | 'Published' | 'Unpublished';
