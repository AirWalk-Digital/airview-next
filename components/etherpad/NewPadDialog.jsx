
import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FormControl, Link, Dialog, DialogTitle, DialogContent, ButtonGroup, DialogContentText, Select, MenuItem, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import * as matter from 'gray-matter';
import { v4 as uuidv4 } from 'uuid';
import { dirname } from 'path';

import { siteConfig } from "../../site.config.js";

export function NewPadDialog({ dialogOpen, handleDialog, siteContent }) {

    const [dropDownData, setDropDownData] = useState([]);
    const [selectedDropDown, setSelectedDropDown] = useState('');
    const [docType, setDocType] = useState('');

    const [parent, setParent] = useState('None');

    const [availableParents, setAvailableParents] = useState([]);
    const [title, setTitle] = useState('');


    const parents = ['None', 'Solution', 'Design', 'Service', 'Provider'];

    const docTypes = Object.entries(siteConfig.content).map(([key, item]) => {
        if (item.reference && item.path) {
            return {
                label: item.reference,
                prefix: item.path.split('/').pop() // Extract the last segment of the path as the prefix
            };
        }
        return null; // Exclude the item from the list
    }).filter(Boolean);

    const getParentContentElements = (siteConfig) => {
        const parentContentElements = {};

        Object.entries(siteConfig.content).forEach(([contentType, content]) => {
            if (content.collections) {
                content.collections.forEach((collection) => {
                    if (!parentContentElements[collection]) {
                        parentContentElements[collection] = [];
                    }
                    parentContentElements[collection].push(contentType);
                });
            }
        });

        return parentContentElements;
    };

    const parentContentElements = getParentContentElements(siteConfig);

    // console.log('parentContentElements: ', parentContentElements);
    // // console.log(docTypes);
    // const docTypes = [{ label: 'Solution', prefix: 'solutions' }, { label: 'Design', prefix: 'designs' }, { label: 'Service', prefix: 'services' }, { label: 'Provider', prefix: 'providers' }, { label: 'Knowledge', prefix: 'knowledge' }];


    const handleCreateNew = async () => {
        // console.log('create new pad: ', title, ' / ', selectedDropDown, ' / ', parent);
        let pad = uuidv4();  // Generate a unique padID



        let frontmatter;
        if (parent === 'None') {
            // define the object for when parent === 'None'
            frontmatter = {
                type: docType,
                title: title
            };
        } else {
            // define the object for when parent !== 'None'
            frontmatter = {
                type: docType,
                [parent.toLowerCase()]: dirname(selectedDropDown),
                title: title
            };
        }
        const initialContent = matter.stringify('\n', frontmatter);

        try {
            const response = await fetch(`/api/etherpad/new?padID=${pad}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ initialContent }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                setTitle('');
                handleDialog();
            }

        } catch (error) {
            console.error('Error:', error);
        }


    };

    const handleParentChange = async (parent) => {
        setParent(parent);
        fetch(`/api/structure?collection=${parent}`)
            .then((res) => res.json())
            .then(data => {

                // const values = data.docs.map((item) => item.frontmatter.title) ?? [];
                const values = data.docs.map(({ file, frontmatter }) => ({
                    label: frontmatter.title,
                    url: file
                }));


                // console.log('setDropDownData: ', values)

                setDropDownData(values);
            })
            .catch(error => {
                // console.log(error)
            })
    };

    const handleDocTypeChange = async (x) => {
        setAvailableParents(parentContentElements[x] ?? [])
        setDocType(x);
    };

    const handleDropDownChange = (event) => {
        setSelectedDropDown(event.target.value);
    };



    return (
        <Dialog open={dialogOpen} onClose={handleDialog}>
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
                <Typography variant="subtitle1" gutterBottom style={{ marginTop: '20px' }}>
                    Document Type
                </Typography>
                <ButtonGroup variant="outlined" color="primary" aria-label="outlined primary button group">
                    {docTypes.map((docTypeItem, index) => (
                        <Button
                            key={index} // Add the key prop with a unique identifier
                            variant={docTypeItem.prefix === docType ? "contained" : "outlined"}
                            onClick={() => handleDocTypeChange(docTypeItem.prefix)}
                        >
                            {docTypeItem.label}
                        </Button>
                    ))}

                </ButtonGroup>



                {/* Document Type Buttons */}
                <Typography variant="subtitle1" gutterBottom style={{ marginTop: '20px' }}>
                    Select Parent
                </Typography>
                <ButtonGroup variant="outlined" color="primary" aria-label="outlined primary button group">
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
                <Typography variant="subtitle1" gutterBottom style={{ marginTop: '20px' }}>
                    Select Item
                </Typography>
                <FormControl fullWidth>
                    <Select
                        value={selectedDropDown}
                        onChange={handleDropDownChange}
                    >
                        {dropDownData && dropDownData.map((item, index) => (
                            <MenuItem key={index} value={item.url}>{item.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleDialog}>
                    Cancel
                </Button>
                <Button onClick={handleCreateNew}>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
}