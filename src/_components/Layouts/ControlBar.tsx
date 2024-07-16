import AddCircleIcon from '@mui/icons-material/AddCircle';
import ApprovalIcon from '@mui/icons-material/Approval';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import {
  AppBar,
  Autocomplete,
  Button,
  Drawer,
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
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import type { ContentItem } from '@/config';
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
  collection?: ContentItem;
  context?: ContentItem;
  branches: string[];
  top?: number;
  // onContextUpdate: (context: any) => void;
  editMode: boolean;
  // fetchBranches?: (collection: any) => void;
  handleNewBranch?: () => void;
  handlePR?: () => void;
}

interface BranchSelectorProps {
  // onBranchChange: (event: any, value: any) => void;
  branches: string[];
  branch: string;
  collection?: ContentItem;
}

const BranchSelector: React.FC<BranchSelectorProps> = ({
  // onBranchChange,
  branches,
  branch,
  collection,
}) => {
  let error = false;
  if (collection?.branch !== branch) {
    error = false;
  } else {
    error = true;
  }

  const router = useRouter();
  const pathname = usePathname();
  const onBranchChange = (selectedValue: string) => {
    if (!selectedValue) {
      return;
    }
    const pathnameArray = pathname?.split('/') ?? [];
    pathnameArray[3] = encodeURIComponent(selectedValue);
    const newPathname = pathnameArray.join('/');
    router.push(newPathname);
  };

  const favouritesStorageKey = 'favourites';

  const [value, setValue] = useState<{
    isFavourite: boolean;
    name: string;
  } | null>({ name: branch, isFavourite: false });

  const [favourites, setFavourites] = useState<string[]>(() => {
    // Retrieve favourites from localStorage on initial load
    const storedFavourites = localStorage.getItem(favouritesStorageKey);
    return storedFavourites ? JSON.parse(storedFavourites) : [];
  });

  const handleFavourite = (option: { name: string; isFavourite: boolean }) => {
    const isFavourite = favourites.includes(option.name);
    const updatedFavourites = isFavourite
      ? favourites.filter((name) => name !== option.name)
      : [...favourites, option.name];

    setFavourites(updatedFavourites);
    localStorage.setItem(
      favouritesStorageKey,
      JSON.stringify(updatedFavourites)
    );
  };

  // Sort options based on favourites
  const options = branches
    .map((option) => ({
      isFavourite: favourites.includes(option),
      name: option,
    }))
    .sort(
      (a, b) =>
        (favourites.includes(b.name) ? 1 : -1) -
        (favourites.includes(a.name) ? 1 : -1)
    );

  useEffect(() => {
    options.sort(
      (a, b) =>
        (favourites.includes(b.name) ? 1 : -1) -
        (favourites.includes(a.name) ? 1 : -1)
    );
  }, [favourites, options]);

  return (
    <Stack spacing={2} sx={{ width: 300 }}>
      <Autocomplete
        id='branch'
        size='small'
        value={value}
        onChange={(_event, newValue) => {
          setValue(newValue);
          onBranchChange(newValue?.name ?? '');
        }}
        options={options}
        getOptionLabel={(option) => option.name}
        renderOption={(props, option) => (
          <li
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            {...props}
          >
            <div
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {option.name}
            </div>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleFavourite(option);
              }}
            >
              {favourites.includes(option.name) ? (
                <StarIcon />
              ) : (
                <StarBorderIcon />
              )}
            </IconButton>
          </li>
        )}
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
  const [branch, setBranch] = useState(context?.branch);
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  // Use useMediaQuery hook to check for screen width
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  useEffect(() => {
    if (context?.branch !== collection?.branch) {
      setBranch(context?.branch);
      setChangeBranch(true);
    }
  }, [context, collection?.branch]);

  const onBranchToggle = async (state = 'ignore') => {
    if (changeBranch) {
      // const newCollection = { ...collection };
      setBranch(collection?.branch);
      const pathnameArray = pathname?.split('/') ?? [];
      pathnameArray[3] = encodeURIComponent(collection?.branch ?? '');
      const newPathname = pathnameArray.join('/');
      router.push(newPathname);
    }
    setChangeBranch(!changeBranch);
    if (state === 'open') {
      setChangeBranch(true);
    } else if (state === 'close') {
      setChangeBranch(false);
    }
  };

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
  const [drawerState, setDrawerState] = React.useState(false);
  const toggleDrawer =
    (openDrawer: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setDrawerState(openDrawer);
    };

  const controlMenu = (
    <Stack direction={isMobile ? 'column' : 'row'} spacing={2} sx={{ px: 1 }}>
      {drawerState && ( // Assuming `isMenuOpen` controls the visibility of the menu
        <IconButton
          aria-label='Close menu'
          onClick={() => setDrawerState(false)}
          sx={{ position: 'absolute', top: 8, right: 8 }}
          size='small'
        >
          <CloseIcon />
        </IconButton>
      )}
      <FormControlLabel
        control={<Switch checked={editMode} onClick={() => onEditClick()} />}
        label='Edit Mode'
      />
      <FormControlLabel
        control={
          <Switch checked={changeBranch} onClick={() => onBranchToggle()} />
        }
        label='Change Branch'
      />
      {changeBranch && collection && (
        <Stack direction='row' spacing={1} sx={{ px: 1 }}>
          <FormControlLabel
            control={
              <BranchSelector
                // onBranchChange={onBranchChange}
                branches={branches}
                branch={branch ?? ''}
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
        </Stack>
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

      <FormControlLabel
        control={
          <IconButton
            size='large'
            onClick={() => handleAddClick()}
            color='primary'
            disabled={!editMode || collection?.branch === context?.branch}
          >
            <AddCircleIcon />
          </IconButton>
        }
        label='Add Content'
      />
    </Stack>
  );

  if (isMobile) {
    const anchor = 'right';
    return (
      <>
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
          {' '}
          <Button size='small' onClick={toggleDrawer(true)}>
            Edit Menu
          </Button>
        </AppBar>
        <Drawer
          anchor={anchor}
          open={drawerState}
          onClose={toggleDrawer(false)}
        >
          {controlMenu}
        </Drawer>
      </>
    );
  }
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
                    branch={branch ?? ''}
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
                disabled={!editMode || collection?.branch === context?.branch}
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
