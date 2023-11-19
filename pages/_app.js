import Head from "next/head";
import React from "react";
import Router from "next/router";

import { siteConfig } from "../site.config.js";
// import MDXProvider from "../components/MDXProvider";
import { AnimatePresence } from "framer-motion";
import { CurrentSlideProvider } from "../context/CurrentSlideContext";
import { ModeProvider } from "../context/ModeContext";
// import TransitionPage from "../layouts/TransitionPage";
import Script from 'next/script';

import { MDXProvider } from '@mdx-js/react'
import { mdComponents } from "../constants/mdxProvider";

import {Provider} from 'react-redux'
import store from '@/lib/redux/store'


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
  const [loading, setLoading] = React.useState(false);
      React.useEffect(() => {
        const start = () => {
          console.log("start");
          setLoading(true);
        };
        const end = () => {
          console.log("finished");
          setLoading(false);
        };
        Router.events.on("routeChangeStart", start);
        Router.events.on("routeChangeComplete", end);
        Router.events.on("routeChangeError", end);
        return () => {
          Router.events.off("routeChangeStart", start);
          Router.events.off("routeChangeComplete", end);
          Router.events.off("routeChangeError", end);
        };
      }, []);
  const getContent = () => {
    // array of all the paths that doesn't need layout
    if (appProps.router.pathname.startsWith('/output')) {
      return (<OutputWrapper><Component {...pageProps} loading={loading}/></OutputWrapper>);
    } else {
      return (<DefaultWrapper> <Provider store={store}><Component {...pageProps} loading={loading}/></Provider></DefaultWrapper>);
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
  )

}
