export type TemplateOptions = {
  extensionPath?: string;
};

export type TemplateDirConfig =
  string | ReadonlyArray<string | Record<string, string>> | Record<string, string>;

export type ServerOptions = TemplateOptions & {
  mountPath?: string;
  useUnixSocket?: boolean;
  socketPath?: string;
  host?: string;
  port?: number;
  templateDir?: TemplateDirConfig;
  cors?: boolean;
};