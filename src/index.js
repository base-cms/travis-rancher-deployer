#!/usr/bin/env node

const Rancher = require('./rancher');
const pkg = require('../package.json');

// Arguments
const { RANCHER_URI, RANCHER_ACCESS_KEY, RANCHER_SECRET_KEY } = require('./env.js')

const { log } = console;

const api = new Rancher({
  uri: RANCHER_URI,
  accessKey: RANCHER_ACCESS_KEY,
  secretKey: RANCHER_SECRET_KEY,
});

// Command logic
require('yargs').command(
  '$0 <image> <service>',
  'Deploy to Rancher',
  (yargs) => {
    yargs.positional('image', {
      describe: 'Docker image to deploy',
      type: 'string',
      demand: true,
    }).positional('service', {
      describe: 'The `service=X` label to target',
      type: 'string',
      demand: true,
    }).option('finish', {
      describe: 'Automatically finish upgrades when complete',
      type: 'boolean',
      default: true,
    }).option('batchSize', {
      describe: 'The number of containers that you want stopped from the old service and started from the new service at one time.',
      type: 'int',
      default: 1,
    })
  },
  async ({ service, image, finish, batchSize }) => {
    log(`> Finding services with label "service=${service}"`);
    const services = await api.findServicesByTag({ service });

    log(`> Found ${services.length} services to upgrade.`);
    if (services.length) {
      log('> Starting service upgrades.');
      await Promise.all(services.map(service => api.upgradeService({ service, image, finish, batchSize })))
        .then(() => log('> Upgrades complete.'));
    }
    log('> Run completed.\n');
  })
  .demandOption(['image', 'service'])
  .example('$0 myorg/my-image:v1 my-cool-service', 'Upgrade services tagged as `service=my-cool-service` using the image `myorg/my-image:v1`')
  .help()
  .argv;

process.on('unhandledRejection', (e) => {
  log('> Unhandled promise rejection. Throwing error...');
  throw e;
});
