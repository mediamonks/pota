import type { ComponentTemplateResult } from '@muban/template';
import { html } from '@muban/template';

export type ImageTestProps = {
  dataImage?: string;
};

export function imageTestTemplate({ dataImage }: ImageTestProps): ComponentTemplateResult {
  return html`<div data-component="image-test">
    <div>
      <h1>Data Image</h1>
      <img src=${dataImage} alt="Some description about what can be seen." />
    </div>
    <div>
      <h1>JS Image</h1>
      <img data-ref="js-image" alt="Some description about what can be seen." />
    </div>
    <div>
      <h1>CSS Image</h1>
      <div alt="css" class="css-image"></div>
    </div>
    <div>
      <h1>Template Image</h1>
      <img
        src="${process.env.PUBLIC_PATH}static/img/template-test.jpg"
        alt="A fighter pilot inside of a plane."
      />
    </div>
  </div>`;
}
