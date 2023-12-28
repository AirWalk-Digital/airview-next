import React from 'react';
import IconButton from '@mui/material/IconButton';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import TicketIcon from '@mui/icons-material/ConfirmationNumber';
import { blue } from '@mui/material/colors';

export default function Actions() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
      <IconButton size="small" style={{ color: blue[500] }}>
        <ThumbUpIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" style={{ color: blue[500] }}>
        <ThumbDownIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" style={{ color: blue[500] }}>
        <TicketIcon fontSize="small" />
      </IconButton>
    </div>
  );
}
