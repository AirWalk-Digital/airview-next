import 'react-toastify/dist/ReactToastify.css';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { IconButton } from '@mui/material';
import * as React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast, ToastContainer } from 'react-toastify';

type Props = {
  code: string;
};

export const CopyButton: React.FC<Props> = ({ code }) => {
  const notify = () => toast('Copied to clipboard');

  return (
    <IconButton key='copy-button' size='small' style={{ height: '30px' }}>
      <CopyToClipboard text={code} onCopy={notify}>
        <ContentCopyIcon />
      </CopyToClipboard>
      <ToastContainer
        position='top-right'
        autoClose={2000}
        hideProgressBar
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
        theme='light'
      />
    </IconButton>
  );
};
