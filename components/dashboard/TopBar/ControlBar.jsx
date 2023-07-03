import React, { useState, useContext } from "react";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Menu as MenuIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { Toolbar, AppBar, FormGroup, FormControlLabel, Switch, IconButton, TextField, Stack, Autocomplete } from '@mui/material';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import CloseIcon from "@mui/icons-material/Close";
import PrintIcon from '@mui/icons-material/Print';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import { styled } from "@mui/material/styles";
// import { siteConfig } from "../../site.config.js";
import {useBranch} from '@/components/content'


export function ControlBar({
    open, height, handleEdit, pageType, handlePrint, handlePresentation, collection }) {
    const [edit, setEdit] = useState(false);

    const [changeBranch, setChangeBranch] = useState(false);

    const { currentBranch, setCurrentBranch } = useBranch();

    
    const handleBranchClick = () => {

        if (changeBranch) {
            setCurrentBranch(collection.repo) // default the branch back
        }
        setChangeBranch(!changeBranch);

    };



    function handleBranch(event, value) {
        // console.log('handleBranch:value: ', value)
        setCurrentBranch(value)
        // setSelectedBranch(value);
    }

    const handlePresentationClick = () => {
        if (typeof handlePresentation === 'function') {
            handlePresentation();
        } else {
            console.error('TopBar: Error: handlePresentation is not a function');
        }
    };
    const handlePrintClick = () => {
        if (typeof handlePrint === 'function') {
            handlePrint();
        } else {
            console.error('TopBar: Error: handlePrint is not a function');
        }
    };

    const handleEditClick = () => {
        // localStorage.setItem('editMode', JSON.stringify(editMode));
        if (typeof handleEdit === 'function') {
            handleEdit(!edit);
            setEdit(!edit)

        } else {
            console.error('TopBar: Error: handleEdit is not a function');
        }
    };

    return (
        <AppBar position="fixed" color="white" elevation={0} sx={{ height: height, display: open ? '' : 'none', displayPrint: 'none', borderBottom: 1, borderColor: 'grey.300', top: '64px' }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <div>
                    <FormControlLabel control={
                        <Switch checked={edit} onClick={() => handleEditClick()} />


                    } label="Edit Mode" />

                    <FormControlLabel control={
                        <Switch checked={changeBranch} onClick={() => handleBranchClick()} />


                    } label="Change Branch" />
                    {changeBranch && collection && <FormControlLabel control={<BranchSelector branch={currentBranch} handleBranch={handleBranch} />} label="" />}
                </div>
                <div>
                    {handlePrint && <FormControlLabel control={<IconButton
                        size="large"
                        onClick={() => handlePrintClick()}
                        color="primary"
                    >
                        <PrintIcon />
                    </IconButton>} label="Print" />}
                    {handlePresentation && <FormControlLabel control={<IconButton
                        size="large"
                        onClick={() => handlePresentationClick()}
                        color="primary"
                    >
                        <SlideshowIcon />
                    </IconButton>} label="View Presentation" />}
                </div>
            </Toolbar>
        </AppBar>
    )

}

function BranchSelector({ handleBranch, branch }) {
    const branches = [
        { name: 'main' },
    ]
    return (

        <Stack spacing={2} sx={{ width: 300 }}>
            <Autocomplete
                id="branch"
                size='small'
                freeSolo
                value={branch}
                onChange={handleBranch}
                options={branches.map((option) => option.name)}
                renderInput={(params) => <TextField {...params} label="Select Branch" />}
            />
        </Stack>
    )

}