import webpack from "webpack";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

async function executeCompiler(compiler) {
  return new Promise((resolve, reject) => 
    compiler.run(async (error, stats) => {

      await new Promise((resolve, reject) => compiler.close(error => error ? reject(error) : resolve()));

      if (error) {
        const reason = error.toString();
        if (reason) return resolve({ errors: [reason], warnings: []});
        return reject(error);
      }


      return resolve(generateStats({ errors: [], warnings: [] }, stats));
    })
  );
}
 
function generateStats(result, stats) {
  const { errors, warnings } = stats.toJson('errors-warnings');

  if (errors.length > 0) result.errors.push(...errors);
  if (warnings.length > 0) result.warnings.push(...warnings);

  return result;
}

const loadConfig = (path) => import(path).then(({ default: module }) => module);

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_CONFIG_PATH = join(__dirname, "..", "webpack.config.js")

export default async function(configPath = DEFAULT_CONFIG_PATH) {
  let config;

  try {
    config = await loadConfig(configPath);
  } catch (error) {
    throw new Error(`Failed loading config at '${configPath}:'\n`, error);
  }

  const compiler = webpack(config);

  try {
    const out = await executeCompiler(compiler);
    console.log(out);
  } catch (error) {
    console.error(error);
  }
}
