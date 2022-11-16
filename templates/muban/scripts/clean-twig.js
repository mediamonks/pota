var shell = require('shelljs');

shell.rm('-rf', './config/twig')
shell.rm('./src/**/*.twig', './src/pages/_main.twig.ts')
