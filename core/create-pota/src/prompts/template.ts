import prompts from 'prompts';

import { command } from '../util/spawn.js';

type NpmTemplatesOptions = {
  keyword: string;
  scopes: ReadonlyArray<string>;
};

type SearchJsonResponse = ReadonlyArray<{
  name: string;
  scope: string;
  description: string;
}>;

function parseName(name: string, scope: string) {
  const match = name.match(`@${scope}/(([a-z\\d][\\w\\-.]?)*)-template`);

  return match?.[1] || name;
}

async function npmTemplates(options: NpmTemplatesOptions) {
  const rawResponse = await command(`npm search --json "${options.keyword}"`, false);

  if (!rawResponse) throw new Error('could not find any pota templates on npm');

  const jsonResponse: SearchJsonResponse = JSON.parse(rawResponse);

  return jsonResponse
    .filter(({ name, scope }) => options.scopes.includes(scope) && name.endsWith('template'))
    .map(({ description, name, scope }) => ({
      description,
      name,
      parsedName: parseName(name, scope),
    }));
}

let NPM_TEMPLATES: Array<{ description: string; name: string; parsedName: string }> = [];

async function prefetch(...params: Parameters<typeof npmTemplates>) {
  NPM_TEMPLATES = await npmTemplates(...params);
}

async function template() {
  const { template } = await prompts({
    type: 'select',
    name: 'template',
    message: 'Select a template:',
    initial: 0,
    choices: NPM_TEMPLATES.map(({ name, parsedName, description }) => ({
      title: parsedName,
      value: name,
      description,
    })),
  });

  return template;
}

export const promptTemplate = Object.assign(template, { prefetch });
