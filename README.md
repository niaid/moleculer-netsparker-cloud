# Moleculer Netsparker Mixin

Moleculer mixin for consuming Netsparker Cloud services. This mixin will provide a Moleculer microservice with a configured API client available on the service object at `this.netsparkAdapter`.

## Features

  - autowired Netsparker Cloud API client configured using service settings
  - adapater typings allow for simple consumption of API

## Install

Install the module using NPM or your favoriate package manager: `npm install --save molculer-netsparker-cloud`

## Usage

Both of the following examples pull the required API UserID and Token from the process environment. These values can be set using:

```bash
export NETSPARKER_USER_ID="<Your UserID>"
export NETSPARKER_TOKEN="<Your Token>"
```

JavaScript example:

```js
let { ServiceBroker } = require("moleculer");
let { NetsparkerAdapterMixin } = require("moleculer-netsparker-cloud");

let broker = new ServiceBroker({ logger: console });

// Create a service
const service = broker.createService({
    mixins: NetsparkerAdapterMixin,
    settings: {
      netsparkerBasePath: process.env.NETSPARKER_BASE_PATH,
      netsparkerUserId: process.env.NETSPARKER_USER_ID,
      netsparkerToken: process.env.NETSPARKER_TOKEN,
    }
});

// Start server
broker.start().then(() => {
  console.trace(service);
  setTimeout(() => broker.stop(), 10000);
});
```

TypeScript Example:

```ts
import { Service, ServiceBroker, ServiceSchema } from "moleculer";
import { NetsparkerAdapterMixin, INetsparkerAdapterMixin, INetsparkerAdapterMixinSettings } from "moleculer-netsparker-cloud";

let broker = new ServiceBroker();

type MyExampleServiceSettings = INetsparkerAdapterMixinSettings & {
  someOtherSetting: string;
}

type MyExampleService = Service<MyExampleServiceSettings> & INetsparkerAdapterMixin;

const MyExampleServiceSchema: ServiceSchema<MyExampleServiceSettings> = {
  name: 'example',
  mixins: [
    NetsparkerAdapterMixin
  ],
  settings: {
    someOtherSetting: 'test',
    netsparkerBasePath: process.env.NETSPARKER_BASE_PATH,
    netsparkerUserId: process.env.NETSPARKER_USER_ID,
    netsparkerToken: process.env.NETSPARKER_TOKEN,
  },
  actions: {
    test: {
      async handler(this: MyExampleService) {
        await this.test();
      }
    }
  },
  methods: {
    async test(this: MyExampleService) {
      const { body: me } = await this.netsparkerAdapater.AccountApi.accountMe();
      this.logger.info(me);
    }
  }
}

// Create a service
const service = broker.createService(MyExampleServiceSchema);

// Start server
broker.start().then(() => {
  broker.call('example.test');
});
```

The above TS example exemplifies one of the best quality of this mixin, the exported types.

Using these types one can appropriately type a service schema for robust intellisense during development as well as type checking during compilation.

## Tests

A couple simple tests (essentially the examples above) are included.

The JavaScript test may be ran with `npm test`. The output is simmilar to the Typescript test below except that the service object is traced to the console and broker is stopped after a set period of time.

The Typescript test may be ran with `npm run testts` and outputs the following:

