import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import TicketIcon from '@mui/icons-material/ConfirmationNumber';
import { blue , grey } from '@mui/material/colors';

export default function Actions({ alignment }) {

  const [thumbUpClicked, setThumbUpClicked] = useState(false);
  const [thumbDownClicked, setThumbDownClicked] = useState(false);

  const handleThumbUpClick = () => {
    setThumbUpClicked((prev) => !prev);
    if (thumbDownClicked) {
      setThumbDownClicked(false);
    }
  };

  const handleThumbDownClick = () => {
    setThumbDownClicked((prev) => !prev);
    if (thumbUpClicked) {
      setThumbUpClicked(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: alignment, padding: '10px' }}>
      <IconButton
        size="small"
        style={{
          color: thumbUpClicked ? blue[700] : grey[500],
        }}
        onClick={handleThumbUpClick}
      >
        <ThumbUpIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        style={{
          color: thumbDownClicked ? blue[700] : grey[500],
        }}
        onClick={handleThumbDownClick}
      >
        <ThumbDownIcon fontSize="small" />
      </IconButton>
    </div>
  );
}
