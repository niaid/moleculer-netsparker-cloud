"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetsparkerAdapterMixin = exports.DefaultNetsparkerAdapterSettings = void 0;
const Netsparker = __importStar(require("netsparker-cloud"));
// imported separately to make updates to APIDictionary easier
const netsparker_cloud_1 = require("netsparker-cloud");
// re-export API client to expose all model types
__exportStar(require("netsparker-cloud"), exports);
const APIS = [
    netsparker_cloud_1.AccountApi,
    netsparker_cloud_1.AgentGroupsApi,
    netsparker_cloud_1.AgentsApi,
    netsparker_cloud_1.AuditLogsApi,
    netsparker_cloud_1.AuthenticationProfilesApi,
    netsparker_cloud_1.DiscoveryApi,
    netsparker_cloud_1.IssuesApi,
    netsparker_cloud_1.MembersApi,
    netsparker_cloud_1.NotificationsApi,
    netsparker_cloud_1.RolesApi,
    netsparker_cloud_1.ScanPoliciesApi,
    netsparker_cloud_1.ScanProfilesApi,
    netsparker_cloud_1.ScansApi,
    netsparker_cloud_1.TeamApi,
    netsparker_cloud_1.TechnologiesApi,
    netsparker_cloud_1.VulnerabilityApi,
    netsparker_cloud_1.WebsiteGroupsApi,
    netsparker_cloud_1.WebsitesApi,
];
exports.DefaultNetsparkerAdapterSettings = {
    netsparkerBasePath: undefined,
    netsparkerUserId: undefined,
    netsparkerToken: undefined,
    accountInfoOnStart: true,
};
exports.NetsparkerAdapterMixin = {
    name: "Netsparker",
    settings: exports.DefaultNetsparkerAdapterSettings,
    metadata: {
        netsparker: true,
    },
    actions: {},
    methods: {},
    created() {
        this.netsparkerAdapter = {};
        this.netsparkerSDK = Netsparker;
        if (!this.settings.netsparkerUserId) {
            throw new Error("a value for netsparkerUserId was not provided!");
        }
        if (!this.settings.netsparkerToken) {
            throw new Error("a value for netsparkerToken was not provided!");
        }
        this.netsparkerAuth.username = this.settings.netsparkerUserId;
        this.netsparkerAuth.password = this.settings.netsparkerToken;
        this.logger.info("Netsparker adapter: basic HTTP auth configured");
        APIS.map((netsparkerAPI) => {
            const APIName = netsparkerAPI.name;
            const APIConfig = {
                basePath: this.settings.netsparkerBasePath,
                username: this.settings.netsparkerUserId,
                password: this.settings.netsparkerToken,
            };
            // @ts-ignore
            this.netsparkerAdapter[APIName] = new netsparkerAPI(this.APIConfig);
        });
        this.logger.info("Netsparker adapter: enabled");
    },
    async started() {
        if (this.settings.accountInfoOnStart) {
            const acccountDetails = await this.netsparkerAdapter.AccountApi.accountLicense();
            this.logger.info("Netsparker account info:", acccountDetails);
        }
    },
};
//# sourceMappingURL=index.js.map