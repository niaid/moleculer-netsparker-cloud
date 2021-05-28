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
import { NetsparkerAdapterMixin, INetsparkerAdapterMixin, INetsparkerAdapterMixinSettings } from "../dist";

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

