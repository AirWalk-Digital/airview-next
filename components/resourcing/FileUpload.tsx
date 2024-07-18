import { type AlertColor } from '@mui/material/Alert';
import MuiAlert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Snackbar, { type SnackbarCloseReason } from '@mui/material/Snackbar';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';

const Input = styled('input')({
  display: 'none',
});

export const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [open, setOpen] = useState(false);
  // message was unused
  // const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target?.files?.length) {
      return;
    }
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      return;
    }
    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const handleClose = (
    _event: Event | React.SyntheticEvent<any, Event>,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (!file) {
      console.error('No file selected');
      setSeverity('error');
      // setMessage('No file selected');
      setOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/resourcing/demand', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();
      console.log(jsonData);
      setSeverity('success');
      // setMessage('Upload completed');
      setFile(null);
      setFileName('');
    } catch (error) {
      console.error(error);
      setSeverity('error');
      // setMessage('Upload failed');
    } finally {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 5000);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'center',
          p: 2,
        }}
      >
        <Input
          accept='.xls,.xlsx'
          className='contained-button-file'
          id='contained-button-file'
          type='file'
          onChange={handleFileChange}
        />
        <Button variant='contained' component='span'>
          Choose File
        </Button>
        {fileName && (
          <TextField variant='outlined' value={fileName} disabled fullWidth />
        )}
        <Button
          variant='contained'
          color='primary'
          type='submit'
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert
          elevation={6}
          variant='filled'
          onClose={handleClose}
          severity={severity as AlertColor}
          sx={{ width: '100%' }}
        />
      </Snackbar>
    </>
  );
};
