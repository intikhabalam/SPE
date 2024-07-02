import {
  IJob,
  IJobClientCreateRequest,
  IJobPostingDoc,
  IJobUpdateRequest,
} from "../../../common/schemas/JobSchemas";
import * as Scopes from "../common/Scopes";
import { Job } from "../model/Job";
import { CustomAppApiAuthProvider } from "./CustomAppApiAuthProvider";

export class JobsApiProvider {
  public readonly apiUrl: string =
    process.env.REACT_APP_SAMPLE_API_URL || "http://localhost:7071/api";
  public readonly apiScope: string = Scopes.SAMPLE_API_CONTAINER_MANAGE;

  public static readonly instance: JobsApiProvider = new JobsApiProvider();
  private _authProvider: { getToken: () => Promise<string> };
  public get authProvider() {
    return this._authProvider;
  }
  public set authProvider(value: { getToken: () => Promise<string> }) {
    this._authProvider = value;
  }

  private constructor() {
    this._authProvider = CustomAppApiAuthProvider.instance;
  }

  public async list(): Promise<Job[]> {
    const request: RequestInit = {
      method: "GET",
      headers: this._headers(await this.authProvider.getToken()),
    };
    const jobsProps = (await this._send("/jobs", request)) as IJob[];
    return jobsProps.map((props) => new Job(props));
  }

  public async get(id: string): Promise<Job> {
    const request: RequestInit = {
      method: "GET",
      headers: this._headers(await this.authProvider.getToken()),
    };
    const jobProps = (await this._send(`/jobs/${id}`, request)) as IJob;
    return new Job(jobProps);
  }

  public async deleteJob(id: string): Promise<void> {
    const request: RequestInit = {
      method: "DELETE",
      headers: this._headers(await this.authProvider.getToken()),
    };
    (await this._send(`/jobs/${id}`, request)) as IJob;
  }

  public async getPostingDoc(jobId: string): Promise<IJobPostingDoc> {
    const request: RequestInit = {
      method: "GET",
      headers: this._headers(await this.authProvider.getToken()),
    };
    return (await this._send(
      `/jobs/${jobId}/posting`,
      request
    )) as IJobPostingDoc;
  }

  public async createPostingDoc(jobId: string): Promise<IJobPostingDoc> {
    const request: RequestInit = {
      method: "POST",
      headers: this._headers(await this.authProvider.getToken()),
    };
    return (await this._send(
      `/jobs/${jobId}/posting/create`,
      request
    )) as IJobPostingDoc;
  }

  public async create(container: IJobClientCreateRequest): Promise<Job> {
    const request: RequestInit = {
      method: "POST",
      headers: this._headers(await this.authProvider.getToken()),
      body: JSON.stringify(container),
    };
    const jobProps = (await this._send("/jobs", request)) as IJob;
    return new Job(jobProps);
  }

  public async enableProcessing(id: string): Promise<IJob> {
    const request: RequestInit = {
      method: "GET",
      headers: this._headers(await this.authProvider.getToken()),
    };
    return (await this._send(
      `/enableContainerProcessing?containerId=${id}`,
      request
    )) as IJob;
  }

  public async disableProcessing(id: string): Promise<IJob> {
    const request: RequestInit = {
      method: "GET",
      headers: this._headers(await this.authProvider.getToken()),
    };
    return (await this._send(
      `/disableContainerProcessing?containerId=${id}`,
      request
    )) as IJob;
  }

  public async update(container: IJob): Promise<Job> {
    const id = container.id;
    if (!id) {
      throw new Error("Container id is required");
    }
    const containerUpdate: IJobUpdateRequest = container as IJobUpdateRequest;
    delete containerUpdate.id;
    const request: RequestInit = {
      method: "PUT",
      headers: this._headers(await this.authProvider.getToken()),
      body: JSON.stringify(containerUpdate),
    };
    const jobProps = (await this._send(`/jobs/${id}`, request)) as IJob;
    return new Job(jobProps);
  }

  /** Private methods for requests **/

  private async _send(endpoint: string, request: RequestInit): Promise<any> {
    const response = await fetch(this._url(endpoint), request);
    if (!response.ok) {
      throw new Error(`Request failed: ${response.statusText}`);
    }
    const data = await response.json();
    this._publishApiEvent(endpoint, JSON.stringify(data));
    return data;
  }

  private _publishApiEvent(endpoint: string, response: string): void {
    document.dispatchEvent(
      new CustomEvent("publishApiEvent", {
        bubbles: true,
        detail: { endpoint, response },
      })
    );
  }

  private _headers(token: string): HeadersInit {
    return {
      Authorization: `Bearer ${token}`,
      "x-token": `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  private _url(endpoint: string): string {
    return `${this.apiUrl}${endpoint}`;
  }
}
