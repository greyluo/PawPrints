import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Box, TextField, Button, Typography } from '@mui/material';

function LinkPet() {
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleTokenChange = (event) => {
    setToken(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // API request logic here
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, name }),
      });

      const data = await response.json();

      if (response.ok) {
        // Navigate to a different page on success
        navigate("/success-page");
      } else {
        // Handle errors
        console.error(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',

      }}
    >
      <Paper elevation={1} sx={{ p: 4   , width: '100%', maxWidth: 400 }}>
        <Typography variant="h4" component="div" gutterBottom>
          Link Pet
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Token"
            variant="outlined"
            value={token}
            onChange={handleTokenChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Staff Name"
            variant="outlined"
            value={name}
            onChange={handleNameChange}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default LinkPet;
