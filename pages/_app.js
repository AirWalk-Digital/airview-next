import { ThemeProvider, createTheme } from '@mui/system';
import Head from "next/head";
import { siteConfig } from "../site.config.js";
import Header from "../components/Header";
import MDXProvider from "../components/MDXProvider";
import { AnimatePresence } from "framer-motion";
import { CurrentSlideProvider } from "../context/CurrentSlideContext";
import { ModeProvider } from "../context/ModeContext";
import TransitionPage from "../layouts/TransitionPage";


import { theme } from '../constants/theme';

export default function App({ Component, pageProps }) {
  return (
    // <ThemeProvider theme={theme}>
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
                  <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@800&family=Roboto:ital,wght@0,400;0,700;1,400&display=swap"
                    rel="stylesheet"
                  />
                </Head>
                {/* <Header
                  title={siteConfig.title}
                /> */}
                <Component {...pageProps} />
              </TransitionPage>
            </AnimatePresence>
          </ModeProvider>
        </CurrentSlideProvider>
      </MDXProvider>
    // </ThemeProvider>


  );
}
