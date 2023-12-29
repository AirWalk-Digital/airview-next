"use client";
import React, { useEffect, useState, useCallback } from "react";

import { baseTheme } from "../../constants/baseTheme";
import { MDXProvider } from "@mdx-js/react";
import { mdComponents } from "../../constants/mdxProvider.js";
import { Editor } from "@/components/editor";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import { TopBar, ControlBar } from "@/components/appbar";
import { Menu, NavigationDrawer, ButtonMenu } from "@/components/menus";
import { PagedOutput } from "@/components/layouts";
import { PresentationOutput } from "@/components/layouts/";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import EditNoteIcon from "@mui/icons-material/EditNote";
import {
  IconButton,
  Typography,
  MenuItem,
  Box,
  Alert,
  Grid,
  ButtonBase,
  LinearProgress,
  Skeleton,
  Paper,
} from "@mui/material";
import { FullScreenSpinner } from "@/components/loaders";

import { AsideAndMainContainer, Aside, Main } from "@/components/layouts";
import { TableOfContents } from "@/components/menus";
import { ContentWrapperContext } from "@/components/layouts";
import { Etherpad } from "@/components/etherpad";
import { useSelector, useDispatch } from "react-redux";
import store from "@/lib/redux/store";
import { setBranch } from "@/lib/redux/reducers/branchSlice";
import { commitFileChanges } from "@/lib/github";
import { useRouter } from "next/router";

import deepEqual from "deep-equal";
import path from "path";

