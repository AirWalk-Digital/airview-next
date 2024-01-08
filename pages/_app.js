import * as React from 'react';
import Router from "next/router";
import Head from 'next/head';
import Script from 'next/script';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import { baseTheme as theme } from '../constants/baseTheme.js';
import createEmotionCache from '../lib/createEmotionCache';
import { MDXProvider } from '@mdx-js/react'
import { mdComponents } from "../constants/mdxProvider";

import {Provider} from 'react-redux'
import store from '@/lib/redux/store'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();


export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
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
  return (
    <CacheProvider value={emotionCache}>
      <Head>
      <title>Airview</title>

        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <Script
              src="https://kit.fontawesome.com/ff3b5aaa16.js"
              crossOrigin="anonymous"
            />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Provider store={store}><Component {...pageProps} loading={loading}/></Provider>
      </ThemeProvider>
    </CacheProvider>
  );
}