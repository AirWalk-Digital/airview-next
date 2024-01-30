import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { blue, grey } from '@mui/material/colors';
import BotIcon from '@mui/icons-material/Android';
import PersonIcon from '@mui/icons-material/Person';
import Actions from './Actions';
import Box from '@mui/material/Box';

export default function Message({ message, isLast, onBotMessageClick }) {
  const { id, role, content } = message;
  const isBot = role === 'bot';

  const [isContentExpanded, setIsContentExpanded] = useState(false);

  const handleBotMessageClick = () => {
    if (isBot) {
      setIsContentExpanded(!isContentExpanded);
      onBotMessageClick(id);
    }
  };

  const avatar = (
    <Avatar sx={{ bgcolor: isBot ? blue[500] : grey[500], width: 30, height: 30 }}>
      {isBot ? <BotIcon /> : <PersonIcon />}
    </Avatar>
  );

  return (
    <Box sx={{ display: 'flex', justifyContent: !isBot ? 'flex-start' : 'flex-end', marginY: 2 }}>
      {!isBot && avatar}
      <Card
        variant="outlined"
        sx={{
          maxWidth: 345,
          borderRadius: '20px',
          bgcolor: isBot ? blue[50] : grey[50],
          marginLeft: isBot ? 0 : 1,
          marginRight: isBot ? 1 : 0,
          elevation: 0, // Removes the drop shadow
          cursor: isBot ? 'pointer' : 'auto', // Add cursor pointer for bot messages
        }}
        onClick={handleBotMessageClick} // Attach click event handler
      >
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {content}
          </Typography>
        </CardContent>
        {isLast && <Actions />}
      </Card>
      {isBot && avatar}
    </Box>
  );
}
