import Head from "next/head";
import { siteConfig } from "../site.config.js";
// import MDXProvider from "../components/MDXProvider";
import { AnimatePresence } from "framer-motion";
import { CurrentSlideProvider } from "../context/CurrentSlideContext";
import { ModeProvider } from "../context/ModeContext";
// import TransitionPage from "../layouts/TransitionPage";
import Script from 'next/script';

import { MDXProvider } from '@mdx-js/react'
import { mdComponents } from "../constants/mdxProvider";


function OutputWrapper({ children }) {
  return (
    <CurrentSlideProvider>
      <ModeProvider>
        <AnimatePresence exitBeforeEnter>
          {/* <TransitionPage> */}
          <Head>
            <title>{siteConfig.title}</title>
            <link rel="icon" href="/favicon.ico" />

            <Script
              src="https://kit.fontawesome.com/ff3b5aaa16.js"
              crossOrigin="anonymous"
            />
          </Head>
          {children}
          {/* </TransitionPage> */}
        </AnimatePresence>
      </ModeProvider>
    </CurrentSlideProvider>
  )
};


function DefaultWrapper({ children }) {
  return (
    <><Head>
            <title>{siteConfig.title}</title>
            <link rel="icon" href="/favicon.ico" />

            <Script
              src="https://kit.fontawesome.com/ff3b5aaa16.js"
              crossOrigin="anonymous"
            />
          </Head>
          {children}
          {/* </TransitionPage> */}
          </>
  )
};

export default function App({ Component, pageProps, ...appProps }) {

  const getContent = () => {
    // array of all the paths that doesn't need layout
    if (appProps.router.pathname.startsWith('/output')) {
      return (<OutputWrapper><Component {...pageProps} /></OutputWrapper>);
    } else {
      return (<DefaultWrapper><Component {...pageProps} /></DefaultWrapper>);
    };
  };



  return (
    // <ThemeProvider theme={theme}>
    // <ErrorBoundary>
    <MDXProvider components={mdComponents}>
      {/* <MDXProvider> */}
      {getContent()}
    </MDXProvider>
    // </ErrorBoundary>
  );
}
