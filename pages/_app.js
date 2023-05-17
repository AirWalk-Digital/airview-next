import Head from "next/head";
import { siteConfig } from "../site.config.js";
import MDXProvider from "../components/MDXProvider";
import { AnimatePresence } from "framer-motion";
import { CurrentSlideProvider } from "../context/CurrentSlideContext";
import { ModeProvider } from "../context/ModeContext";
import TransitionPage from "../layouts/TransitionPage";
import Script from 'next/script';
import ErrorBoundary from "../components/ErrorBoundary.jsx";


export default function App({ Component, pageProps }) {
  return (
    // <ThemeProvider theme={theme}>
    <ErrorBoundary>
      <MDXProvider>
        <CurrentSlideProvider>
          <ModeProvider>
            <AnimatePresence exitBeforeEnter>
              <TransitionPage>
                <Head>
                  <title>
                    {siteConfig.title}
                  </title>
                  <link rel="icon" href="/favicon.ico" />

                  <Script src="https://kit.fontawesome.com/ff3b5aaa16.js" crossOrigin="anonymous" />
                </Head>
                <Component {...pageProps} />
              </TransitionPage>
            </AnimatePresence>
          </ModeProvider>
        </CurrentSlideProvider>
      </MDXProvider>
    </ErrorBoundary>


  );
}
