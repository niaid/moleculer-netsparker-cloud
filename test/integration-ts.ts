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
