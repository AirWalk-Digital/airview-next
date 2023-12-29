import React, { useState, useEffect } from "react";

import {
  Toolbar,
  AppBar,
  FormControlLabel,
  Switch,
  IconButton,
  TextField,
  Stack,
  Autocomplete,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import { useSelector, useDispatch } from "react-redux";
import { setBranch } from "@/lib/redux/reducers/branchSlice";
import { ControlBarComponent } from "./ControlBarComponent";
import { NewContentDialog, NewBranchDialog } from "@/components/appbar";
import * as matter from "gray-matter";
import { toSnakeCase } from "@/lib/utils/stringUtils";
import { useRouter } from 'next/navigation'

export function ControlBar({
  open: controlBarOpen,
  height,
  handleEdit,
  handleRefresh,
  handlePrint,
  handlePresentation,
  collection,
  context,
  editMode,
  setControlBarOpen
}) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  // const [controlBarOpen, setControlBarOpen] = useState(open);
  const [isNewBranchOpen, setIsNewBranchOpen] = useState(false);
  // const [context, setContext] = useState(initialContext);
  // const [editMode, setEditMode] = useState(false);
  // const queryBranch = useRouter()?.query?.branch ?? null; // this loads direct links to the content using ?branch=whatever query parameter
  const dispatch = useDispatch();

  const [branches, setBranches] = useState([{ name: "main" }]);
  const router = useRouter()

  // const editFromQuery = useRouter()?.query?.edit ?? null; // ?edit=true query parameter
  // const queryBranch = useRouter()?.query?.branch ?? null; // ?branch=whatever query parameter

  console.debug("ControlBar:context: ", context);
  console.debug("ControlBar:collection: ", collection);
  console.debug("ControlBar:editMode: ", editMode);

  useEffect(() => {
      // run and reprocess the files and branches.
      console.debug("ControlBar:useEffect:context: ", context);
  
      // if (editFromQuery !== null) {
      //   console.debug("ControlBar:editFromQuery: ", editFromQuery);
      //   setEditMode(true);
      //   setControlBarOpen(true)
      // } // set the edit mode from the query parameter ?edit=true
  
      if (
        context &&
        context.branch &&
        collection &&
        collection.branch != context.branch
      ) {
        console.log(
          "ControlBar:queryBranch(in URI): ",
          collection?.branch ?? null, 
          " : ",
          context?.branch ?? null
        );
        // const newContext = { ...context, branch: queryBranch };
        // console.debug("ContentPage:newContext: ", newContext);
  
        // dispatch(setBranch(newContext));
        // handleContentChange(context.file);
        setControlBarOpen(true);
        // setControlBarOpen(true)
        // setChangeBranch(true)
      } // set the branch from the query parameter ?branch=
    }, [context]);
  



  function fetchBranches(collection) {
    const branches = async () => {
      const res = await fetch(
        `/api/repo/get-branches?owner=${collection.owner}&repo=${collection.repo}`
      ); // fetch draft content to add to the menus.
      const data = await res.json();
      setBranches(data);
    };
    branches();
  }
  const onContextUpdate = async (context) => {
    // setContext(context);
    console.debug("ControlBar:onContextUpdate: ", context);
    await dispatch(setBranch(context)); // set the branch

    handleRefresh(); // reset the page
  };
 
  const onAddClicked = (result) => {
    setIsAddOpen(true);
  };


  const onNewBranchClicked = (result) => {
    setIsNewBranchOpen(true);
  };

  const handleNewBranch = async (newBranch) => {
    console.debug("ControlBar:handleNewBranch: ", newBranch);
    setIsNewBranchOpen(false);
  }

  const handleAdd = async (newFile) => {
    let newContent = {};
    if (
      newFile.frontmatter &&
      newFile.frontmatter.title &&
      newFile.frontmatter.type
    ) {
      newContent.frontmatter = newFile.frontmatter;
      newContent.path =
        newFile.frontmatter.type +
        "/" +
        toSnakeCase(newFile.frontmatter.title) +
        "/_index.mdx";
        createFile(
          context.owner,
          context.repo,
          context.branch,
          newContent.path,
          matter.stringify("\n", newContent.frontmatter),
          "New file created from Airview",
          router
        );
        console.debug(
          "ControlBar:handleAdd: ",
          context.owner,
          context.repo,
          context.branch,
          newContent.path,
          matter.stringify("\n", newContent.frontmatter),
          "New file created from Airview"
        );
    }
    
    setIsAddOpen(false);
  };

  return (
    <>
      <ControlBarComponent
        open={controlBarOpen}
        top={height}
        handleEdit={handleEdit}
        handleRefresh={handleRefresh}
        handlePrint={handlePrint}
        handleAdd={onAddClicked}
        handlePresentation={handlePresentation}
        onContextUpdate={onContextUpdate}
        collection={collection}
        context={context}
        branches={branches}
        editMode={editMode}
        fetchBranches={fetchBranches}
        handleNewBranch={onNewBranchClicked}
      />
      <NewContentDialog
        dialogOpen={isAddOpen}
        handleDialog={handleAdd}
      />
       <NewBranchDialog
        dialogOpen={isNewBranchOpen}
        handleDialog={handleNewBranch}
      />
    </>
  );
}
//     return (
//         <AppBar position="fixed" color="white" elevation={0} sx={{ height: height, display: open ? '' : 'none', displayPrint: 'none', borderBottom: 1, borderColor: 'grey.300', top: '64px' }}>
//             <Toolbar sx={{ justifyContent: 'space-between' }}>
//                 <div>
//                     <FormControlLabel control={
//                         <Switch checked={edit} onClick={() => handleEditClick()} />

