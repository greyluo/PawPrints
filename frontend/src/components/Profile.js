import React from 'react';
import { useState, useEffect } from 'react';
import { Container, Grid, Paper, Avatar } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';




const Profile = ({token, role,setToken}) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        fetch('http://localhost:8080/getuser', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
              // Add any additional headers as needed
            }})
          .then(response => {
            if (response.status === 401) {
                setToken({token:null});

              }
            else if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            else {return response.json();}
          })
          .then(data => setUser(data))
          .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
          });
      }, []);

    return (
        <Box
         elevation={3}
          sx={{
            p: 2,
            minHeight: '100vh'
          }}
        >
          {user !== null && (
            <Paper
              sx={{
                p: 4,
                textAlign: 'center',
                color: 'text.secondary',
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm container>
                  <Grid item xs container direction="column" spacing={2}>
                    <Grid item xs>
                      <Avatar
                        sx={{
                          margin: 'auto',
                          bgcolor: 'secondary.main',
                          width: 50,
                          height: 50,
                        }}
                      >
                        {user.first_name.charAt(0)}
                        {user.last_name.charAt(0)}
                      </Avatar>
                      <Box
                        sx={{
                          mt: 2,
                        }}
                      >
                        <Typography gutterBottom variant="h5">
                          {user.first_name} {user.last_name}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Email: {user.email}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Phone: {user.phone_number}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Account Type: {user.type}
                        </Typography>
                        <Typography variant="body2" gutterBottom>

                        <Link href={`https://mumbai.polygonscan.com/address/${user.address}`}  color="inherit">
                          Wallet Address
                        </Link>
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Box>
      );
};

export default Profile;
