import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

const Input = styled('input')({
  display: 'none',
});

// Alert component for Snackbar
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setFileName(file.name);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      console.error('No file selected');
      setSeverity('error');
      setMessage('No file selected');
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
      setMessage('Upload completed');
      setFile(null);
      setFileName('');
    } catch (error) {
      console.error(error);
      setSeverity('error');
      setMessage('Upload failed');
    } finally {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 5000);
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', p: 2 }}>
        <label htmlFor="contained-button-file">
          <Input accept=".xls,.xlsx" id="contained-button-file" type="file" onChange={handleFileChange} />
          <Button variant="contained" component="span">
            Choose File
          </Button>
        </label>
        {fileName && (
          <TextField
            variant="outlined"
            value={fileName}
            disabled
            fullWidth
          />
        )}
        <Button variant="contained" color="primary" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};
