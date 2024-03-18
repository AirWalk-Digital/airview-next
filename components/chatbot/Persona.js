import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

export default function Persona({clearChat, persona, setPersona}) {

  const handleClearChat = () => {
    clearChat();
    // Implement the logic to clear the chat here
    console.log('Chat cleared');
  };

  return (
    <>
    <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
      <Stack direction="row" spacing={2} alignItems="center">
        <Button
          variant={persona === 'jim' ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => setPersona('jim')}
          startIcon={<Avatar alt="Jim" src="/avatars/jim-avatar.png" />}
          sx={{ textTransform: 'none'}}
        >
          Ask Jim
        </Button>
        <Button
          variant={persona === 'abi' ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => setPersona('abi')}
          startIcon={<Avatar alt="Abi" src="/avatars/abi-avatar.png" />}
          sx={{ textTransform: 'none'}}
        >
          Ask Abi
        </Button>
        {/* Uncomment and update path for ChatGPT avatar and persona selection as needed
        <Button
          variant={selectedPersona === 'chatgpt' ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => setSelectedPersona('chatgpt')}
          startIcon={<Avatar alt="ChatGPT" src="/path-to-chatgpt-avatar.jpg" />}
          sx={{ textTransform: 'none'}}
        >
          Ask ChatGPT
        </Button> */}
      </Stack>
      <Tooltip title="Clear Chat">
        <IconButton onClick={handleClearChat}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Box>
    <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" sx={{pt:'5px'}}>
        { persona === 'jim' ? (
          <Typography variant="caption" color="text.secondary">
            Jim can help you with all your technical questions about what we do and how we do it at Airwalk.
          </Typography>
        ) : (
          <Typography variant="caption" color="text.secondary">
            Abi helps you with everything Airwalk, from HR to company culture, our work and more.
          </Typography>
        )}
    </Box>
    </>    
  );
}
