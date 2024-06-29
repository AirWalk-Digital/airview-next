import AddCircleIcon from '@mui/icons-material/AddCircle';
import ApprovalIcon from '@mui/icons-material/Approval';
import {
  AppBar,
  Autocomplete,
  Button,
  FormControlLabel,
  IconButton,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Toolbar,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { getLogger } from '@/lib/Logger';

const logger = getLogger().child({ namespace: 'ControlBar' });
logger.level = 'error';
export interface ControlBarProps {
  open: boolean;
  // height: number;
  handleEdit?: () => void;
  // handlePrint?: () => void;
  handleAddContent?: () => void;
  // handlePresentation?: () => void;
  collection: any;
  context: any;
  branches: any[];
  top?: number;
  // onContextUpdate: (context: any) => void;
  editMode: boolean;
  // fetchBranches?: (collection: any) => void;
  handleNewBranch?: () => void;
  handlePR?: () => void;
}

interface BranchSelectorProps {
  // onBranchChange: (event: any, value: any) => void;
  branches: any[];
  branch: any;
  collection: any;
}

const BranchSelector: React.FC<BranchSelectorProps> = ({
  // onBranchChange,
  branches,
  branch,
  collection,
}) => {
  let error = false;
  if (collection.branch !== branch) {
    error = false;
  } else {
    error = true;
  }

  const router = useRouter();
  const pathname = usePathname();
  const onBranchChange = (event: any, value: string) => {
    logger.info('handleContextUpdate', { value, event });
    const pathnameArray = pathname.split('/');
    pathnameArray[3] = encodeURIComponent(value);
    const newPathname = pathnameArray.join('/');
    router.push(newPathname);
  };

  return (
    <Stack spacing={2} sx={{ width: 300 }}>
      <Autocomplete
        id='branch'
        size='small'
        freeSolo
        value={branch}
        onChange={onBranchChange}
        options={branches.map((option) => option.name)}
        renderInput={(params) => (
          <TextField
            error={error}
            {...params}
            label={error ? 'Change branch!' : 'Select branch'}
          />
        )}
      />
    </Stack>
  );
};

export const ControlBar: React.FC<ControlBarProps> = ({
  open,
  // height,
  handleEdit,
  // handlePrint,
  handleAddContent,
  // handlePresentation,
  collection,
  context,
  branches,
  top = '64px',
  // onContextUpdate,
  editMode,
  // fetchBranches = () => {},
  handleNewBranch = () => {},
  handlePR = () => {},
}) => {
  const [changeBranch, setChangeBranch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState('');
  const [showPRSuccess, setShowPRSuccess] = useState(false);
  const [branch, setBranch] = useState(context.branch);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (context.branch !== collection.branch) {
      setBranch(context.branch);
      setChangeBranch(true);
    }
  }, [context, collection.branch]);

  const onBranchToggle = async (state = 'ignore') => {
    if (changeBranch) {
      // const newCollection = { ...collection };
      setBranch(collection.branch);
      const pathnameArray = pathname.split('/');
      pathnameArray[3] = encodeURIComponent(collection.branch);
      const newPathname = pathnameArray.join('/');
      router.push(newPathname);
      // onContextUpdate(newCollection);
      // if (typeof window !== 'undefined') {
      //   const url = new URL(window.location.href);
      //   if (url.searchParams.has('branch')) {
      //     url.searchParams.delete('branch');
      //   }
      //   window.history.replaceState({}, document.title, url);
      // }
    }
    setChangeBranch(!changeBranch);
    if (state === 'open') {
      setChangeBranch(true);
    } else if (state === 'close') {
      setChangeBranch(false);
    }
  };

  // const onBranchChange = async (value: any) => {
  //   if (value) {
  //     const newContext = { ...collection, branch: value };
  //     setBranch(value);
  //     onContextUpdate(newContext);
  //   }
  // };

  // const handlePresentationClick = () => {
  //   if (typeof handlePresentation === 'function') {
  //     handlePresentation();
  //   }
  // };

  // const handlePrintClick = () => {
  //   if (typeof handlePrint === 'function') {
  //     handlePrint();
  //   }
  // };

  const handleAddClick = () => {
    if (typeof handleAddContent === 'function') {
      handleAddContent();
    }
  };

  const handlePRClick = async () => {
    setIsLoading(true);
    if (typeof handlePR === 'function') {
      try {
        await handlePR();
        setShowPRSuccess(true);
      } catch (error: any) {
        setShowError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleNewBranchClick = () => {
    if (typeof handleNewBranch === 'function') {
      handleNewBranch();
    }
  };

  const onEditClick = () => {
    if (typeof handleEdit === 'function') {
      handleEdit();
    }
  };

  return (
    <AppBar
      position='fixed'
      color='transparent'
      elevation={0}
      sx={{
        // height,
        display: open ? '' : 'none',
        displayPrint: 'none',
        borderBottom: 1,
        borderColor: 'grey.300',
        top,
        zIndex: 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <div>
          <FormControlLabel
            control={
              <Switch checked={editMode} onClick={() => onEditClick()} />
            }
            label='Edit Mode'
          />
          <FormControlLabel
            control={
              <Switch checked={changeBranch} onClick={() => onBranchToggle()} />
            }
            label='Change Branch'
          />
          {changeBranch && collection && (
            <>
              <FormControlLabel
                control={
                  <BranchSelector
                    // onBranchChange={onBranchChange}
                    branches={branches}
                    branch={branch}
                    collection={collection}
                  />
                }
                label=''
              />
              <FormControlLabel
                control={
                  <IconButton
                    size='medium'
                    onClick={() => handleNewBranchClick()}
                    color='primary'
                    title='Add new branch'
                    // sx={{ pl: 0 }}
                  >
                    <AddCircleIcon />
                  </IconButton>
                }
                label=''
              />
            </>
          )}
          {editMode && changeBranch && collection && (
            <>
              <Button
                variant='outlined'
                onClick={handlePRClick}
                startIcon={
                  isLoading ? <CircularProgress size={24} /> : <ApprovalIcon />
                }
              >
                Raise PR
              </Button>
              <Snackbar
                open={Boolean(showError)}
                autoHideDuration={6000}
                onClose={() => setShowError('')}
              >
                <MuiAlert
                  onClose={() => setShowError('')}
                  severity='error'
                  elevation={6}
                  variant='filled'
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
                  severity='success'
                  elevation={6}
                  variant='filled'
                >
                  PR successfully created
                </MuiAlert>
              </Snackbar>
            </>
          )}
        </div>
        <div>
          <FormControlLabel
            control={
              <IconButton
                size='large'
                onClick={() => handleAddClick()}
                color='primary'
                disabled={!editMode || collection.branch === context.branch}
              >
                <AddCircleIcon />
              </IconButton>
            }
            label='Add Content'
          />
        </div>
      </Toolbar>
    </AppBar>
  );
};
