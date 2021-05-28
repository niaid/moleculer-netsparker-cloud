let { ServiceBroker } = require("moleculer");
let { NetsparkerAdapterMixin } = require("../.");

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
  setTimeout(() => broker.stop(), 5000);
});
