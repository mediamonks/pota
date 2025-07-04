import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { createServer, DEFAULT_SERVER_OPTIONS } from './createServer.js';
import { parseCliTemplateParams } from './utils/parseCliTemplateParams.js';

yargs(hideBin(process.argv))
  .usage('Usage: $0 [options]')
  .command<{
    mountPath: string;
    host: string;
    port: number;
    unixSocket: boolean;
    socketPath: string;
    templateDir: Array<string>;
    extensionPath: string;
    flattenPath: boolean;
  }>(
    ['$0', 'server'],
    'Start a twig render server',
    () => {},
    (argv) => {
      createServer({
        ...argv,
        templateDir: parseCliTemplateParams(argv.templateDir),
        useUnixSocket: argv.unixSocket,
      });
    },
  )
  .example('$0', 'Start a server on default host and port.')
  .example('$0 -h localhost -p 9002', 'Start a server on a specific host and port')
  .example('$0 -u -s ./twig-socket', 'Start a server connected to the socket at that location')
  .example(
    '$0 -m component-template',
    'Make all template routes available on the "component-template/" path.',
  )
  .example('$0 -d ./templates', 'Specify a folder where the template files are located.')
  .example('$0 -e ./twig-extensions.cjs', 'Provide a file to enhance the Twig Environment.')
  .example('$0 -c', 'Enable cors when starting the server.')
  .option('m', {
    alias: 'mount-path',
    default: DEFAULT_SERVER_OPTIONS.mountPath,
    describe:
      'On what path the template endpoint should be mounted. Anything after this path will count as the component path/id',
    type: 'string',
    nargs: 1,
  })
  .option('h', {
    alias: 'host',
    default: DEFAULT_SERVER_OPTIONS.host,
    describe: 'The host that will be used to run the server, passed to `app.listen`',
    type: 'string',
    nargs: 1,
  })
  .option('p', {
    alias: 'port',
    default: DEFAULT_SERVER_OPTIONS.port,
    describe: 'The port that will be used to run the server, passed to `app.listen`',
    type: 'number',
    nargs: 1,
  })
  .option('u', {
    alias: 'unix-socket',
    default: undefined,
    describe:
      'Whether to use a unix socket to start the server instead of the default `host:port`.',
    type: 'boolean',
  })
  .option('s', {
    alias: 'socket-path',
    default: undefined,
    describe: 'Where to create the unix socket. Only needed when `unix-socket` is true.',
    type: 'string',
    nargs: 1,
    implies: 'unix-socket',
  })
  .option('d', {
    alias: 'template-dir',
    default: DEFAULT_SERVER_OPTIONS.templateDir,
    describe:
      'Folder where the twig template files can be found, can pass multiple, it tries them in order. Passing name=path as an argument configures it as Twig namespace for your template includes',
    type: 'array',
  })
  .option('e', {
    alias: 'extension-path',
    default: undefined,
    describe:
      'A path to a file that exports an `addExtensions` function to enhance the Twig Environment.',
    type: 'string',
    nargs: 1,
  })
  .option('c', {
    alias: 'cors',
    default: undefined,
    describe:
      'Whether to enable cors for the created server, so it accepts requests from other origins.',
    type: 'boolean',
  })
  .option('f', {
    alias: 'flatten-path',
    default: DEFAULT_SERVER_OPTIONS.flattenPath,
    describe:
      'Flatten the path of the template files to search in folders with other names than the template id.',
    type: 'boolean',
  })
  .group(['mount-path', 'host', 'port', 'unix-socket', 'socket-path', 'cors'], 'Server options:')
  .group(['template-dir', 'extension-path', 'flatten-path'], 'Middleware options:')
  .help()
  .epilogue(
    'For more information about the parameters, please visit https://github.com/mediamonks/pota',
  )
  .version(false)
  .wrap(Math.min(120, yargs(hideBin(process.argv)).terminalWidth()))
  .parse();
