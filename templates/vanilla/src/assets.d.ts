/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */
declare module '*.png' {
  const path: string;
  export default path;
}

declare module '*.svg?raw' {
  const svg: string;
  export default svg;
}

declare module '*.svg' {
  const path: string;
  export default path;
}
