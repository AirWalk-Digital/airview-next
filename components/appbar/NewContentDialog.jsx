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

export function NewContentDialog({
  dialogOpen = false,
  handleDialog,
  initialDropDownData = []
}) {
  const [dropDownData, setDropDownData] = useState(initialDropDownData);
  const [selectedDropDown, setSelectedDropDown] = useState("");
  const [docType, setDocType] = useState("");

  const [parent, setParent] = useState("None");

  const [availableParents, setAvailableParents] = useState([]);
  const [title, setTitle] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

  const docTypes = Object.entries(siteConfig.content)
    .map(([key, item]) => {
      if (item.reference && item.path) {
        return {
          label: item.reference,
          prefix: item.path.split("/").pop(), // Extract the last segment of the path as the prefix
        };
      }
      return null; // Exclude the item from the list
    })
    .filter(Boolean);

  const getParentContentElements = (siteConfig) => {
    const parentContentElements = {};

    Object.entries(siteConfig.content).forEach(([contentType, content]) => {
      if (content.collections) {
        content.collections.forEach((collection) => {
          if (!parentContentElements[collection]) {
            parentContentElements[collection] = [];
          }
          parentContentElements[collection].push(contentType);
          // parentContentElements[collection].unshift('None');
        });
      }
    });

    for (let [key] of Object.entries(parentContentElements)) {
      parentContentElements[key].unshift("None");
    }

    return parentContentElements;
  };

  const parentReference = (siteConfig, parent) => {
    for (let [key, content] of Object.entries(siteConfig.content)) {
      if (key === parent) {
        return content.reference;
      }
    }
    return null;
  };

  const parentContentElements = getParentContentElements(siteConfig);

  // console.log('parentContentElements: ', parentContentElements);
  // // console.log(docTypes);
  // const docTypes = [{ label: 'Solution', prefix: 'solutions' }, { label: 'Design', prefix: 'designs' }, { label: 'Service', prefix: 'services' }, { label: 'Provider', prefix: 'providers' }, { label: 'Knowledge', prefix: 'knowledge' }];

  const handleCreateNew = async () => {
    // console.log('create new pad: ', title, ' / ', selectedDropDown, ' / ', parent);
    let pad = uuidv4(); // Generate a unique padID

    const parentRef = parentReference(siteConfig, parent);
    // console.log('parentRef: ', parentRef);

    let frontmatter;
    if (!parentRef) {
      // define the object for when parent === 'None'
      frontmatter = {
        type: docType,
        title: title,
      };
    } else {
      // define the object for when parent !== 'None'
      frontmatter = {
        type: docType,
        [parentRef.toLowerCase()]: dirname(selectedDropDown.path),
        title: title,
      };
    }
    setIsLoading(true);
  setError(null);
  try {
    if (title) {
      let prName = branchType + '/' + title.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
      await handleDialog({frontmatter: frontmatter});
    }
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
    
  };

  const handleParentChange = async (parent) => {
    setParent(parent);
    setSelectedDropDown("");
    fetch(`/api/structure?collection=${parent}`)
      .then((res) => res.json())
      .then((data) => {
        // const values = data.docs.map((item) => item.frontmatter.title) ?? [];
        const values = data.docs.map(({ file, frontmatter }) => ({
          label: frontmatter.title,
          url: file,
        }));

        console.log('NewContentDialog:handleParentChange:values: ', values)

        setDropDownData(values.sort((a, b) => {
          // Assuming that some objects might not have a 'label' property
          let labelA = a.label || "";
          let labelB = b.label || "";
        
          if (labelA < labelB) {
            return -1; // a comes first
          }
          if (labelA > labelB) {
            return 1; // b comes first
          }
          return 0; // no change in order
        }));
      })
      .catch((error) => {
        // console.log(error)
      });
  };

  const handleDocTypeChange = async (x) => {
    setAvailableParents(parentContentElements[x] ?? []);
    setDocType(x);
    setSelectedDropDown("");
  };

  const handleDropDownChange = (event) => {
    console.log("event.target.value: ", event.target.value);
    setSelectedDropDown(event.target.value);
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={() => handleDialog(null)}
      fullWidth={true}
      maxWidth={"md"}
    >
      <DialogTitle>Create New</DialogTitle>
      <DialogContent>
        {/* Title Input */}
        <Typography variant="subtitle1" gutterBottom>
          Title
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          id="title"
          label="Title"
          type="text"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {/* Parent Buttons */}
        <Typography
          variant="subtitle1"
          gutterBottom
          style={{ marginTop: "20px" }}
        >
          Document Type
        </Typography>
        <ButtonGroup
          variant="outlined"
          color="primary"
          aria-label="outlined primary button group"
        >
          {docTypes.map((docTypeItem, index) => (
            <Button
              key={index} // Add the key prop with a unique identifier
              variant={
                docTypeItem.prefix === docType ? "contained" : "outlined"
              }
              onClick={() => handleDocTypeChange(docTypeItem.prefix)}
            >
              {docTypeItem.label}
            </Button>
          ))}
        </ButtonGroup>

        {/* Document Type Buttons */}
        <Typography
          variant="subtitle1"
          gutterBottom
          style={{ marginTop: "20px" }}
        >
          Select Parent
        </Typography>
        <ButtonGroup
          variant="outlined"
          color="primary"
          aria-label="outlined primary button group"
        >
          {availableParents.map((parentOption) => (
            <Button
              variant={parentOption === parent ? "contained" : "outlined"}
              onClick={() => handleParentChange(parentOption)}
            >
              {parentOption}
            </Button>
          ))}
        </ButtonGroup>

        {/* Dropdown for selected parent */}
        <Typography
          variant="subtitle1"
          gutterBottom
          style={{ marginTop: "20px" }}
        >
          Select Item
        </Typography>
        <FormControl fullWidth>
          <Select value={selectedDropDown} onChange={handleDropDownChange}>
            {dropDownData &&
              dropDownData.map((item, index) => (
                <MenuItem key={index} value={item.url}>
                  {item.label}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
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
