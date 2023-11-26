import React, { useState, useEffect, useRef } from 'react';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import Grid from '@mui/material/Grid';
import Message from './Message';
import InputAdornment from '@mui/material/InputAdornment';
import RelatedContent from './RelatedContent';
import Box from '@mui/material/Box';

export function Chatbot() {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const topBarHeight = 65; // Adjust this to match the actual height of your TopBar

  useEffect(() => {
    // Simulate streaming messages
    const interval = setInterval(() => {
      const newMessage = {
        author: Math.random() > 0.5 ? 'bot' : 'human',
        content: 'Sample message. Lorem ipsum, ',
        actions: ['thumb up', 'thumb down', 'log a ticket'],
      };
      setMessages(msgs => [...msgs, newMessage]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    // Implement your send message logic
  };

  return (
    <Grid container sx={{ height: `calc(100vh - ${topBarHeight}px)`, width: '100%', marginTop: `${topBarHeight}px` }}>
      <Grid item xs={4} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ overflowY: 'auto', flexGrow: 1, padding: 2 }}>
          {messages.map((msg, index) => (
            <Message key={index} message={msg} isLast={index === messages.length - 1} />
          ))}
          <div ref={messagesEndRef} />
        </Box>
        <Box sx={{ position: 'sticky', bottom: 0, backgroundColor: 'background.paper', padding: 2 }}>
          <Divider />
          <TextField
            fullWidth
            label="Type a message"
            variant="outlined"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleSendMessage()}>
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Grid>
      <Grid item xs={8} sx={{ overflowY: 'auto', height: '100%', padding: 2 }}>
        <RelatedContent />
      </Grid>
    </Grid>
  );
}
