import React, { useState, useEffect, useRef } from "react";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import Grid from "@mui/material/Grid";
import Message from "./Message";
import InputAdornment from "@mui/material/InputAdornment";
import RelatedContent from "./RelatedContent";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ClearIcon from '@mui/icons-material/Clear';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import SaveAltIcon from '@mui/icons-material/SaveAlt';


import Persona from "./Persona";
// import Avatar from '@mui/material/Avatar';
// import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Avatar from '@mui/material/Avatar';

export function Chatbot() {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const topBarHeight = 65; // Adjust this to match the actual height of your TopBar
  const endpoint = "/api/chat"; // Replace with your API endpoint
  const [relevantDocs, setRelevantDocs] = useState([]);
  // const jsonDelimiter = '###%%^JSON-DELIMITER^%%###'; // should be same as that in route.js and to be updated to extract from env
  const jsonDelimiter = ',';
  const [selectedBotMessageId, setSelectedBotMessageId] = useState(null);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [showClearChatRect, setShowClearChatRect] = useState(false);
  const [showSaveChatRect, setShowSaveChatRect] = useState(false);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // Check if the last message is from a bot and automatically click it
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'bot') {
      handleBotMessageClick(lastMessage.messageId);
    }
  }, [messages]);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!input.trim()) return; // Prevent sending empty messages
    setIsLoading(true);
  
    const userMessage = {
      messageId: `user-${Date.now()}`,
      content: input,
      role: "user",
    };
  
    setMessages((prevMessages) => [...prevMessages, userMessage]);
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
  
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
  
      const reader = response.body.getReader();
      let decoder = new TextDecoder();
      
      const processChunk = async () => {
        const { value, done } = await reader.read();
        if (done) {
          setIsLoading(false);
          return;
        }
      
        let jsonString = decoder.decode(value, { stream: true }).trim();
      
        // Check if jsonString is not empty before attempting to parse
        if (jsonString) {
          // Check if jsonString ends with the delimiter
          if (jsonString.endsWith(jsonDelimiter)) {
            // Remove the delimiter from the end
            jsonString = jsonString.slice(0, -jsonDelimiter.length);
          }
          // console.log('jsonString:', jsonString);
          // const jsonObjects = jsonString.split(jsonDelimiter);
          // const jsonObjects = jsonString.split('}' + jsonDelimiter + '{');
          const jsonObjects = JSON.parse('[' + jsonString + ']');
          // console.log('jsonObjects:', jsonObjects);

          // Check if jsonObjects is an array. If not, wrap it in an array.
          // const jsonArray = Array.isArray(jsonObjects) ? jsonObjects : [jsonObjects];

          jsonObjects.forEach(jsonObject => {

            try {
              // const parsedObject = JSON.parse(jsonObject);
              const parsedObject = jsonObject;
              // Handling MessageStream type
              if (parsedObject.type === 'MessageStream') {
                const { content, messageId, role } = parsedObject;
                setMessages((prevMessages) => {
                  const existingMessageIndex = prevMessages.findIndex((msg) => msg.messageId === messageId);
      
                  if (existingMessageIndex !== -1) {
                    // If message with the same id exists, update its content
                    const updatedMessages = [...prevMessages];
                    updatedMessages[existingMessageIndex] = {
                      ...updatedMessages[existingMessageIndex],
                      content: updatedMessages[existingMessageIndex].content + content,
                    };
                    return updatedMessages;
                  } else {
                    // If message with the same id doesn't exist, create a new message
                    return [...prevMessages, { content, messageId, role }];
                  }
                });
              } else if (parsedObject.type === 'RelevantDocs') {
                // Handling RelevantDocsSources type
                // Set the relevant documents data in the state
                setRelevantDocs((prevDocs) => [...prevDocs, parsedObject]);
              }
            } catch (error) {
              console.error('Error parsing JSON object:', error);
            }
          });
        }
      
        // Process next chunk
        processChunk();
      };
      

      // Start processing the stream
      processChunk();
  
    } catch (error) {
      setErrorMessage(`Failed to send message: ${error.message}`);
      setOpenSnackbar(true);
      setIsLoading(false);
    } finally {
      setInput("");
    }
  };
  

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  // Update the prop for onBotMessageClick
  const handleBotMessageClick = (botMessageId) => {
    setSelectedBotMessageId(botMessageId);
  };

  const clearChat = () => {
    setOpenConfirmationDialog(true);
  };

  const handleSaveAndClearConfirmation = () => {
    handleSaveChat();
    //clearChat();//to be enabled after updated
    setOpenConfirmationDialog(false); //to be removed after updated    
  };
  const saveChat = () => {
    handleSaveChat();
  }
  const handleSaveChat = () => {

  };

  const handleClearConfirmation = () => {
    setMessages([]);
    setInput("");
    setIsLoading(false);
    setRelevantDocs([]);
    setSelectedBotMessageId(null);
    setOpenSnackbar(false);
    setErrorMessage("");
    setOpenConfirmationDialog(false);
  };

  const handleCancelClear = () => {
    setOpenConfirmationDialog(false);
  };
  
  const [persona, setPersona] = React.useState('Jim');

  const handleChange = (event, newPersona) => {
    if (newPersona !== null) {
      setPersona(newPersona);
    }
  };

  return (
    <Grid
      container
      sx={{
        height: `calc(100vh - ${topBarHeight}px)`,
        width: "100%",
        marginTop: `${topBarHeight}px`,
      }}
    >
      <Grid
        item
        xs={4}
        sx={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        {/* <Box sx={{ textAlign: "left", padding: 1, position: 'relative' }}>
          <Box
            onMouseEnter={() => setShowClearChatRect(true)}
            onMouseLeave={() => setShowClearChatRect(false)}
            onClick={clearChat} // Added onClick handler
            sx={{
              backgroundColor: showClearChatRect ? "lightgrey" : "transparent",
              position: 'absolute',
              zIndex: 1,
              top: 0,
              left: 0,
              width: '48%',
              padding: 1,
              borderRadius: "4px 0 0 4px", // Adjusted border radius
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between", // Aligns items to the start and end of the container
              cursor: "pointer", // Change cursor on hover
            }}
          >
            <span>Clear chat</span>
            <IconButton onClick={clearChat}>
              <ClearIcon />
            </IconButton>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ margin: '0 8px', backgroundColor: 'black' }} />
          <Box
            onMouseEnter={() => setShowSaveChatRect(true)}
            onMouseLeave={() => setShowSaveChatRect(false)}
            onClick={saveChat}
            sx={{
              backgroundColor: showSaveChatRect ? "lightgrey" : "transparent",
              position: 'absolute',
              zIndex: 1,
              top: 0,
              right: 0, // Align to the right side
              width: '48%',
              padding: 1,
              borderRadius: "0 4px 4px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            <span>Save chat</span>
            <IconButton onClick={saveChat}>
              <SaveAltIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              backgroundColor: "transparent",
              width: '50%', // Half of the container width
              padding: 1,
              borderRadius: "0 4px 4px 0", // Adjusted border radius
            }}
          />
        </Box> */}
        <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Persona/>

</Box>

        <Box sx={{ overflowY: "auto", flexGrow: 1, padding: 2 }}>
        {messages.map((msg, index) => (
          <Message
            key={index}
            message={msg}
            isLast={index === messages.length - 1}
            onBotMessageClick={handleBotMessageClick}  // Pass the onBotMessageClick prop
            selectedBotMessageId={selectedBotMessageId}  // Pass the selectedBotMessageId prop
          />
        ))}
          <div ref={messagesEndRef} />
        </Box>
        <Box
          component="form"
          onSubmit={sendMessage}
          sx={{
            position: "sticky",
            bottom: 0,
            backgroundColor: "background.paper",
            padding: 2,
          }}
        >
          <TextField
            fullWidth
            label="Ask me a question"
            value={input} // Bind the input state to the TextField
            onChange={handleInputChange} // Update state on input change
            onKeyPress={(e) => e.key === "Enter" && sendMessage(e)} // Send message on Enter key press
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit" disabled={isLoading}>
                    {!isLoading ? <SendIcon /> : <CircularProgress />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Grid>
      <Grid item xs={8} sx={{ overflowY: "auto", height: "100%", padding: 2 }}>
        <RelatedContent relevantDocs={relevantDocs} selectedBotMessageId={selectedBotMessageId} />
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      <Dialog open={openConfirmationDialog} onClose={handleCancelClear}>
        <DialogTitle>Confirm Clear Chat</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to clear the chat?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClear}>Cancel</Button>
          <Button onClick={handleSaveAndClearConfirmation}>Save and clear</Button>
          <Button onClick={handleClearConfirmation} autoFocus>Clear</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
