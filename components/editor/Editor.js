import "@mdxeditor/editor/style.css";
import React from "react";
import {
  MDXEditor,
  system,
  realmPlugin,
  MdastImportVisitor,
  imagePlugin,
  codeBlockPlugin,
  diffSourcePlugin,
  headingsPlugin,
  frontmatterPlugin,
  listsPlugin,
  linkPlugin,
  linkDialogPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  useCodeBlockEditorContext,
  toolbarPlugin,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  UndoRedo,
  InsertTable,
  InsertCodeBlock,
  InsertFrontmatter,
  InsertImage,
  CreateLink,
  InsertThematicBreak,
  DiffSourceToggleWrapper,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { $createParagraphNode, $createTextNode, ElementNode } from "lexical";
import * as matter from "gray-matter";
import Paper from "@mui/material/Paper";
import { AsideAndMainContainer, Aside, Main } from "@/components/layouts";
import path from "path";

// const { MDXEditor, codeBlockPlugin, diffSourcePlugin, headingsPlugin, frontmatterPlugin, listsPlugin, linkPlugin, linkDialogPlugin, quotePlugin, tablePlugin, thematicBreakPlugin, markdownShortcutPlugin, useCodeBlockEditorContext, toolbarPlugin, BlockTypeSelect, BoldItalicUnderlineToggles, UndoRedo, InsertTable, InsertCodeBlock, InsertFrontmatter, CreateLink, InsertThematicBreak, DiffSourceToggleWrapper } = await import('@mdxeditor/editor')
import { useState, useRef, createContext } from "react";
import Button from "@mui/material/Button";

const EditorStateContext = createContext();
import store from "@/lib/redux/store";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  MenuItem,
  Box,
  Alert,
  Grid,
  TextField,
  Fab,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { styled } from "@mui/material/styles";




function convertMdastToLexical(mdastNode) {
  switch (mdastNode.type) {
    case "mdxJsxTextElement":
      return convertJsxElement(mdastNode);
    case "text":
      return mdastNode.value;
    // Handle other MDAST node types if needed
    default:
      return "";
  }
}

function convertJsxElement(jsxNode) {
  const tagName = jsxNode.name;
  const attributes = jsxNode.attributes
    .map((attr) => `${attr.name}="${attr.value}"`)
    .join(" ");
  const children = jsxNode.children.map(convertMdastToLexical).join("");

  return `<${tagName} ${attributes}>${children}</${tagName}>`;
}

const catchAllVisitor = {
  testNode: () => true,

  visitNode: ({ mdastNode, actions, lexicalParent }) => {
    const paragraph = $createParagraphNode();
    // This can be more sophisticated. For example, you can use the mdastNode.type
    // to determine what kind of node you want to create. If you feel like it,
    // you may even convert the mdastNode to html then to plain text.
    // This will need additional dependencies, though.
    console.debug("Editor:catchAllPlugin:mdastNode: ", mdastNode);
    console.debug("Editor:catchAllPlugin:actions: ", actions);
    console.debug("Editor:catchAllPlugin:lexicalParent: ", lexicalParent);

    try {
      const lexicalContent = convertMdastToLexical(mdastNode);
      console.log("Editor:catchAllPluging:lexicalContent: ", lexicalContent); // Check how it looks in the console
      // paragraph.append($createTextNode(mdastNode.children[0].value));
      paragraph.append($createTextNode(lexicalContent));
    } catch (err) {
      console.debug("Editor:catchAllPlugin:mdastNode: ", mdastNode);
      console.error("Editor:catchAllPlugin:error: ", err);
    }
    console.log("Editor:catchAllPluging:paragraph: ", paragraph); // Check how it looks in the console
    lexicalParent.append(paragraph);
    console.log("Editor:catchAllPluging:lexicalParent: ", lexicalParent); // Check how it looks in the console
  },
};

const [catchAllPlugin] = realmPlugin({
  id: "catchAll",
  systemSpec: system(() => ({})),
  init: (realm) => {
    realm.pubKey("addImportVisitor", catchAllVisitor);
  },
});

const PlainTextCodeEditorDescriptor = {
  match: () => true,
  priority: 0,
  Editor: (props) => {
    const cb = useCodeBlockEditorContext();
    return (
      <div onKeyDown={(e) => e.nativeEvent.stopImmediatePropagation()}>
        <textarea
          rows={3}
          cols={20}
          defaultValue={props.code}
          onChange={(e) => cb.setCode(e.target.value)}
        />
      </div>
    );
  },
};

export function Editor({
  markdown: initialMarkdown,
  context,
  callbackSave,
  enabled = true,
  top
}) {
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [changed, setChanged] = useState(false); // enable/disable the save button
  const ref = useRef();
  let collection = context?.path || "null";
  const currentState = store.getState();
  const reduxCollection = currentState.branch[collection];
  console.log("Editor:context: ", context);
  console.log("Editor:reduxCollection: ", reduxCollection);
  console.log("Editor:initialMarkdown: ", initialMarkdown);

  const StyledMDXEditor = styled(MDXEditor)`
  [role='toolbar'] {
    // border: 1px solid #d1d5db;
    // border-radius: 0.15rem;
    // border-bottom-right-radius: 0;
    // border-bottom-left-radius: 0;
  }

  [role='textbox'] {
    // background-color: white;
    // border: 1px solid #d1d5db;
    // border-top: none;
    // border-radius: 0.15rem;
    // border-top-right-radius: 0;
    // border-top-left-radius: 0;
    height: calc(100vh -  ${top}px);
    overflow-y: auto;
  }
`;

  const editorCallback = (callback) => {
    console.log("Editor:editorCallback: ", callback);
    // console.log("Editor:initialMarkdown: ", initialMarkdown);
    setMarkdown(callback);
    // setChanged(callback !== initialMarkdown)
    const { data, content } = matter(callback.trim());
    if (
      content !== initialMarkdown.trim() &&
      enabled
      // context?.branch != reduxCollection?.branch
    ) {
      console.debug("Editor:isEditable");
      setChanged(true);
    } else {
      setChanged(false);
    }
  };

  async function imagePreviewHandler(imageSource) {
    console.log("Editor:imagePreviewHandler: ", context, imageSource);
    const file = path.dirname(context.file) + "/" + imageSource;
    const filePath = file.replace(/^\/|^\.\//, ""); // strip leading slash
    console.log("Editor:imagePreviewHandler:filePath: ", filePath);

    const response = await fetch(
      `/api/content/github/${context.owner}/${context.repo}?branch=${context.branch}&path=${filePath}`
    );
    console.log("Editor:imagePreviewHandler:response: ", response);
    if (!response.ok) {
      throw new Error(
        `Editor:imagePreviewHandler:HTTP error! status: ${response.status}`
      );
    }
    // Fetch the image as Blob directly
    const blob = await response.blob();

    // Create an object URL for the Blob
    const imageObjectUrl = URL.createObjectURL(blob);
    console.log("Editor:imagePreviewHandler:imageObjectUrl: ", imageObjectUrl);
    return imageObjectUrl;
    
  }

  async function imageUploadHandler(image) {
    console.log("Editor:imageUploadHandler: ", context, image);
    const formData = new FormData();
    formData.append("image", image);
    const file =
      path.dirname(context.file) +
      "/" +
      image.name.replace(/[^a-zA-Z0-9.]/g, "").toLowerCase();
    const fileName = image.name.replace(/[^a-zA-Z0-9.]/g, "").toLowerCase();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = async function () {
        const base64Image = reader.result;
        const imageData = base64Image.split(",")[1];
        console.log("Editor:imageUploadHandler:base64Image: ", base64Image);
        try {
          const url = await createFile(
            context.owner,
            context.repo,
            context.branch,
            file,
            fileName,
            imageData,
            "Image uploaded from Airview"
          );
          if (url) {
            resolve(url);
          } else {
            reject("Error uploading image");
          }
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = reject;

      reader.readAsDataURL(image);
    });
  }

  return (
    <EditorStateContext.Provider
      value={{
        changed,
        editorCallback,
        ref,
        reduxCollection,
        context,
        callbackSave,
      }}
    >
      <Paper sx={{ px: "1%" }} elevation={0}>
        <EditorErrorBoundary
          markdown={markdown}
          callbackSave={callbackSave}
          initialMarkdown={initialMarkdown}
          ref={ref}
        >
          <StyledMDXEditor
            ref={ref}
            onChange={editorCallback}
            onError={(msg) => console.warn("Error in markdown: ", msg)}
            markdown={markdown}
            plugins={[
              diffSourcePlugin({
                diffMarkdown: initialMarkdown,
                viewMode: "rich-text",
              }),
              codeBlockPlugin({
                codeBlockEditorDescriptors: [PlainTextCodeEditorDescriptor],
              }),
              headingsPlugin(),
              frontmatterPlugin(),
              listsPlugin(),
              linkPlugin(),
              imagePlugin(),
              linkDialogPlugin(),
              quotePlugin(),
              tablePlugin(),
              thematicBreakPlugin(),
              markdownShortcutPlugin(),
              imagePlugin({
                disableImageResize: true,
                imageUploadHandler: (image) =>
                  Promise.resolve(imageUploadHandler(image)),
                imagePreviewHandler: (imageSource) =>
                  Promise.resolve(imagePreviewHandler(imageSource)),
              }),
              // catchAllPlugin(),

              toolbarPlugin({
                toolbarContents: () => (
                  <>
                    {" "}
                    <UndoRedo />
                    <BlockTypeSelect />
                    <BoldItalicUnderlineToggles />
                    <CreateLink />
                    <InsertTable />
                    <InsertImage />
                    <InsertCodeBlock />
                    <InsertThematicBreak />
                    <InsertFrontmatter />
                    <DiffSourceToggleWrapper />
                  </>
                ),
              }),
            ]}
          />{" "}
          <Fab
            color="primary"
            aria-label="save"
            enabled={changed}
            style={{ position: "fixed", bottom: 16, right: 16 }}
            onClick={() => {
              const text = ref.current?.getMarkdown();
              // console.log("Editor:save: ", text);
              // console.log("Editor:collection: ", reduxCollection);
              callbackSave(text);
            }}
          >
            <SaveIcon />
          </Fab>
        </EditorErrorBoundary>
      </Paper>
    </EditorStateContext.Provider>
  );
}

function SaveButton() {
  const { changed, ref, reduxCollection, context, callbackSave } =
    React.useContext(EditorStateContext);
  return (
    <Button
      key={changed} // Force re-render when `changed` changes
      variant="outlined"
      size="medium"
      disabled={!changed}
      startIcon={<SaveIcon />}
      onClick={() => {
        const text = ref.current?.getMarkdown();
        // console.log("Editor:save: ", text);
        // console.log("Editor:collection: ", reduxCollection);
        callbackSave(text);
      }}
    >
      Save
    </Button>
  );
}

async function createFile(
  owner,
  repo,
  branch,
  file,
  fileName,
  content,
  message
) {
  // use in pages

  // const file = path.basename(path);

  console.debug(
    "Editor:createFile: ",
    owner,
    repo,
    branch,
    file,
    fileName,
    content,
    message
  );
  const filePath = file.replace(/^\/|^\.\//, "");

  // return fileName;

  try {
    const response = await fetch(
      `/api/content/github/${owner}/${repo}?branch=${branch}&path=${filePath}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, message }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Editor:createFile:Commit successful:", data);
    return fileName;
  } catch (e) {
    console.error("Editor:createFile:Error committing file:", e.message);
    return null;
  }
}

class EditorErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // console.error(error);
  }

  render() {
    if (this.state.hasError) {
      // Render an alternative component or message when an error occurs

      return (
        <FallbackEditor
          markdown={this.props.markdown}
          callbackSave={this.props.callbackSave}
          initialMarkdown={this.props.initialMarkdown}
          ref={this.props.ref}
        />
      );

      return (
        <div>
          <h2>Something went wrong:</h2>
          <p>{this.state.error.toString()}</p>
        </div>
      );
      // return <FallbackEditor />;
    }
    return this.props.children;
  }
}

function FallbackMDXeditor({ markdown, callbackSave, initialMarkdown, ref }) {
  return (
    <>
      <MDXEditor
        ref={ref}
        onChange={editorCallback}
        onError={(msg) => console.warn("Error in markdown: ", msg)}
        markdown={markdown}
        plugins={[
          diffSourcePlugin({
            diffMarkdown: initialMarkdown,
            viewMode: "source",
          }),
          codeBlockPlugin({
            codeBlockEditorDescriptors: [PlainTextCodeEditorDescriptor],
          }),
          headingsPlugin(),
          frontmatterPlugin(),
          listsPlugin(),
          linkPlugin(),
          imagePlugin(),
          linkDialogPlugin(),
          quotePlugin(),
          tablePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          // catchAllPlugin(),

          toolbarPlugin({
            toolbarContents: () => (
              <>
                {" "}
                <UndoRedo />
                <BlockTypeSelect />
                <BoldItalicUnderlineToggles />
                <CreateLink />
                <InsertTable />
                <InsertCodeBlock />
                <InsertThematicBreak />
                <InsertFrontmatter />
                <DiffSourceToggleWrapper />
                <SaveButton />
              </>
            ),
          }),
        ]}
      />
      <Fab
        color="primary"
        aria-label="save"
        style={{ position: "fixed", bottom: 16, right: 16, z }}
        onClick={handleSave}
      >
        <SaveIcon />
      </Fab>
    </>
  );
}

function FallbackEditor({ markdown: initialMarkdown, callbackSave }) {
  const [markdown, setMarkdown] = useState(initialMarkdown);

  const handleSave = () => {
    console.log("Content saved");
    callbackSave(markdown);
  };

  return (
    <Grid container direction="column" style={{ height: "calc(100vh - 50px)" }}>
      <Grid item>
        <Alert severity="warning">Using the fallback editor</Alert>
      </Grid>
      <Grid item style={{ flex: 1, overflow: "auto" }}>
        <TextField
          id="outlined-multiline-static"
          multiline
          fullWidth
          variant="outlined"
          // style={{ height: '100%', minHeight: 'calc(100vh - 350px)' }}
          onChange={(event) => setMarkdown(event.target.value)}
          defaultValue={markdown}
          sx={{
            mt: "1%",
            "& .MuiInputBase-input": {
              // height: "100%",
              // overflowY: 'auto',
            },
            "& .MuiInputBase-root": {
              // minHeight: 'calc(100vh - 200px)',
              minHeight: "calc(100vh - 250px)",
              alignItems: "baseline",
            },
          }}
        />
      </Grid>

      <Fab
        color="primary"
        aria-label="save"
        style={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={handleSave}
      >
        <SaveIcon />
      </Fab>
    </Grid>
  );

  return (
    <AsideAndMainContainer>
      {/* <Main sx={{}}> */}
      <Main>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          height="100%"
        >
          <Grid item xs={12}>
            <Grid
              container
              direction="column"
              justifyContent="flex-start"
              alignItems="stretch"
              style={{ display: "flex" }} // Add this line
            >
              <Grid item xs={12}>
                <Alert severity="warning">Using the fallback editor</Alert>
              </Grid>
              <Grid item xs={12} style={{ display: "flex", height: "100%" }}>
                <TextField
                  id="outlined-multiline-static"
                  multiline
                  fullWidth
                  onChange={(event) => setMarkdown(event.target.value)}
                  defaultValue={markdown}
                  variant="outlined"
                  style={{
                    marginTop: "1%",
                    flex: 1,
                    overflow: "auto",
                    boxSizing: "border-box",
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Fab
          color="primary"
          aria-label="save"
          style={{ position: "fixed", bottom: 16, right: 16 }}
          onClick={handleSave}
        >
          <SaveIcon />
        </Fab>
      </Main>
    </AsideAndMainContainer>
  );
}

{
  /* 
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Grid container style={{ flex: 1, overflow: 'hidden' }}>
      <Grid item xs={12}>
        <Alert severity="warning">
          Using the fallback editor
        </Alert>
      </Grid>
      <Grid item xs={12} style={{ flexGrow: 1, overflow: 'auto' }}>
        <TextField
          id="outlined-multiline-static"
          // label="Markdown or MDX"
          multiline
          fullWidth
          onChange={(event) => setMarkdown(event.target.value)}
          defaultValue={markdown}
          variant="outlined"
          style={{ marginTop: "1%", height: '100%', width: '100%', overflow: 'auto', boxSizing: 'border-box' }}
        />
      </Grid>
    </Grid>
  
    <Fab color="primary" aria-label="save" style={{ position: 'fixed', bottom: 16, right: 16 }} onClick={handleSave}>
      <SaveIcon />
    </Fab>
  </div>
  
  ); */
}
