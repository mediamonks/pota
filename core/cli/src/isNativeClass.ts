import { CommandConstructor, CommandModule } from './authoring.js';

export function isNativeClass(value: CommandModule): value is CommandConstructor {
  return typeof value === 'function' && value.toString().indexOf('class') === 0;
}
