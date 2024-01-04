import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

import {
  Toolbar,
  AppBar,
  FormControlLabel,
  Switch,
  IconButton,
  TextField,
  Stack,
  Autocomplete,
  Button,
  Snackbar,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import AddCircleIcon from "@mui/icons-material/AddCircle";
// import { useSelector, useDispatch } from 'react-redux'
// import { setBranch } from '@/lib/redux/reducers/branchSlice'
import ApprovalIcon from "@mui/icons-material/Approval";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

export function ControlBarComponent({
  open,
  height,
  handleEdit,
  handlePrint,
  handleAdd,
  handlePresentation,
  collection,
  context,
  branches,
  top = "64px",
  onContextUpdate,
  editMode,
  fetchBranches = () => {},
  handleNewBranch = () => {},
  handlePR = () => {},
}) {
  // const [edit, setEdit] = useState(editMode);
  // const [collection, setCollection] = useState(initialCollection);

  const [changeBranch, setChangeBranch] = useState(false);
  console.log("ControlBarComponent:context: ", context);
  console.log("ControlBarComponent:changeBranch: ", changeBranch);
  console.log("ControlBarComponent:collection: ", collection);
  console.log("ControlBarComponent:editMode: ", editMode);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState("");
  const [showPRSuccess, setShowPRSuccess] = useState(false);

  useEffect(() => {
    if (context.branch != collection.branch) {
      setBranch(context.branch);
      setChangeBranch(true);
    }
  }, [context]);

  const [branch, setBranch] = useState(context.branch);

  const onBranchToggle = async (open = "ignore") => {
    // handles the toggling of the "Change Branch" selector
    console.log(
      "ControlBarComponent:onBranchToggle:changeBranch: ",
      changeBranch
    );
    console.log("ControlBarComponent:onBranchToggle:collection: ", collection);
    if (changeBranch) {
      const newCollection = { ...collection }; // default the branch back
      setBranch(collection.branch);
      onContextUpdate(newCollection);
      if (typeof window !== "undefined") {
        let url = new URL(window.location.href);

        // If there is a 'branch' query parameter, delete it
        if (url.searchParams.has("branch")) {
          url.searchParams.delete("branch");
        }

        window.history.replaceState({}, document.title, url);
      }
    } else {
      fetchBranches(collection);
    }
    setChangeBranch(!changeBranch);
    if (open == "open") {
      setChangeBranch(true);
    } else if (open == "close") {
      setChangeBranch(false);
    }
  };

  async function onBranchChange(event, value) {
    // handles the branch selector changing
    if (value) {
      const newContext = { ...collection, branch: value };
      console.log("ControlBarComponent:handleBranch:collection: ", collection);
      setBranch(value);
      console.log("ControlBarComponent:handleBranch:newContext: ", newContext);
      // await dispatch(setBranch(newCollection))
      //  await dispatch(setBranch(newCollection))
      onContextUpdate(newContext);
      // handleRefresh(); // reset the page
    }
    // setSelectedBranch(value);
  }

  const handlePresentationClick = () => {
    if (typeof handlePresentation === "function") {
      handlePresentation();
    } else {
      console.error("ControlBar: Error: handlePresentation is not a function");
    }
  };
  const handlePrintClick = () => {
    if (typeof handlePrint === "function") {
      handlePrint();
    } else {
      console.error("ControlBar: Error: handlePrint is not a function");
    }
  };

  const handleAddClick = () => {
    if (typeof handleAdd === "function") {
      handleAdd();
    } else {
      console.error("ControlBar: Error: handleAdd is not a function");
    }
  };

  const handlePRClick = async () => {
    setIsLoading(true);
    if (typeof handlePR === "function") {
      try {
        // Replace this with your actual function
        await handlePR();
        setShowPRSuccess(true);
      } catch (error) {
        setShowError(error.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.error("ControlBar: Error: handlePR is not a function");
    }
  };

  const handleNewBranchClick = () => {
    if (typeof handleNewBranch === "function") {
      handleNewBranch();
    } else {
      console.error("TopBar: Error: handleNewBranch is not a function");
    }
  };

  const onEditClick = () => {
    // onEdit
    console.debug("ControlBarComponent:onEditClick");
    // localStorage.setItem('editMode', JSON.stringify(editMode));
    if (typeof handleEdit === "function") {
      handleEdit(!editMode);
      // if (edit) {onBranchToggle('close')} else {onBranchToggle('open')}; // show / hide the branch selector
      // if (edit) {setChangeBranch(false)} else {setChangeBranch(true)}; // show / hide the branch selector
      if (!editMode) {
        fetchBranches(collection);
        setChangeBranch(true);
      } // show / hide the branch selector

      // setEdit(!edit)
    } else {
      console.error("TopBar: Error: handleEdit is not a function");
    }
  };

  return (
    <AppBar
      position="fixed"
      color="white"
      elevation={0}
      sx={{
        height: height,
        display: open ? "" : "none",
        displayPrint: "none",
        borderBottom: 1,
        borderColor: "grey.300",
        top: top,
        zIndex: 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <div>
          <FormControlLabel
            control={
              <Switch checked={editMode} onClick={() => onEditClick()} />
            }
            label="Edit Mode"
          />

          <FormControlLabel
            control={
              <Switch checked={changeBranch} onClick={() => onBranchToggle()} />
            }
            label="Change Branch"
          />
          {changeBranch && collection && (
            <>
              <FormControlLabel
                control={
                  <BranchSelector
                    sx={{ zIndex: 999 }}
                    onBranchChange={onBranchChange}
                    branches={branches}
                    branch={branch}
                    collection={collection}
                  />
                }
                label=""
              />
              <FormControlLabel
                control={
                  <IconButton
                    size="medium"
                    onClick={() => handleNewBranchClick()}
                    color="primary"
                    sx={{ pl: 0 }}
                  >
                    <AddCircleIcon />
                  </IconButton>
                }
                label=""
              /></>)}
         {editMode && changeBranch && collection && (
        <>    
              <Button
                variant="outlined"
                onClick={handlePRClick}
                startIcon={
                  isLoading ? <CircularProgress size={24} /> : <ApprovalIcon />
                }
              >
                Raise PR
              </Button>
              <Snackbar
                open={showError}
                autoHideDuration={6000}
                onClose={() => setShowError("")}
              >
                <MuiAlert
                  onClose={() => setShowError("")}
                  severity="error"
                  elevation={6}
                  variant="filled"
                >
                  An error occurred while processing your request: {showError}
                </MuiAlert>
              </Snackbar>
              <Snackbar
                open={showPRSuccess}
                autoHideDuration={6000}
                onClose={() => setShowPRSuccess(false)}
              >
                <MuiAlert
                  onClose={() => setShowPRSuccess(false)}
                  severity="success"
                  elevation={6}
                  variant="filled"
                >
                  PR successfully created
                </MuiAlert>
              </Snackbar>
            </>
          )}
        </div>
        <div>
          {editMode && collection.branch !== context.branch && (
            <FormControlLabel
              control={
                <IconButton
                  size="large"
                  onClick={() => handleAddClick()}
                  color="primary"
                >
                  <AddCircleIcon />
                </IconButton>
              }
              label="Add Content"
            />
          )}
          {handlePrint && !editMode && (
            <FormControlLabel
              control={
                <IconButton
                  size="large"
                  onClick={() => handlePrintClick()}
                  color="primary"
                >
                  <PrintIcon />
                </IconButton>
              }
              label="Print"
            />
          )}
          {handlePresentation && !editMode && (
            <FormControlLabel
              control={
                <IconButton
                  size="large"
                  onClick={() => handlePresentationClick()}
                  color="primary"
                >
                  <SlideshowIcon />
                </IconButton>
              }
              label="View Presentation"
            />
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}

function BranchSelector({ onBranchChange, branches, branch, collection }) {
  // const { name: reduxBranch } = useSelector((state) => state.branch);
  // let branch;
  console.debug("BranchSelector:branch: ", branch);
  // if (reduxBranch?.name !== 'none') {
  //     branch = defaultBranch
  // } else {
  //     branch = reduxBranch
  // }
  let error = false;
  if (collection.branch != branch) {
    error = false;
  } else {
    error = true;
  }

  return (
    <Stack spacing={2} sx={{ width: 300 }}>
      <Autocomplete
        id="branch"
        size="small"
        freeSolo
        value={branch}
        onChange={onBranchChange}
        options={branches.map((option) => option.name)}
        renderInput={(params) => (
          <TextField
            error={error}
            {...params}
            label={error ? "Change branch!" : "Select branch"}
          />
        )}
      />
    </Stack>
  );
}
