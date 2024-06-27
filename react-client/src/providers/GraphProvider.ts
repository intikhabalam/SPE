import { IGraph, Providers } from "@microsoft/mgt-element";
import { DriveItem } from "@microsoft/microsoft-graph-types";
import { DriveItemArrayConstructor, IDriveItem } from "../common/FileSchemas";
import * as Graph from "@microsoft/microsoft-graph-client";
import { GraphAuthProvider } from "./GraphAuthProvider";

export class GraphProvider {
  public static readonly instance: GraphProvider = new GraphProvider();
  private _authProvider: GraphAuthProvider = GraphAuthProvider.instance;
  private _client: Graph.Client;
  private get _providerClient(): IGraph | undefined {
    return Providers.globalProvider?.graph;
  }

  private constructor() {
    this._client = Graph.Client.init({
      authProvider: (done) => {
        this._authProvider
          .getToken()
          .then((token) => done(null, token))
          .catch((err) => done(err, null));
      },
    });
  }

  public async listItems(
    driveId: string,
    parentId: string = "root"
  ): Promise<IDriveItem[]> {
    const endpoint = `/drives/${driveId}/items/${parentId}/children`;
    const query = {
      $expand: "listitem($expand=fields)",
      $select:
        "id,name,createdDateTime,lastModifiedBy,lastModifiedDateTime,size,folder,file,root,parentReference,webUrl,webDavUrl",
    };
    const response = await this._providerClient
      ?.api(endpoint)
      .query(query)
      .get();
    this.publishApiEvent(endpoint, JSON.stringify(response));
    const items: DriveItem[] = response.value as DriveItem[];
    return DriveItemArrayConstructor.from(items);
  }

  public async uploadFile(
    driveId: string,
    file: File,
    parentId: string = "root"
  ): Promise<IDriveItem> {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    return new Promise<IDriveItem>((resolve, reject) => {
      fileReader.addEventListener("loadend", async (event: any) => {
        const endpoint = `/drives/${driveId}/items/${parentId}:/${file.name}:/content`;
        this._providerClient
          ?.api(endpoint)
          .putStream(fileReader.result)
          .then(async (response) => {
            resolve(response as IDriveItem);
          })
          .catch((error) => {
            reject(
              new Error(`Failed to upload file ${file.name}: ${error.message}`)
            );
          });
      });
      fileReader.addEventListener("error", (event: any) => {
        reject(new Error(`Error on reading file: ${event.message}`));
      });
    });
  }

  public async getPreviewUrl(driveId: string, itemId: string): Promise<URL> {
    const endpoint = `/drives/${driveId}/items/${itemId}/preview`;
    const response = await this._providerClient?.api(endpoint).post({});
    this.publishApiEvent(endpoint, JSON.stringify(response));
    const url = new URL(response.getUrl);
    url.searchParams.set("nb", "true");
    return url;
  }

  public async getSpUrl(): Promise<string | null> {
    const endpoint = `/sites/root`;
    const response = await this._providerClient?.api(endpoint).get();
    this.publishApiEvent(endpoint, JSON.stringify(response));
    if (response && response.webUrl) {
      return response.webUrl;
    }
    return null;
  }

  private publishApiEvent(endpoint: string, response: string): void {
    document.dispatchEvent(
      new CustomEvent("publishApiEvent", {
        bubbles: true,
        detail: { endpoint, response },
      })
    );
  }
}
