/* eslint-disable no-console */
import { exec } from 'child_process';

const args = process.argv.slice(2);

const FOR_BRANCH = args.includes('--for-branch');

const PACKAGE_NAME = process.env.npm_package_name;
const HOST = process.env.npm_package_config_host;

const execute = async (command: string) =>
  new Promise((resolve, reject) =>
    exec(command, (error, output) => {
      if (error) {
        reject(error);
      } else {
        resolve(output);
      }
    }),
  );

const getBranchName = async () => {
  const branchName = (await execute(`cross-env-shell git branch --show-current`)) as string;

  return branchName.trim();
};

(async () => {
  if (FOR_BRANCH) {
    const branch = await getBranchName();
    const folder = branch.replace('/', '-');

    console.log(`Building branch '${branch}' for ${HOST}`);

    await execute(`cross-env-shell PUBLIC_URL=${folder} yarn build`);
    await execute(`cross-env-shell FOLDER=${folder} yarn upload-build`);

    console.log(
      `Done! You can check out your deployment at "https://${PACKAGE_NAME}.${HOST}/${folder}"`,
    );
  } else {
    console.log(`Building for ${HOST}`);

    await execute(`yarn build`);
    await execute(`yarn upload-build`);

    console.log(`Done! You can check out your deployment at "https://${PACKAGE_NAME}.${HOST}"`);
  }
})();
