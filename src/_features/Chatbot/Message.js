// @ts-nocheck
import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { blue, grey } from '@mui/material/colors';
import BotIcon from '@mui/icons-material/Android';
import PersonIcon from '@mui/icons-material/Person';
import Box from '@mui/material/Box';
import JsxParser from 'react-jsx-parser';
import LikeActions from './LikeActions';
import { BarChart } from '../../_components/Widgets/BarChart';
import { LineChart } from '../../_components/Widgets/LineChart';
import { PieChart } from '../../_components/Widgets/PieChart';
import { DoughnutChart } from '../../_components/Widgets/DoughnutChart';

export default function Message({
  message,
  onBotMessageClick,
  selectedBotMessageId,
}) {
  const { messageId, role, content } = message;
  const isBot = role === 'bot';

  // State for thumb up and thumb down actions
  const [thumbState, setThumbState] = useState({});

  const handleLikeActions = (actionType) => {
    setThumbState((prevState) => {
      const currentThumbState = prevState[messageId] || {
        thumbUp: false,
        thumbDown: false,
      };
      let updatedState;

      // Toggle logic
      if (actionType === 'thumbUp') {
        updatedState = {
          ...prevState,
          [messageId]: {
            ...currentThumbState,
            thumbUp: !currentThumbState.thumbUp,
            thumbDown: currentThumbState.thumbUp
              ? currentThumbState.thumbDown
              : false,
          },
        };
      } else if (actionType === 'thumbDown') {
        updatedState = {
          ...prevState,
          [messageId]: {
            ...currentThumbState,
            thumbUp: currentThumbState.thumbDown
              ? currentThumbState.thumbUp
              : false,
            thumbDown: !currentThumbState.thumbDown,
          },
        };
      }

      return updatedState;
    });
  };

  const handleBotMessageClick = () => {
    if (isBot) {
      onBotMessageClick(messageId);
    }
  };

  const avatar = (
    <Avatar
      sx={{ bgcolor: isBot ? blue[500] : grey[500], width: 30, height: 30 }}
    >
      {isBot ? <BotIcon /> : <PersonIcon />}
    </Avatar>
  );

  console.log(content);
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: !isBot ? 'flex-start' : 'flex-end',
        marginY: 2,
      }}
    >
      {!isBot && avatar}
      <Card
        variant="outlined"
        sx={{
          maxWidth: 345,
          borderRadius: '20px',
          // eslint-disable-next-line no-nested-ternary
          bgcolor: isBot
            ? messageId === selectedBotMessageId
              ? blue[100] // Color for the last clicked bot message
              : blue[50] // Color for other bot messages
            : grey[50], // Color for non-bot messages
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
          <JsxParser
            jsx={content}
            components={{ BarChart, LineChart, DoughnutChart, PieChart }}
            onError={(error) => console.error(error)}
          />
        </CardContent>
        {isBot && (
          <LikeActions
            alignment="center"
            thumbUpClicked={thumbState[messageId]?.thumbUp || false}
            thumbDownClicked={thumbState[messageId]?.thumbDown || false}
            handleThumbUpClick={() => handleLikeActions('thumbUp')}
            handleThumbDownClick={() => handleLikeActions('thumbDown')}
          />
        )}
      </Card>
      {isBot && avatar}
    </Box>
  );
}