```
> moleculer-netsparker-cloud@0.0.1 testts /Users/campanalecp/git/niaid/moleculer-netsparker-cloud
> node test/integration-ts.js

[2021-05-28T21:04:23.617Z] INFO  local.niaid.nih.gov-30604/BROKER: Moleculer v0.14.13 is starting...
[2021-05-28T21:04:23.618Z] INFO  local.niaid.nih.gov-30604/BROKER: Namespace: <not defined>
[2021-05-28T21:04:23.619Z] INFO  local.niaid.nih.gov-30604/BROKER: Node ID: local.niaid.nih.gov-30604
[2021-05-28T21:04:23.620Z] INFO  local.niaid.nih.gov-30604/REGISTRY: Strategy: RoundRobinStrategy
[2021-05-28T21:04:23.620Z] INFO  local.niaid.nih.gov-30604/REGISTRY: Discoverer: LocalDiscoverer
[2021-05-28T21:04:23.621Z] INFO  local.niaid.nih.gov-30604/BROKER: Serializer: JSONSerializer
[2021-05-28T21:04:23.631Z] INFO  local.niaid.nih.gov-30604/BROKER: Validator: FastestValidator
[2021-05-28T21:04:23.632Z] INFO  local.niaid.nih.gov-30604/BROKER: Registered 13 internal middleware(s).
[2021-05-28T21:04:23.648Z] INFO  local.niaid.nih.gov-30604/EXAMPLE: Netsparker adapater: basic HTTP auth configured
[2021-05-28T21:04:23.649Z] INFO  local.niaid.nih.gov-30604/EXAMPLE: Netsparker adapater: enabled
[2021-05-28T21:04:23.654Z] INFO  local.niaid.nih.gov-30604/REGISTRY: '$node' service is registered.
[2021-05-28T21:04:23.660Z] INFO  local.niaid.nih.gov-30604/$NODE: Service '$node' started.
[2021-05-28T21:04:23.938Z] INFO  local.niaid.nih.gov-30604/EXAMPLE: AccountLicenseApiModel { subscriptionMaximumSiteLimit: 0, subscriptionSiteCount: 0, subscriptionEndDate: '01/01/1999 01:00 AM', subscriptionStartDate: '01/01/1999 01:00 AM', isAccountWhitelisted: true, usedScanCreditCount: 0, scanCreditCount: 0, isCreditScanEnabled: false, isSubscriptionEnabled: true, preVerifiedWebsites: [], licenses: [ LicenseBaseModel { id: '********-****-****-****-************', isActive: true, key: '******', accountCanCreateSharkScanTask: false } ] }
[2021-05-28T21:04:23.941Z] INFO  local.niaid.nih.gov-30604/REGISTRY: 'example' service is registered.
[2021-05-28T21:04:23.942Z] INFO  local.niaid.nih.gov-30604/EXAMPLE: Service 'example' started.
[2021-05-28T21:04:23.943Z] INFO  local.niaid.nih.gov-30604/BROKER: ✔ ServiceBroker with 2 service(s) is started successfully in 294ms.
[2021-05-28T21:04:24.215Z] INFO  local.niaid.nih.gov-30604/EXAMPLE: UserHealthCheckApiModel { dateFormat: 'dd/MM/yyyy', displayName: 'Christopher Campanale', email: 'christopher.campanale@nih.gov', timeZoneInfo: '(UTC-06:00) Central America' }
[2021-05-28T21:04:24.217Z] INFO  local.niaid.nih.gov-30604/$NODE: Service '$node' stopped.
[2021-05-28T21:04:24.217Z] INFO  local.niaid.nih.gov-30604/EXAMPLE: Service 'example' stopped.
[2021-05-28T21:04:24.217Z] INFO  local.niaid.nih.gov-30604/BROKER: ServiceBroker is stopped. Good bye.
```

## Settings

| Property             | Type     | Default                           | Description            |
| -------------------- | -------- | --------------------------------- | ---------------------- |
| `netsparkerUserId`   | `String` | **required**                      | Netsparker API User ID |
| `netsparkerToken`    | `String` | **required**                      | Netsparker API Token   |
| `netsparkerBasePath` | `String` | `https://www.netsparkercloud.com` | Netsparker API URL     |

## Roadmap

Below is a small list of possible features that may be added in the future, especially if there is demand. Currently the focus of this module is very precise so the following items are not intended to be implemented any time soon:

- Currently an instance of all API client types is created and configured for authentication. While this consumes a trivial amount of time and memory one may wish to opt out of all clients so options to either specify which clients should be "auto-wired" or which clients should be execluded from this process may be useful.
- The [Netsparker API client library](https://github.com/niaid/netsparker-cloud-js) in use is automatically generated using the published Swagger/OpenAPI specification provided by Netsparker. It includes a feature for providing interceptor services which can be configured as clients are created. Options for this may be useful.

