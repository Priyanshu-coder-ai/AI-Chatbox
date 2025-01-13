import React, { useState, useRef, useEffect } from 'react';
import { Box, Card, CardContent, CardActions, Button, TextField } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { GoogleGenerativeAI } from '@google/generative-ai';
import FormattedResponse from './FormattedResponse';
import ColorExtractor from './ColorExtractor';
import './App.css';
import './markdown-styles.css';

// Initialize the Gemini API
const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Wallpaper URL (replace with your actual wallpaper URL)
const wallpaperUrl = `${process.env.PUBLIC_URL}/background.jpg`;

function App() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello! I'm your AI assistant. How can I help you today?" }
  ]);
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(createTheme());
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prevMessages => [...prevMessages, { role: 'user', content: input }]);
    setInput('');
    setLoading(true);

    try {
      const result = await model.generateContent(input);
      const response = await result.response;
      const text = response.text();

      setMessages(prevMessages => [...prevMessages, { role: 'ai', content: text }]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prevMessages => [...prevMessages, { role: 'ai', content: 'Sorry, I encountered an error.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleColorExtracted = (color) => {
    const [r, g, b] = color;
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const textColor = luminance > 0.5 ? '#000000' : '#ffffff';
    const backgroundColor = `rgba(${r}, ${g}, ${b}, 0.8)`;

    const newTheme = createTheme({
      palette: {
        mode: luminance > 0.5 ? 'light' : 'dark',
        primary: {
          main: backgroundColor,
        },
        background: {
          default: backgroundColor,
          paper: luminance > 0.5 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(18, 18, 18, 0.8)',
        },
        text: {
          primary: textColor,
        },
      },
    });

    setTheme(newTheme);
  };

  return (
    <ThemeProvider theme={theme}>
      <ColorExtractor src={wallpaperUrl} onColorExtracted={handleColorExtracted} />
      <div className="App">
        <div className="background-container" style={{
          backgroundImage: `url(${wallpaperUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          filter: 'blur(10px)',
          zIndex: -1,
        }} />
        <div className="content-container" style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <Card sx={{ 
            width: '75%', 
            bgcolor: 'background.paper', 
            color: 'text.primary',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          }}>
            <CardContent sx={{ height: '70vh', overflowY: 'auto', p: 2 }}>
              {messages.map((message, i) => (
                <Box
                  key={i}
                  sx={{
                    mb: 2,
                    textAlign: message.role === 'user' ? 'right' : 'left',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '8px 12px',
                      borderRadius: '12px',
                      backgroundColor: message.role === 'user' ? theme.palette.primary.main : theme.palette.background.paper,
                      color: theme.palette.text.primary,
                      maxWidth: '80%',
                      wordBreak: 'break-word',
                    }}
                  >
                    {message.role === 'user' ? (
                      message.content
                    ) : (
                      <FormattedResponse content={message.content} />
                    )}
                  </span>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </CardContent>
            <CardActions sx={{ p: 2, bgcolor: 'background.paper' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%' }}>
                <TextField
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  variant="outlined"
                  fullWidth
                  disabled={loading}
                  sx={{
                    mr: 1,
                    '& .MuiOutlinedInput-root': {
                      color: 'text.primary',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'text.secondary',
                    },
                  }}
                />
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                  {loading ? 'Sending...' : 'Send'}
                </Button>
              </form>
            </CardActions>
          </Card>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;

