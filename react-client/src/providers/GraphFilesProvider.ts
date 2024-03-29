
import { IGraph, Providers } from "@microsoft/mgt-element";
import { DriveItem } from "@microsoft/microsoft-graph-types";
import { DriveItemArrayConstructor, IDriveItem } from "../common/FileSchemas";

export class GraphFilesProvider {
    public static readonly instance: GraphFilesProvider = new GraphFilesProvider();
    public get _client(): IGraph['client'] | undefined {
        return Providers.globalProvider?.graph?.client;
    }
    private constructor() { }

    public async listItems(driveId: string, parentId: string = 'root'): Promise<IDriveItem[]> {
        const endpoint = `/drives/${driveId}/items/${parentId}/children`;
        const query = {
            $expand: 'listitem($expand=fields)',
            $select: 'id,name,createdDateTime,lastModifiedBy,lastModifiedDateTime,size,folder,file,root,parentReference,webUrl,webDavUrl'
        };
        const response = await this._client?.api(endpoint).query(query).get();
        const items: DriveItem[] = response.value as DriveItem[];
        return DriveItemArrayConstructor.from(items);
    }

    public async uploadFile(driveId: string, file: File, parentId: string = 'root'): Promise<IDriveItem> {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        return new Promise<IDriveItem>((resolve, reject) => {
            fileReader.addEventListener('loadend', async (event: any) => {
                const endpoint = `/drives/${driveId}/items/${parentId}:/${file.name}:/content`;
                this._client?.api(endpoint).putStream(fileReader.result)
                    .then(async (response) => {
                        resolve(response as IDriveItem);
                    })
                    .catch((error) => {
                        reject(new Error(`Failed to upload file ${file.name}: ${error.message}`));
                    });
            });
            fileReader.addEventListener('error', (event: any) => {
                reject(new Error(`Error on reading file: ${event.message}`));
            });
        });
    }

    public async getPreviewUrl(driveId: string, itemId: string): Promise<URL> {
        const endpoint = `/drives/${driveId}/items/${itemId}/preview`;
        const response = await this._client?.api(endpoint).post({});
        const url = new URL(response.getUrl);
        url.searchParams.set('nb', 'true');
        return url;
    }
}