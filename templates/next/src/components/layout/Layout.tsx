import { PropsWithChildren, ReactElement } from 'react';
import Head from 'next/head';
import { StyledFooter } from './Layout.styles';

export type LayoutProps = {
  title: string;
  description: string;
};

export function Layout({
  children,
  title,
  description,
}: PropsWithChildren<LayoutProps>): ReactElement {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>{children}</main>
      <StyledFooter>
        <a href="https://mediamonks.github.io/pota/" target="_blank" rel="noopener noreferrer">
          Powered by Pota
        </a>
      </StyledFooter>
    </>
  );
}
