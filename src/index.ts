import { ServiceSchema, ServiceSettingSchema, Service } from "moleculer";
import * as Netsparker from "netsparker-cloud";
import {
  AccountLicenseApiModel,
  ConfigurationParameters,
} from "netsparker-cloud";

// imported separately to make updates to APIDictionary easier
import {
  AccountApi,
  AgentGroupsApi,
  AgentsApi,
  AuditLogsApi,
  AuthenticationProfilesApi,
  DiscoveryApi,
  IssuesApi,
  MembersApi,
  NotificationsApi,
  RolesApi,
  ScanPoliciesApi,
  ScanProfilesApi,
  ScansApi,
  TeamApi,
  TechnologiesApi,
  VulnerabilityApi,
  WebsiteGroupsApi,
  WebsitesApi,
} from "netsparker-cloud";

// re-export API client to expose all model types
export * from "netsparker-cloud";

type APIDictionary = {
  AccountApi: typeof AccountApi;
  AgentGroupsApi: typeof AgentGroupsApi;
  AgentsApi: typeof AgentsApi;
  AuditLogsApi: typeof AuditLogsApi;
  AuthenticationProfilesApi: typeof AuthenticationProfilesApi;
  DiscoveryApi: typeof DiscoveryApi;
  IssuesApi: typeof IssuesApi;
  MembersApi: typeof MembersApi;
  NotificationsApi: typeof NotificationsApi;
  RolesApi: typeof RolesApi;
  ScanPoliciesApi: typeof ScanPoliciesApi;
  ScanProfilesApi: typeof ScanProfilesApi;
  ScansApi: typeof ScansApi;
  TeamApi: typeof TeamApi;
  TechnologiesApi: typeof TechnologiesApi;
  VulnerabilityApi: typeof VulnerabilityApi;
  WebsiteGroupsApi: typeof WebsiteGroupsApi;
  WebsitesApi: typeof WebsitesApi;
};

type NetsparkerAPINames = keyof APIDictionary;

const APIS: (
  | typeof AccountApi
  | typeof AgentGroupsApi
  | typeof AgentsApi
  | typeof AuditLogsApi
  | typeof AuthenticationProfilesApi
  | typeof DiscoveryApi
  | typeof IssuesApi
  | typeof MembersApi
  | typeof NotificationsApi
  | typeof RolesApi
  | typeof ScanPoliciesApi
  | typeof ScanProfilesApi
  | typeof ScansApi
  | typeof TeamApi
  | typeof TechnologiesApi
  | typeof VulnerabilityApi
  | typeof WebsiteGroupsApi
  | typeof WebsitesApi
)[] = [
  AccountApi,
  AgentGroupsApi,
  AgentsApi,
  AuditLogsApi,
  AuthenticationProfilesApi,
  DiscoveryApi,
  IssuesApi,
  MembersApi,
  NotificationsApi,
  RolesApi,
  ScanPoliciesApi,
  ScanProfilesApi,
  ScansApi,
  TeamApi,
  TechnologiesApi,
  VulnerabilityApi,
  WebsiteGroupsApi,
  WebsitesApi,
];

export type NetsparkerAdapter = {
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

export const DefaultNetsparkerAdapterSettings: INetsparkerAdapterMixinSettings =
  {
    netsparkerBasePath: undefined,
    netsparkerUserId: undefined,
    netsparkerToken: undefined,
    accountInfoOnStart: true,
  };

export interface INetsparkerAdapterMixin
  extends Service<INetsparkerAdapterMixinSettings> {
  netsparkerAdapter: NetsparkerAdapter;
  netsparkerSDK: typeof Netsparker;
}

export const NetsparkerAdapterMixin: ServiceSchema<INetsparkerAdapterMixinSettings> =
  {
    name: "Netsparker",

    settings: DefaultNetsparkerAdapterSettings,

    metadata: {
      netsparker: true,
    },

    actions: {},

    methods: {},

    created(this: INetsparkerAdapterMixin) {
      this.netsparkerAdapter = {} as NetsparkerAdapter;
      this.netsparkerSDK = Netsparker;
      if (!this.settings.netsparkerUserId) {
        throw new Error("a value for netsparkerUserId was not provided!");
      }
      if (!this.settings.netsparkerToken) {
        throw new Error("a value for netsparkerToken was not provided!");
      }
      this.logger.info("Netsparker adapter: basic HTTP auth configured");
      APIS.map((netsparkerAPI) => {
        const APIName = netsparkerAPI.name as NetsparkerAPINames;
        const APIConfig: ConfigurationParameters = {
          basePath: this.settings.netsparkerBasePath,
          username: this.settings.netsparkerUserId,
          password: this.settings.netsparkerToken,
          credentials: "include",
        };
        // @ts-ignore
        this.netsparkerAdapter[APIName] = new netsparkerAPI(APIConfig);
      });
      this.logger.info("Netsparker adapter: enabled");
    },

    async started(this: INetsparkerAdapterMixin) {
      if (this.settings.accountInfoOnStart) {
        const acccountDetails: AccountLicenseApiModel =
          await this.netsparkerAdapter.AccountApi.accountLicense();
        this.logger.info("Netsparker account info:", acccountDetails);
      }
    },
  };
