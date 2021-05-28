import { ServiceSchema, ServiceSettingSchema, Service } from "moleculer";
import * as Netsparker from 'netsparker-cloud';
import { AccountApi, AgentGroupsApi, AgentsApi, AuditLogsApi, Authentication, AuthenticationProfilesApi, DiscoveryApi, HttpBasicAuth, IssuesApi, NotificationsApi, ScanPoliciesApi, ScanProfilesApi, ScansApi, TeamMembersApi, TechnologiesApi, VulnerabilityApi, WebsiteGroupsApi, WebsitesApi } from "netsparker-cloud";
export declare type NetsparkerAPIClient = {
    setDefaultAuthentication(authStrategy: Authentication): void;
};
declare type APIDictionary = {
    AccountApi: typeof AccountApi;
    AgentGroupsApi: typeof AgentGroupsApi;
    AgentsApi: typeof AgentsApi;
    AuditLogsApi: typeof AuditLogsApi;
    AuthenticationProfilesApi: typeof AuthenticationProfilesApi;
    DiscoveryApi: typeof DiscoveryApi;
    IssuesApi: typeof IssuesApi;
    NotificationsApi: typeof NotificationsApi;
    ScanPoliciesApi: typeof ScanPoliciesApi;
    ScanProfilesApi: typeof ScanProfilesApi;
    ScansApi: typeof ScansApi;
    TeamMembersApi: typeof TeamMembersApi;
    TechnologiesApi: typeof TechnologiesApi;
    VulnerabilityApi: typeof VulnerabilityApi;
    WebsiteGroupsApi: typeof WebsiteGroupsApi;
    WebsitesApi: typeof WebsitesApi;
};
declare type NetsparkerAPINames = keyof APIDictionary;
export declare type NetsparkerAdapter = {
    [API in NetsparkerAPINames]: InstanceType<APIDictionary[API]>;
};
export interface INetsparkerAdapterMixinSettings extends ServiceSettingSchema {
    /**
     * Optional base path override.
     * Defaults to https://www.netsparkercloud.com
     */
    netsparkerBasePath?: string;
    /**
     * Required netsparker user ID associated to the API Key (token) provdied on
     * `netsparkerToken`.
     */
    netsparkerUserId?: string;
    /**
     * Required netsparker API Key (token) associated to the user identified by
     * `netsparkerUserId`.
     */
    netsparkerToken?: string;
    /**
     * Optionally query and log Netsparker Cloud account information when started.
     */
    accountInfoOnStart?: boolean;
}
export declare const DefaultNetsparkerAdapterSettings: INetsparkerAdapterMixinSettings;
export interface INetsparkerAdapterMixin extends Service<INetsparkerAdapterMixinSettings> {
    netsparkerAdapater: NetsparkerAdapter;
    netsparkerAuth: HttpBasicAuth;
    netsparkerSDK: typeof Netsparker;
}
export declare const NetsparkerAdapterMixin: ServiceSchema<INetsparkerAdapterMixinSettings>;
export {};
