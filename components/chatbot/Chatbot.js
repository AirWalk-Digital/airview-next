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
  const jsonDelimiter = '###%%^JSON-DELIMITER^%%###'; // should be same as that in route.js and to be updated to extract from env
  const [selectedBotMessageId, setSelectedBotMessageId] = useState(null);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // Check if the last message is from a bot and automatically click it
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'bot') {
      handleBotMessageClick(lastMessage.id);
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
      id: `user-${Date.now()}`,
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
      
          const jsonObjects = jsonString.split(jsonDelimiter);
      
          jsonObjects.forEach(jsonObject => {
            try {
              const parsedObject = JSON.parse(jsonObject);
              // Handling MessageStream type
              if (parsedObject.type === 'MessageStream') {
                const { content, id, role } = parsedObject;
                setMessages((prevMessages) => {
                  const existingMessageIndex = prevMessages.findIndex((msg) => msg.id === id);
      
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
                    return [...prevMessages, { content, id, role }];
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
        <Box sx={{ textAlign: "left", padding: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <span>Clear chat</span>
            <IconButton onClick={clearChat}>
              <ClearIcon />
            </IconButton>
          </Box>
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
            // variant="outlined"
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
          <Button onClick={handleClearConfirmation} autoFocus>
            Clear
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
