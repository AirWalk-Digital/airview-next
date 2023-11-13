
import '@mdxeditor/editor/style.css';
import React from 'react';
import { MDXEditor, system, realmPlugin, MdastImportVisitor, codeBlockPlugin, diffSourcePlugin, headingsPlugin, frontmatterPlugin, listsPlugin, linkPlugin, linkDialogPlugin, quotePlugin, tablePlugin, thematicBreakPlugin, markdownShortcutPlugin, useCodeBlockEditorContext, toolbarPlugin, BlockTypeSelect, BoldItalicUnderlineToggles, UndoRedo, InsertTable, InsertCodeBlock, InsertFrontmatter, CreateLink, InsertThematicBreak, DiffSourceToggleWrapper } from '@mdxeditor/editor';
import "@mdxeditor/editor/style.css";
import { $createParagraphNode, $createTextNode, ElementNode } from "lexical";

// const { MDXEditor, codeBlockPlugin, diffSourcePlugin, headingsPlugin, frontmatterPlugin, listsPlugin, linkPlugin, linkDialogPlugin, quotePlugin, tablePlugin, thematicBreakPlugin, markdownShortcutPlugin, useCodeBlockEditorContext, toolbarPlugin, BlockTypeSelect, BoldItalicUnderlineToggles, UndoRedo, InsertTable, InsertCodeBlock, InsertFrontmatter, CreateLink, InsertThematicBreak, DiffSourceToggleWrapper } = await import('@mdxeditor/editor')
import { useState, useRef, createContext } from "react";
import Button from '@mui/material/Button';
const EditorStateContext = createContext();
import store from '@/lib/redux/store'
import { AppBar, Toolbar, IconButton, Typography, MenuItem, Box, Alert, Grid, TextField } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';


const catchAllVisitor = {
  testNode: () => true,

  visitNode: ({ mdastNode, actions, lexicalParent }) => {
    const paragraph = $createParagraphNode();
    // this can be more sophisticated.
    // For example, we can use the mdastNode.type to determine what kind of node we want to create.
    // If you feel like it, you may even convert the mdastNode to html then to plain text
    // this will need additional dependencies, though.
    console.log('mdast:childern: ', mdastNode)
    if (mdastNode.length > 0 ){
    
    paragraph.append($createTextNode(mdastNode.children[0].value));
    } else {
      paragraph.append($createTextNode(mdastNode.value));
    }
    console.log('mdast:paragraph: ', paragraph)

    lexicalParent.append(paragraph);
  }
};

const [catchAllPlugin] = realmPlugin({
  id: "catchAll",
  systemSpec: system(() => ({})),
  init: (realm) => {
    realm.pubKey("addImportVisitor", catchAllVisitor);
  }
});


function FallbackEditor({ markdown, editorCallback }) {

  return (
    <>
      {/* <Box sx={{ flexGrow: 1 }}> */}
      {/* <AppBar position="static"> */}
      {/* <Toolbar variant="dense"> */}
      <Grid container>
        <Grid item xs={10}>
        {/* <Typography variant="p" component="div" sx={{ flexGrow: 1 }}>
        </Typography> */}
        <Alert size="medium" severity="warning">Using the fallback editor</Alert>
        </Grid>
        <Grid item xs={2}>
          <SaveButton/>
          
        </Grid>
      </Grid>
      {/* </Toolbar> */}
      {/* </AppBar> */}
      {/* </Box> */}


      {/* <Alert severity="warning">Using the fallback editor <SaveButton /></Alert> */}
      <TextField
        sx={{
          mt: '2%', height: '100%',
          "& .MuiInputBase-root": {
            height: '100%'
          },
          "& .MuiInputBase-input": {
            height: '100%'
          }
        }}
        id="outlined-multiline-static"
        label="Markdown or MDX"
        multiline
        fullWidth
        onChange={(event) => {
          editorCallback(event.target.value);
        }}
        rows={4}
        defaultValue={markdown}
        height={'100%'}
        inputProps={{
          style: {
            height: '100%'
          }
        }}
      />
    </>

  )

  return (
    <Grid container alignItems="center" spacing={4} style={{ textAlign: 'center' }} sx={{ background: 'rgb(229, 246, 253)', px: '10px', borderRadius: '8px' }}>
      <Grid>
        <Alert severity="warning">Using the fallback editor <SaveButton /></Alert>
      </Grid>
      <Grid>

      </Grid>
      <Grid />
    </Grid>
  )

}


const PlainTextCodeEditorDescriptor = {
  match: () => true,
  priority: 0,
  Editor: (props) => {
    const cb = useCodeBlockEditorContext()
    return (
      <div onKeyDown={(e) => e.nativeEvent.stopImmediatePropagation()}>
        <textarea rows={3} cols={20} defaultValue={props.code} onChange={(e) => cb.setCode(e.target.value)} />
      </div>
    )
  }
}

function Editor({ markdown: initialMarkdown, context }) {
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [changed, setChanged] = useState(false); // enable/disable the save button
  const ref = useRef();
  let collection = context?.path || 'null';
  const currentState = store.getState();
  const reduxCollection = currentState.branch[collection];
  console.log('Editor:context: ', context)
  console.log('Editor:currentState: ', currentState)
  console.log('Editor:reduxCollection: ', reduxCollection)

  const editorCallback = (callback) => {
    console.log('Editor:editorCallback: ', callback)
    console.log('Editor:initialMarkdown: ', initialMarkdown)
    setMarkdown(callback)
    // setChanged(callback !== initialMarkdown)
    if ((callback.trim() !== initialMarkdown.trim()) && (context?.branch != reduxCollection?.branch)) {
      console.debug('Editor:isEditable')
      setChanged(true)


    } else { setChanged(false) }
  }


  return <EditorStateContext.Provider value={{ changed, editorCallback, ref, reduxCollection, context }}>
    <EditorErrorBoundary markdown={markdown} editorCallback={editorCallback}>
      <MDXEditor
        ref={ref}
        onChange={editorCallback}
        markdown={markdown}
        plugins={[
          catchAllPlugin(),
          codeBlockPlugin({ codeBlockEditorDescriptors: [PlainTextCodeEditorDescriptor] }),
          diffSourcePlugin({ diffMarkdown: initialMarkdown, viewMode: 'source' }),
          headingsPlugin(),
          frontmatterPlugin(),
          listsPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          quotePlugin(),
          tablePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          toolbarPlugin({
            toolbarContents: () => (<> <UndoRedo /><BlockTypeSelect /><BoldItalicUnderlineToggles /><CreateLink /><InsertTable /><InsertCodeBlock /><InsertThematicBreak /><InsertFrontmatter />
              <DiffSourceToggleWrapper />
              <SaveButton />
            </>)
          })
        ]}
      />
    </EditorErrorBoundary>
  </EditorStateContext.Provider>
}


function SaveButton() {
  const { changed, ref, reduxCollection, context } = React.useContext(EditorStateContext);
  return (

    <Button key={changed} // Force re-render when `changed` changes
      variant="outlined"
      size="medium"
      disabled={!changed}
      startIcon={<SaveIcon />}
      onClick={() => {
        const text = ref.current?.getMarkdown();
        console.log('Editor:save: ', text)
        console.log('Editor:collection: ', reduxCollection)

      }}>Save</Button>
  )
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
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      // Render an alternative component or message when an error occurs

      return (
        <FallbackEditor markdown={this.props.markdown} editorCallback={this.props.editorCallback}/>
      )

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



export default Editor