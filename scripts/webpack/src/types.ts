export type CommonOptions = {
  'public-path': string;
  typecheck: boolean;
  'image-compression': boolean;
  'source-map'?: string | false;
  cache: boolean;
};

export type BuildOptions = CommonOptions & {
  analyze: boolean;
  watch: boolean;
  debug: boolean;
  output: string;
  versioning: boolean;
};

export type DevOptions = CommonOptions & {
  https: boolean;
  open: boolean;
  port: number;
  cache: boolean;
  prod: boolean;
};
