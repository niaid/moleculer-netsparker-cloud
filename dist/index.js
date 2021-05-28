"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Netsparker = __importStar(require("netsparker-cloud"));
const netsparker_cloud_1 = require("netsparker-cloud");
exports.DefaultNetsparkerAdapterSettings = {
    netsparkerBasePath: undefined,
    netsparkerUserId: undefined,
    netsparkerToken: undefined,
    accountInfoOnStart: true,
};
exports.NetsparkerAdapterMixin = {
    name: 'NetsparkerAdapter',
    settings: exports.DefaultNetsparkerAdapterSettings,
    metadata: {
        netsparker: true,
    },
    actions: {},
    methods: {},
    created() {
        this.netsparkerAdapater = {};
        this.netsparkerAuth = new netsparker_cloud_1.HttpBasicAuth();
        this.netsparkerSDK = Netsparker;
        if (!this.settings.netsparkerUserId) {
            throw new Error('a value for netsparkerUserId was not provided!');
        }
        if (!this.settings.netsparkerToken) {
            throw new Error('a value for netsparkerToken was not provided!');
        }
        this.netsparkerAuth.username = this.settings.netsparkerUserId;
        this.netsparkerAuth.password = this.settings.netsparkerToken;
        this.logger.info('Netsparker adapater: basic HTTP auth configured');
        netsparker_cloud_1.APIS.map(netsparkerAPI => {
            const APIName = netsparkerAPI.name;
            // @ts-ignore
            this.netsparkerAdapater[APIName] = new netsparkerAPI(this.settings.netsparkerBasePath);
            this.netsparkerAdapater[APIName].setDefaultAuthentication(this.netsparkerAuth);
        });
        this.logger.info('Netsparker adapater: enabled');
    },
    async started() {
        const { body: acccountDetails } = await this.netsparkerAdapater.AccountApi.accountLicense();
        this.logger.info(acccountDetails);
    }
};
//# sourceMappingURL=index.js.map