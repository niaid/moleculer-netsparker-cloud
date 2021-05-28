import { ServiceSchema, ServiceSettingSchema, Service } from "moleculer";
import * as Netsparker from 'netsparker-cloud';
import { AccountApi, AgentGroupsApi, AgentsApi, APIS, AuditLogsApi, Authentication, AuthenticationProfilesApi, DiscoveryApi, HttpBasicAuth, IssuesApi, NotificationsApi, ScanPoliciesApi, ScanProfilesApi, ScansApi, TeamMembersApi, TechnologiesApi, VulnerabilityApi, WebsiteGroupsApi, WebsitesApi } from "netsparker-cloud";

export type NetsparkerAPIClient = {
  setDefaultAuthentication(authStrategy: Authentication): void;
}

type APIDictionary = {
  AccountApi: typeof AccountApi,
  AgentGroupsApi: typeof AgentGroupsApi,
  AgentsApi: typeof AgentsApi,
  AuditLogsApi: typeof AuditLogsApi,
  AuthenticationProfilesApi: typeof AuthenticationProfilesApi,
  DiscoveryApi: typeof DiscoveryApi,
  IssuesApi: typeof IssuesApi,
  NotificationsApi: typeof NotificationsApi,
  ScanPoliciesApi: typeof ScanPoliciesApi,
  ScanProfilesApi: typeof ScanProfilesApi,
  ScansApi: typeof ScansApi,
  TeamMembersApi: typeof TeamMembersApi,
  TechnologiesApi: typeof TechnologiesApi,
  VulnerabilityApi: typeof VulnerabilityApi,
  WebsiteGroupsApi: typeof WebsiteGroupsApi,
  WebsitesApi: typeof WebsitesApi,
}

type NetsparkerAPINames = keyof APIDictionary;

export type NetsparkerAdapter = {
  [API in NetsparkerAPINames]: InstanceType<APIDictionary[API]>;
}

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

export const DefaultNetsparkerAdapterSettings: INetsparkerAdapterMixinSettings = {
  netsparkerBasePath: undefined,
  netsparkerUserId: undefined,
  netsparkerToken: undefined,
  accountInfoOnStart: true,
};

export interface INetsparkerAdapterMixin extends Service<INetsparkerAdapterMixinSettings> {
  netsparkerAdapater: NetsparkerAdapter;
  netsparkerAuth: HttpBasicAuth;
  netsparkerSDK: typeof Netsparker;
}

export const NetsparkerAdapterMixin: ServiceSchema<INetsparkerAdapterMixinSettings> = {

  name: 'Netsparker',

  settings: DefaultNetsparkerAdapterSettings,

  metadata: {
    netsparker: true,
  },

  actions: {},

  methods: {},

  created(this: INetsparkerAdapterMixin) {
    this.netsparkerAdapater = {} as NetsparkerAdapter;
    this.netsparkerAuth = new HttpBasicAuth();
    this.netsparkerSDK = Netsparker;
    if (!this.settings.netsparkerUserId) {
      throw new Error('a value for netsparkerUserId was not provided!')
    }
    if (!this.settings.netsparkerToken) {
      throw new Error('a value for netsparkerToken was not provided!')
    }
    this.netsparkerAuth.username = this.settings.netsparkerUserId;
    this.netsparkerAuth.password = this.settings.netsparkerToken;
    this.logger.info('Netsparker adapater: basic HTTP auth configured');
    APIS.map(netsparkerAPI => {
      const APIName = netsparkerAPI.name as NetsparkerAPINames;
      // @ts-ignore
      this.netsparkerAdapater[APIName] = new netsparkerAPI(this.settings.netsparkerBasePath);
      this.netsparkerAdapater[APIName].setDefaultAuthentication(this.netsparkerAuth);
    });
    this.logger.info('Netsparker adapater: enabled');
  },

  async started(this: INetsparkerAdapterMixin) {
    const { body: acccountDetails } = await this.netsparkerAdapater.AccountApi.accountLicense();
    this.logger.info(acccountDetails);
  }

};