//                     } label="Edit Mode" />

//                     <FormControlLabel control={
//                         <Switch checked={changeBranch} onClick={() => handleBranchClick()} />

//                     } label="Change Branch" />
//                     {(changeBranch || edit ) && collection && <FormControlLabel control={<BranchSelector defaultBranch={collection.branch} handleBranch={handleBranch} branches={branches} />} label="" />}
//                 </div>
//                 <div>
//                     {handlePrint && <FormControlLabel control={<IconButton
//                         size="large"
//                         onClick={() => handlePrintClick()}
//                         color="primary"
//                     >
//                         <PrintIcon />
//                     </IconButton>} label="Print" />}
//                     {handlePresentation && <FormControlLabel control={<IconButton
//                         size="large"
//                         onClick={() => handlePresentationClick()}
//                         color="primary"
//                     >
//                         <SlideshowIcon />
//                     </IconButton>} label="View Presentation" />}
//                 </div>
//             </Toolbar>
//         </AppBar>
//     )

// }

// function BranchSelector({ defaultBranch, handleBranch, branches }) {
//     const { name: reduxBranch } = useSelector((state) => state.branch);
//     let branch;

//     if (reduxBranch?.name !== 'none') {
//         branch = defaultBranch
//     } else {
//         branch = reduxBranch
//     }

//     return (

//         <Stack spacing={2} sx={{ width: 300 }}>
//             <Autocomplete
//                 id="branch"
//                 size='small'
//                 freeSolo
//                 value={branch}
//                 onChange={handleBranch}
//                 options={branches.map((option) => option.name)}
//                 renderInput={(params) => <TextField {...params} label="Select Branch" />}
//             />
//         </Stack>
//     )

// }

async function createFile(owner, repo, branch, path, content, message, router) {
  // use in pages

  console.debug(
    "lib/github:createFile: ",
    owner,
    repo,
    branch,
    path,
    content,
    message
  );

  try {
    const exists = await fetch(
      `/api/content/github/${owner}/${repo}?branch=${branch}&path=${path}`
    );

    if (exists.ok) {
      const data = await exists.text();
      console.debug("ControlBar:createFile:data", data);
      // router.push('/' + path)
      if (data) {
        throw new Error(`ControlBar:createFile:File creation error. File already exists!`);
        router.push('/' + path + '?edit=true&branch=' + branch)
      } else {
        try {
          const fileContent = content + '\n add content here......'
          const response = await fetch(
            `/api/content/github/${owner}/${repo}?branch=${branch}&path=${path}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ content: fileContent, message }),
            }
          );

          if (!response.ok) {
            throw new Error(`ControlBar:createFile:HTTP error! status: ${response.status}`);
          } else {
            router.push('/' + path + '?edit=true&branch=' + branch)
          }
          const data = await response.json();
          console.log("Commit successful:", data);
        } catch (e) {
          console.error("ControlBar:createFile:Error committing file:", e.message);
        }
      }
    }
  } catch (e) {
    console.error("ControlBar:createFile:Error reading file:", e.message);
  }
}
