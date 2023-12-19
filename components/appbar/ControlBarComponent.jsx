import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'

import { Toolbar, AppBar,  FormControlLabel, Switch, IconButton, TextField, Stack, Autocomplete } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import AddCircleIcon from '@mui/icons-material/AddCircle';
// import { useSelector, useDispatch } from 'react-redux'
// import { setBranch } from '@/lib/redux/reducers/branchSlice'



export function ControlBarComponent({
    open, height, handleEdit, handlePrint, handleAdd, handlePresentation, collection, context, branches, top='64px', onContextUpdate, fetchBranches = () => {} }, editMode) {
    const [edit, setEdit] = useState(editMode);
    // const [collection, setCollection] = useState(initialCollection);

    const [changeBranch, setChangeBranch] = useState(context.branch != collection.branch);
    console.log('ControlBarComponent:context: ', context)
    console.log('ControlBarComponent:changeBranch: ', changeBranch)
    console.log('ControlBarComponent:collection: ', collection)


    const [branch, setBranch] = useState(context.branch);

    const onBranchToggle = async (open = 'ignore') => { // handles the toggling of the "Change Branch" selector
        console.log('ControlBarComponent:onBranchToggle:changeBranch: ', changeBranch)
        console.log('ControlBarComponent:onBranchToggle:collection: ', collection)
        if (changeBranch) {
            const newCollection = {...collection } // default the branch back
            setBranch(collection.branch)
            onContextUpdate(newCollection)
        } else {
            fetchBranches(collection);
        }
        setChangeBranch(!changeBranch);
        if (open == 'open') { setChangeBranch(true) } else if (open == 'close') { setChangeBranch(false) };
    };
    
    async function onBranchChange(event, value) { // handles the branch selector changing
        if (value) {
            
            const newContext = {...collection, branch: value } 
            console.log('ControlBarComponent:handleBranch:collection: ', collection)
            setBranch(value)
            console.log('ControlBarComponent:handleBranch:newContext: ', newContext)
            // await dispatch(setBranch(newCollection))
            //  await dispatch(setBranch(newCollection))
            onContextUpdate(newContext)
            // handleRefresh(); // reset the page
        }
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

    const handleAddClick = () => {
        if (typeof handleAdd === 'function') {
            handleAdd();
        } else {
            console.error('TopBar: Error: handleAdd is not a function');
        }
    };

    const onEditClick = () => { // onEdit
        // localStorage.setItem('editMode', JSON.stringify(editMode));
        if (typeof handleEdit === 'function') {
            handleEdit(!edit);
            // if (edit) {onBranchToggle('close')} else {onBranchToggle('open')}; // show / hide the branch selector
            // if (edit) {setChangeBranch(false)} else {setChangeBranch(true)}; // show / hide the branch selector
            if (!edit) {
                fetchBranches(collection);
                setChangeBranch(true)
            }; // show / hide the branch selector

            setEdit(!edit)

        } else {
            console.error('TopBar: Error: handleEdit is not a function');
        }
    };

    return (
        <AppBar position="fixed" color="white" elevation={0} sx={{ height: height, display: open ? '' : 'none', displayPrint: 'none', borderBottom: 1, borderColor: 'grey.300', top: top }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <div>
                    <FormControlLabel control={
                        <Switch checked={edit} onClick={() => onEditClick()} />


                    } label="Edit Mode" />

                    <FormControlLabel control={
                        <Switch checked={changeBranch} onClick={() => onBranchToggle()} />


                    } label="Change Branch" />
                    {  changeBranch && collection && <FormControlLabel control={<BranchSelector onBranchChange={onBranchChange} branches={branches} branch={branch} />} label="" />}
                </div>
                <div>
                {edit && (collection.branch !== context.branch) && <FormControlLabel control={<IconButton
                        size="large"
                        onClick={() => handleAddClick()}
                        color="primary"
                    >
                        <AddCircleIcon />
                    </IconButton>} label="Add" />}
                    {handlePrint && !edit && <FormControlLabel control={<IconButton
                        size="large"
                        onClick={() => handlePrintClick()}
                        color="primary"
                    >
                        <PrintIcon />
                    </IconButton>} label="Print" />}
                    {handlePresentation && !edit && <FormControlLabel control={<IconButton
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

function BranchSelector({ onBranchChange, branches, branch }) {
    // const { name: reduxBranch } = useSelector((state) => state.branch);
    // let branch;
    console.debug('BranchSelector:branch: ', branch)
    // if (reduxBranch?.name !== 'none') {
    //     branch = defaultBranch
    // } else {
    //     branch = reduxBranch
    // }

    return (

        <Stack spacing={2} sx={{ width: 300 }}>
            <Autocomplete
                id="branch"
                size='small'
                freeSolo
                value={branch}
                onChange={onBranchChange}
                options={branches.map((option) => option.name)}
                renderInput={(params) => <TextField {...params} label="Select Branch" />}
            />
        </Stack>
    )

}