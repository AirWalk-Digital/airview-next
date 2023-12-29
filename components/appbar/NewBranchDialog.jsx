import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  ButtonGroup,
  Select,
  MenuItem,
  DialogActions,
  TextField,
} from "@mui/material";
// import * as matter from "gray-matter";
import { v4 as uuidv4 } from "uuid";
import { dirname } from "path";

import { siteConfig } from "../../site.config.js";
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

export function NewBranchDialog({ dialogOpen = false, handleDialog }) {
  const [title, setTitle] = useState("");
  const [branchType, setbranchType] = useState("feature");
  const branchTypes = ["feature", "bugfix", "support"];
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateNew = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (title) {
        let prName = branchType + '/' + title.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
        await handleDialog({ name: prName });
        setTitle(""); // default the title back
      } else {
        setError("Title is required");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlebranchTypeChange = async (x) => {
    setbranchType(x);
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={() => handleDialog(null)}
      fullWidth={true}
      maxWidth={"md"}
    >
      <DialogTitle>Create new branch</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          A branch is a collection of changes to be merged into the main content
          repository. Make a note of the branch name, you will need it to create
          a pull request (a proposal to merge your changes into the main content
          repository).
        </Typography>
        {/* PR Type Buttons */}

        <Typography
          variant="subtitle1"
          gutterBottom
          style={{ marginTop: "20px" }}
        >
          Change Type
        </Typography>
        <ButtonGroup
          variant="outlined"
          color="primary"
          aria-label="outlined primary button group"
        >
          {branchTypes.map((branchTypeItem, index) => (
            <Button
              key={index} // Add the key prop with a unique identifier
              variant={branchTypeItem === branchType ? "contained" : "outlined"}
              onClick={() => handlebranchTypeChange(branchTypeItem)}
            >
              {branchTypeItem}
            </Button>
          ))}
        </ButtonGroup>
        {/* Title Input */}
        <Typography variant="subtitle1" style={{ marginTop: "20px" }}>
          Title
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          id="title"
          label="Brief description of the change"
          type="text"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={() => handleDialog(null)}>Cancel</Button>
        <Button onClick={handleCreateNew} disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : 'Submit'}
        </Button>
      </DialogActions>
      {error && <Alert severity="error">{error}</Alert>}
    </Dialog>
  );
}
