const { init } = require('elastic-apm-js-base');

let monitor;

const checkForAvailability = () => {
  if (!monitor) {
    throw new Error(
      'Monitoring not set. Please set the monitoring using configure method'
    );
  }
  return true;
};

const configure = (options) => {
  let active = true;
  if (options && options.active === false) {
    active = false;
  }
  const _options = {
    serviceName: (options && options.name) || 'identity-frontend-application',
    serverUrl: (options && options.serverUrl) || 'http://localhost:9200',
    serviceVersion: (options && options.version) || '0.0.1',
    active
  };
  monitor = init(_options);
};

const captureError = (error) => {
  checkForAvailability();
  let err = error;
  if (!(err instanceof Error)) {
    err = new Error(err);
  }
  monitor.captureError(err);
};

const setUser = (userId) => {
  checkForAvailability();
  monitor.setUserContext({ id: userId });
};

const setContext = (context) => {
  checkForAvailability();
  monitor.setCustomContext(context);
};

const addFilter = (fn) => {
  monitor.addFilter(fn);
};

const startTransaction = (name, type) => {
  checkForAvailability();
  monitor.startTransaction(name, type);
};

const startSpan = (name, type) => {
  checkForAvailability();
  monitor.startSpan(name, type);
};

const setInitialPageLoadName = (name) => {
  checkForAvailability();
  monitor.setInitialPageLoadName(name);
};

const setTags = (tags) => {
  checkForAvailability();
  monitor.setTags(tags);
};

module.exports = {
  configure,
  captureError,
  setUser,
  setContext,
  addFilter,
  startTransaction,
  startSpan,
  setInitialPageLoadName,
  setTags,
  _root_: monitor
};
