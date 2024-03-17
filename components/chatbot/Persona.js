import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

export default function Persona() {
  const [selectedPersona, setSelectedPersona] = useState('jim');

  const handleClearChat = () => {
    // Implement the logic to clear the chat here
    console.log('Chat cleared');
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
      <Stack direction="row" spacing={2} alignItems="center">
        <Button
          variant={selectedPersona === 'jim' ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => setSelectedPersona('jim')}
          startIcon={<Avatar alt="Jim" src="/path-to-jim-avatar.jpg" />}
          sx={{ textTransform: 'none'}}
        >
          Ask Jim
        </Button>
        <Button
          variant={selectedPersona === 'abi' ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => setSelectedPersona('abi')}
          startIcon={<Avatar alt="Abi" src="/path-to-abi-avatar.jpg" />}
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
  );
}
