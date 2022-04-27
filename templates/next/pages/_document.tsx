import Document, { DocumentContext, DocumentInitialProps } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

/**
 * @see https://github.com/vercel/next.js/blob/7ce5d3f2408b08c6121b7edd825615161c616309/examples/with-styled-components/pages/_document.js
 */
function enhanceRendererWithStyleCollector(context: DocumentContext, sheet: ServerStyleSheet) {
  const originalRenderPage = context.renderPage;

  function styleCollectingRenderPage() {
    return originalRenderPage({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
    });
  }

  context.renderPage = styleCollectingRenderPage;
}

export default class MyDocument extends Document {
  public static async getInitialProps(context: DocumentContext): Promise<DocumentInitialProps> {
    const sheet = new ServerStyleSheet();

    try {
      enhanceRendererWithStyleCollector(context, sheet);

      const initialProps = await Document.getInitialProps(context);

      return {
        ...initialProps,
        styles: [initialProps.styles, sheet.getStyleElement()],
      };
    } finally {
      sheet.seal();
    }
  }
}
