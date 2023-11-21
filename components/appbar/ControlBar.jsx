import React, { useState } from "react";

import { Toolbar, AppBar,  FormControlLabel, Switch, IconButton, TextField, Stack, Autocomplete } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import { useSelector, useDispatch } from 'react-redux'
import { setBranch } from '@/lib/redux/reducers/branchSlice'



export function ControlBar({
    open, height, handleEdit, handleRefresh, handlePrint, handlePresentation, collection: initialCollection }) {
    const [edit, setEdit] = useState(false);
    const [collection, setCollection] = useState(initialCollection);

    const [changeBranch, setChangeBranch] = useState(false);

    // const queryBranch = useRouter()?.query?.branch ?? null; // this loads direct links to the content using ?branch=whatever query parameter
    const dispatch = useDispatch()
    
    const [branches, setBranches] = useState([{ name: 'main' }]);

    const handleBranchClick = async (open = 'ignore') => { // handles the toggling of the "Change Branch" selector
        // console.log('handleBranchClick:changeBranch: ', changeBranch)
        if (changeBranch) {
            await dispatch(setBranch(collection)) // default the branch back
            // console.log('handleBranchClick:reset: ', collection.branch)
            handleRefresh(); // reset the page
        } else {
            fetchBranches(collection);
        }
        setChangeBranch(!changeBranch);
        if (open == 'open') { setChangeBranch(true) } else if (open == 'close') { setChangeBranch(false) };
    };

    function fetchBranches(collection) {
        const branches = async () => {
            const res = await fetch(`/api/repo/get-branches?owner=${collection.owner}&repo=${collection.repo}`); // fetch draft content to add to the menus.
            const data = await res.json();
            setBranches(data)
        };
        branches()
    }

    async function handleBranch(event, value) { // handles the branch selector changing
        if (value) {
            
            const newCollection = {...collection, branch: value } 
            console.log('ControlBar:handleBranch:collection: ', collection)

            console.log('ControlBar:handleBranch:newCollection: ', newCollection)
            // await dispatch(setBranch(newCollection))
             await dispatch(setBranch(newCollection))
            
            handleRefresh(); // reset the page
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

    const handleEditClick = () => {
        // localStorage.setItem('editMode', JSON.stringify(editMode));
        if (typeof handleEdit === 'function') {
            handleEdit(!edit);
            if (edit) {handleBranchClick('close')} else {handleBranchClick('open')};
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
                    {(changeBranch || edit ) && collection && <FormControlLabel control={<BranchSelector defaultBranch={collection.branch} handleBranch={handleBranch} branches={branches} />} label="" />}
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

function BranchSelector({ defaultBranch, handleBranch, branches }) {
    const { name: reduxBranch } = useSelector((state) => state.branch);
    let branch;

    if (reduxBranch?.name !== 'none') {
        branch = defaultBranch
    } else {
        branch = reduxBranch
    }

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