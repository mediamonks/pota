export type CommonOptions = {
  'public-path': string;
  'log-level': 'info' | 'warn' | 'error' | 'silent';
};

export type DevAndBuildOptions = {
  force: boolean;
};

export type DevAndPreviewOptions = {
  host: string | boolean;
  https: boolean;
  open: boolean;
  port: number;
  cors: boolean;
};

export type BuildOptions = CommonOptions &
  DevAndBuildOptions & {
    watch: boolean;
    debug: boolean;
    output: string;
    'source-map': boolean;
  };

export type DevOptions = CommonOptions & DevAndBuildOptions & DevAndPreviewOptions & {
  prod: boolean;
};

export type PreviewOptions = CommonOptions & DevAndPreviewOptions;