export function ContentPage({
  pageContent,
  // file,
  content,
  menuStructure,
  handleContentChange,
  handlePageReset,
  collection,
  context,
  menuComponent,
  isLoading,
  // editMode: editModeInitial,
  headerComponent = null,
  sideComponent = null,
  menuOpen: menuOpenInitial = true,
}) {
  console.debug("ContentPage:menuComponent: ", menuComponent);
  console.debug("ContentPage:context: ", context);
  console.debug("ContentPage:menuOpenInitial: ", menuOpenInitial);
  // console.debug("ContentPage:content: ", content);
  const [frontmatter, setFrontmatter] = useState(pageContent.frontmatter);
  const MenuComponent = menuComponent;
  const SideComponent = sideComponent;

  const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0;
  };

  // Use useCallback to memoize the frontMatterCallback function
  const frontMatterCallback = useCallback(
    (newFrontmatter) => {
      if (
        !isEmptyObject(newFrontmatter) &&
        !deepEqual(frontmatter, newFrontmatter)
      ) {
        setFrontmatter(newFrontmatter);
      }
    },
    [frontmatter]
  ); // Make sure to include frontmatter in the dependency array

  // ControlBar
  // const [controlBarOpen, setControlBarOpen] = useState(
  //   useRouter()?.query?.edit ?? false
  // );

  const [controlBarOpen, setControlBarOpen] = useState(false);

  const currentState = store.getState();
  // const reduxContext = currentState;
  const reduxContext = currentState.branch[context.path];
  console.debug("ContentPage:context: ", context);

  console.debug("ContentPage:reduxContext: ", reduxContext);

  const dispatch = useDispatch();

  // const editFromQuery = useRouter()?.query?.edit ?? null; // ?edit=true query parameter
  // const queryBranch = useRouter()?.query?.branch ?? null; // ?branch=whatever query parameter
  const navDrawerWidth = 300;
  const topBarHeight = controlBarOpen ? 64 + 64 : 64;
  const [menuOpen, setMenuOpen] = useState(menuOpenInitial);
  const [print, setPrint] = useState(false);
  const [presentation, setPresentation] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const editFromQuery = Boolean(useRouter()?.query?.edit ?? false); // ?edit=true query parameter

  console.debug("ContentPage:editMode: ", editMode);
  // console.debug("ContentPage:editModeInitial: ", editModeInitial);

  useEffect(() => {
    // set edit mode
    console.debug("ContentPage:editFromQuery: ", editFromQuery);
    if (editFromQuery) {
      setEditMode(editFromQuery);
      setMenuOpen(false);
      setControlBarOpen(true);
    }
  }, []);

  useEffect(() => {
    // update the frontmatter
    if (pageContent.frontmatter) {
      setFrontmatter(pageContent.frontmatter);
    }
  }, [pageContent.frontmatter]);

  // useEffect(() => {
  //   // run and reprocess the files and branches.
  //   console.debug("ContentPage:queryBranch: ", queryBranch);
  //   console.debug("ContentPage:editFromQuery: ", editFromQuery);

  //   if (editFromQuery) {
  //     setEditMode(true);
  //     setControlBarOpen(true)
  //   } // set the edit mode from the query parameter ?edit=true

  //   if (
  //     reduxContext &&
  //     reduxContext.branch &&
  //     queryBranch &&
  //     queryBranch != reduxContext.branch
  //   ) {
  //     console.log(
  //       "ContentPage:queryBranch(in URI): ",
  //       queryBranch,
  //       " : ",
  //       reduxContext?.branch ?? null
  //     );
  //     const newContext = { ...context, branch: queryBranch };
  //     console.debug("ContentPage:newContext: ", newContext);

  //     dispatch(setBranch(newContext));
  //     handleContentChange(context.file);
  //     setControlBarOpen(true);
  //     // setControlBarOpen(true)
  //     // setChangeBranch(true)
  //   } // set the branch from the query parameter ?branch=
  // }, []);

  const handleEditMode = (mode) => {
    console.debug("ContentPage:handleEditMode: ", mode);
    setEditMode(mode);
    if (!mode) {
      if (typeof window !== "undefined") {
        let url = new URL(window.location.href);

        // If there is an 'edit' query parameter, delete it
        if (url.searchParams.has("edit")) {
          url.searchParams.delete("edit");
        }

        window.history.replaceState({}, document.title, url);
      }
    } else {
      handleContentChange(context.file);
    }
    if (menuOpenInitial) {
      setMenuOpen(!mode);
    }
  };

  const handleOnNavButtonClick = () => setMenuOpen((prevState) => !prevState);

  const { primary, relatedContent } = menuStructure || {};

  function handleRefresh() {
    // console.log('ContentPage:handleRefresh:context: ', context)
    handleContentChange(context.file);
  }

  function handlePrint() {
    setPrint(!print);
    setMenuOpen(print);
  }

  function handlePresentation() {
    setPresentation(!presentation);
  }

  async function onSave(content) {
    console.debug(
      "ContentPage:onSave: ",
      reduxContext.owner,
      reduxContext.repo,
      reduxContext.branch,
      context.file,
      "Airview commit"
    );

    const normalizedFile = context.file.replace(/^\/+/, "");
    await commitFileChanges(
      reduxContext.owner,
      reduxContext.repo,
      reduxContext.branch,
      normalizedFile,
      content,
      "Airview commit"
    );
    // const currentState = store.getState();
    // const reduxCollection = currentState.branch[collection];
    // console.log("Editor:context: ", context);
    // console.log("Editor:currentState: ", currentState);
    // console.log("Editor:reduxCollection: ", reduxCollection);
  }

  const Content = () => {
    if (context && context.file && context.file.endsWith(".etherpad")) {
      return (
        <Etherpad
          file={context.file}
          frontMatterCallback={frontMatterCallback}
          editMode={editMode}
        />
      );
    } else if (context && pageContent.content && pageContent.frontmatter) {
      const Page = pageContent.content;
      return <Page />;
    } else {
      // return <FullScreenSpinner />;
    }
  };

  if (isLoading) {
    return <ContentSkeleton topBarHeight={topBarHeight} />;
  }

  if (!print && !presentation && !editMode) {
    return (
      <ContentWrapperContext>
        <ThemeProvider theme={baseTheme}>
          <CssBaseline />
          <TopBar
            onNavButtonClick={handleOnNavButtonClick}
            navOpen={menuOpen}
            menu={true}
            topBarHeight={topBarHeight}
            handlePrint={handlePrint}
            handlePresentation={
              frontmatter?.format === "presentation" ? handlePresentation : null
            }
            handleMore={() =>
              setControlBarOpen((controlBarOpen) => !controlBarOpen)
            }
          />
          <ControlBar
            open={controlBarOpen}
            height={64}
            handleEdit={handleEditMode}
            handlePrint={handlePrint}
            handleRefresh={handleRefresh}
            handlePresentation={
              frontmatter?.format === "presentation" ? handlePresentation : null
            }
            collection={collection}
            context={context}
            editMode={editMode}
            setControlBarOpen={setControlBarOpen}
          />

          {menuStructure && (
            <MenuComponent
              menu={menuStructure.primary}
              open={menuOpen}
              top={topBarHeight + 1}
              drawerWidth={navDrawerWidth}
            />
          )}
          <div
            style={{
              marginTop: topBarHeight,
              paddingLeft: menuOpen ? navDrawerWidth : 0,
              // paddingLeft: (print || !menuOpen) ? 0 : navDrawerWidth,
            }}
          >
            <AsideAndMainContainer>
              {/* <Main sx={{}}> */}
              <Main>
                <Banner
                  frontmatter={frontmatter}
                  handlePresentation={handlePresentation}
                  headerComponent={headerComponent}
                  editMode={editMode}
                />

                <MDXProvider components={mdComponents(context)}>
                  <>
                    <Content />
                  </>
                </MDXProvider>
              </Main>
              <Aside
                sx={{
                  displayPrint: "none",
                  display: print ? "none" : "",
                  pt: "2%",
                }}
              >
                <ContentMenu
                  content={relatedContent}
                  context={context}
                  // knowledge={knowledge}
                  // designs={designs}
                  handleContentChange={handleContentChange}
                  handlePageReset={handlePageReset}
                  file={context.file}
                />
                {sideComponent && <SideComponent />}
                {frontmatter?.tableOfContents && (
                  <TableOfContents
                    tableOfContents={frontmatter.tableOfContents}
                  />
                )}

                {/* <ButtonMenu
                menuTitle="Controls"
                menuItems={createControlMenu(controls)}
                initialCollapsed={false}
                loading={false}
                fetching={false}
                handleButtonClick={handleControlClick}
              /> */}
              </Aside>
            </AsideAndMainContainer>
          </div>
        </ThemeProvider>
      </ContentWrapperContext>
    );
  } else if (print) {
    return (
      <ContentWrapperContext>
        <PagedOutput handlePrint={handlePrint}>
          <ThemeProvider theme={baseTheme}>
            <CssBaseline />
            <MDXProvider components={mdComponents(context)}>
              <>
                <Content />
              </>
            </MDXProvider>
          </ThemeProvider>
        </PagedOutput>
      </ContentWrapperContext>
    );
  } else if (presentation) {
    return (
      <ContentWrapperContext>
        <PresentationOutput
          handlePresentation={handlePresentation}
          refresh={false}
          content={content}
        >
          <MDXProvider components={mdComponents(context)}>
            <>
              <Content />
            </>
          </MDXProvider>
        </PresentationOutput>
      </ContentWrapperContext>
    );
  } else if (editMode) {
    return (
      <ContentWrapperContext>
        <ThemeProvider theme={baseTheme}>
          <CssBaseline />
          <TopBar
            onNavButtonClick={handleOnNavButtonClick}
            navOpen={menuOpen}
            menu={true}
            topBarHeight={topBarHeight}
            handlePrint={handlePrint}
            handlePresentation={
              frontmatter?.format === "presentation" ? handlePresentation : null
            }
            handleMore={() =>
              setControlBarOpen((controlBarOpen) => !controlBarOpen)
            }
          />
          <ControlBar
            open={controlBarOpen}
            height={64}
            handleEdit={handleEditMode}
            handlePrint={handlePrint}
            handleRefresh={handleRefresh}
            handlePresentation={
              frontmatter?.format === "presentation" ? handlePresentation : null
            }
            collection={collection}
            context={context}
            editMode={editMode}
            setControlBarOpen={setControlBarOpen}
          />
          <div
            style={{
              marginTop: topBarHeight + 10,
              paddingLeft: 0,
              zIndex: 999,
            }}
          >
            <Editor
              markdown={content}
              context={context}
              callbackSave={onSave}
              top={topBarHeight+64}
              enabled={ collection.branch != context.branch }
            />
          </div>
        </ThemeProvider>
      </ContentWrapperContext>
    );
  }
}

