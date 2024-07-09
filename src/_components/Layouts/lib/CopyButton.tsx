import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Alert, IconButton, Snackbar } from '@mui/material';
import * as React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

type Props = {
  code: string;
};

export const CopyButton: React.FC<Props> = ({ code }) => {
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const toggleSnackBarOpen = (isOpen: boolean) => setOpenSnackbar(isOpen);

  return (
    <IconButton key='copy-button' size='small' style={{ height: '30px' }}>
      <CopyToClipboard text={code} onCopy={() => toggleSnackBarOpen(true)}>
        <ContentCopyIcon />
      </CopyToClipboard>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => toggleSnackBarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => toggleSnackBarOpen(false)}
          severity='info'
          sx={{ width: '100%' }}
        >
          Copied to clipboard
        </Alert>
      </Snackbar>
    </IconButton>
  );
};
