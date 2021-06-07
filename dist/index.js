"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
const netsparker_cloud_1 = require("netsparker-cloud");
__exportStar(require("netsparker-cloud"), exports);
exports.DefaultNetsparkerAdapterSettings = {
    netsparkerBasePath: undefined,
    netsparkerUserId: undefined,
    netsparkerToken: undefined,
    accountInfoOnStart: true,
};
exports.NetsparkerAdapterMixin = {
    name: 'Netsparker',
    settings: exports.DefaultNetsparkerAdapterSettings,
    metadata: {
        netsparker: true,
    },
    actions: {},
    methods: {},
    created() {
        this.netsparkerAdapter = {};
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
        this.logger.info('Netsparker adapter: basic HTTP auth configured');
        netsparker_cloud_1.APIS.map(netsparkerAPI => {
            const APIName = netsparkerAPI.name;
            // @ts-ignore
            this.netsparkerAdapter[APIName] = new netsparkerAPI(this.settings.netsparkerBasePath);
            this.netsparkerAdapter[APIName].setDefaultAuthentication(this.netsparkerAuth);
        });
        this.logger.info('Netsparker adapter: enabled');
    },
    async started() {
        if (this.settings.accountInfoOnStart) {
            const { body: acccountDetails } = await this.netsparkerAdapter.AccountApi.accountLicense();
            this.logger.info('Netsparker account info:', acccountDetails);
        }
    }
};
//# sourceMappingURL=index.js.map