function Banner({
  frontmatter,
  handlePresentation,
  headerComponent,
  editMode,
}) {
  const [environment, setEnvironment] = useState("");
  const HeaderComponent = headerComponent;

  useEffect(() => {
    const fetchData = async () => {
      const resp = await fetch("/api/environment");
      const data = await resp.json();
      console.log(data);
      setEnvironment(data);
    };
    fetchData();
  }, []);

  return (
    <>
      {headerComponent ? (
        <HeaderComponent frontmatter={frontmatter} />
      ) : (
        <Typography variant="h1" component="h1" sx={{ pl: 0, mx: "0%" }}>
          {frontmatter?.title && frontmatter.title}
        </Typography>
      )}
      {frontmatter?.format === "presentation" && !editMode && (
        <Grid
          container
          alignItems="center"
          spacing={1}
          style={{ textAlign: "center" }}
          sx={{
            background: "rgb(229, 246, 253)",
            px: "10px",
            borderRadius: "8px",
          }}
        >
          <Grid>
            <Alert severity="info">
              This is a presentation. View in presentation mode by clicking{" "}
            </Alert>
          </Grid>
          <Grid>
            <IconButton
              size="medium"
              onClick={handlePresentation}
              color="inherit"
            >
              <SlideshowIcon />
            </IconButton>
          </Grid>
          <Grid />
        </Grid>
      )}

      {frontmatter?.padID && (
        <Grid
          container
          alignItems="center"
          spacing={1}
          style={{ textAlign: "center" }}
          sx={{
            background: "rgb(229, 246, 253)",
            px: "10px",
            borderRadius: "8px",
          }}
        >
          <Grid>
            <Alert severity="info">
              This is draft content from Etherpad. edit here:{" "}
            </Alert>
          </Grid>
          <Grid>
            <IconButton
              size="medium"
              href={`${environment.ETHERPAD_URL}/p/${frontmatter.padID}`}
              target="_blank"
              rel="noopener noreferrer" // For security reasons
              color="inherit"
            >
              <EditNoteIcon />
            </IconButton>
          </Grid>
          <Grid />
        </Grid>
      )}
    </>
  );
}

