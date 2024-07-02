import {
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useState } from 'react';

interface NewBranchDialogProps {
  dialogOpen: boolean;
  handleDialog: (value: { name?: string } | null) => Promise<void>;
}

export const NewBranchDialog: React.FC<NewBranchDialogProps> = ({
  dialogOpen = false,
  handleDialog,
}) => {
  const [title, setTitle] = useState<string>('');
  const [branchType, setBranchType] = useState<string>('feature');
  const branchTypes: string[] = ['feature', 'bugfix', 'support'];
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateNew = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (title) {
        const prName = `${branchType}/${title
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join('-')}`;
        await handleDialog({ name: prName });
        setTitle(''); // Reset title
      } else {
        setError('Title is required');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBranchTypeChange = (x: string) => {
    setBranchType(x);
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={() => handleDialog(null)}
      fullWidth
      maxWidth='md'
    >
      <DialogTitle>Create new branch</DialogTitle>
      <DialogContent>
        <Typography variant='subtitle1' gutterBottom>
          A branch is a collection of changes to be merged into the main content
          repository. Make a note of the branch name, you will need it to create
          a pull request (a proposal to merge your changes into the main content
          repository).
        </Typography>

        <Typography
          variant='subtitle1'
          gutterBottom
          style={{ marginTop: '20px' }}
        >
          Change Type
        </Typography>
        <ButtonGroup
          variant='outlined'
          color='primary'
          aria-label='outlined primary button group'
        >
          {branchTypes.map((branchTypeItem) => (
            <Button
              key={branchTypeItem}
              variant={branchTypeItem === branchType ? 'contained' : 'outlined'}
              onClick={() => handleBranchTypeChange(branchTypeItem)}
            >
              {branchTypeItem}
            </Button>
          ))}
        </ButtonGroup>

        <Typography variant='subtitle1' style={{ marginTop: '20px' }}>
          Title
        </Typography>
        <TextField
          autoFocus
          margin='dense'
          id='title'
          label='Brief description of the change'
          type='text'
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
      {error && <Alert severity='error'>{error}</Alert>}
    </Dialog>
  );
};