function ContentMenu({
  content,
  file,
  handleContentChange,
  handlePageReset,
  context,
  loading = false,
}) {
  // let directory = file?.includes("/") ? file.split("/")[1] : file;

  const onContentClick = (callback) => {
    console.log("ContentPage:ContentMenu:onContentClick: ", callback);

    handleContentChange(callback, true);
  };

  let directory = file ? path.dirname(file) : null;

  let chaptersMenu = [];
  if (content && content[directory]) {
    for (let collectionItem of context.collections) {
      if (content[directory][collectionItem]) {
        // console.log('ContentMenu:collectionItem: ', collectionItem)
        chaptersMenu.push({
          groupTitle: collectionItem,
          links: content[directory][collectionItem],
        });
      }
    }

    if (content[directory].chapters) {
      chaptersMenu.push({
        groupTitle: "Chapters",
        links: content[directory].chapters,
      });
    }
    // if (content[directory].knowledge) {
    //   chaptersMenu.push(
    //     {
    //       groupTitle: "Knowledge",
    //       links: content[directory].knowledge

    //     }
    //   )
    // }
    // if (content[directory].designs) {
    //   chaptersMenu.push(
    //     {
    //       groupTitle: "Designs",
    //       links: content[directory].designs
    //     }
    //   )
    // }
  }
  if (chaptersMenu) {
    // return (null)

    return (
      <>
        <ButtonBase
          variant="text"
          onClick={() => handlePageReset()}
          sx={{
            textDecoration: "none",
            textTransform: "none",
            textAlign: "left",
            fontWeight: "bold",
            color: "secondary.main",
            mb: "5%",
          }}
        >
          Main Content
        </ButtonBase>

        <ButtonMenu
          menuTitle="Related Content"
          menuItems={chaptersMenu}
          initialCollapsed={false}
          loading={false}
          fetching={false}
          handleButtonClick={onContentClick}
        />
      </>
    );
    // return (
    //   <Menu
    //     menuTitle="Content"
    //     menuItems={chaptersMenu}
    //     initialCollapsed={false}
    //     loading={false}
    //     fetching={false}
    //   />
    // );
  }
}

function SolutionsMenu({ solutions, open, top, drawerWidth }) {
  // // console.log('SolutionsMenu: ', solutions)

  return (
    <NavigationDrawer open={open} top={top} drawerWidth={drawerWidth}>
      {solutions &&
        solutions.map((c, i) => (
          <Link
            key={i}
            href={c.url}
            sx={{ textDecoration: "none", color: "text.secondary" }}
          >
            <MenuItem sx={{ pl: "0", color: "text.secondary" }}>
              {c.label}
            </MenuItem>
          </Link>
        ))}
    </NavigationDrawer>
  );
}

function LeftMenu({ menu, open, top, drawerWidth }) {
  // console.log('LeftMenu:menu: ', menu)

  return (
    <NavigationDrawer open={open} top={top} drawerWidth={drawerWidth}>
      {menu &&
        menu.length > 0 &&
        menu.map((c) => (
          <React.Fragment key={c.label}>
            <Link
              href={c.url}
              sx={{ textDecoration: "none", color: "text.secondary" }}
            >
              <h3 sx={{ pl: "0", color: "text.secondary" }}>{c.label}</h3>
            </Link>
            {c.children && <L2Menu menu={c.children} />}
          </React.Fragment>
        ))}
    </NavigationDrawer>
  );
}

const L2Menu = ({ menu }) => {
  return (
    <>
      {menu &&
        Object.entries(menu).map(([key, children]) => (
          <div key={key}>
            <Menu
              key={key}
              menuTitle={capitalizeFirstLetter(key)}
              menuItems={[{ links: children }]}
              initialCollapsed={true}
              loading={false}
              fetching={false}
              linkComponent={Link}
            />

            {/* 
        <h3 sx={{ pl: '0', color: 'text.secondary', textTransform: 'capitalize' }}>
          {key}
        </h3>
        {children && children.map((item, index) => (
          <Link key={index} href={item.url} sx={{ textDecoration: 'none', color: 'text.secondary' }}>
            <MenuItem sx={{ pl: '0', color: 'text.secondary'}}>
               {item.label}</MenuItem>
          </Link>
        ))} */}
          </div>
        ))}
    </>
  );
};

// {menu.map((c, i) =>  <Link key={i} href={c.url} sx={{ textDecoration: 'none', color: 'text.secondary' }}><MenuItem sx={{ pl: '0', color: 'text.secondary'}}>
//                 {c.label}</MenuItem></Link>)}

function BasicLeftMenu({ menu, open, top, drawerWidth }) {
  // console.log('BasicLeftMenu: ', menu)

  return (
    <NavigationDrawer open={open} top={top} drawerWidth={drawerWidth}>
      {menu &&
        menu.map((c, i) => (
          <Link
            key={i}
            href={c.url}
            sx={{ textDecoration: "none", color: "text.secondary" }}
          >
            <MenuItem sx={{ pl: "0", color: "text.secondary" }}>
              {c.label}
            </MenuItem>
          </Link>
        ))}
    </NavigationDrawer>
  );
}

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

function ContentSkeleton({ topBarHeight }) {
  return (
    <ThemeProvider theme={baseTheme}>
      <CssBaseline />
      <TopBar
        onNavButtonClick={null}
        navOpen={false}
        menu={true}
        topBarHeight={topBarHeight}
        handlePrint={null}
        handlePresentation={null}
      />

      <div
        style={{
          marginTop: topBarHeight,
          paddingLeft: 0,
        }}
      >
        <AsideAndMainContainer>
          <Main sx={{}}>
            <LinearIndeterminate />
          </Main>
        </AsideAndMainContainer>
      </div>
    </ThemeProvider>
  );
}

function LinearIndeterminate() {
  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
}
