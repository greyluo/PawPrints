import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardActions, CardMedia, Typography, Box, Button, Paper, Grid } from '@mui/material';
import dogImage from '../assets/images/pets/dog1.jpg';
import CakeIcon from '@mui/icons-material/Cake';
import PetsIcon from '@mui/icons-material/Pets';
import GenderMaleIcon from '@mui/icons-material/Male';
import CategoryIcon from '@mui/icons-material/Category';
import { useParams } from 'react-router-dom';
import {Snackbar, Alert } from '@mui/material';
import GenderFemaleIcon from '@mui/icons-material/Female';
import RecordList from './RecordList';

const PetView = ({role,token}) => {
  const [petData, setPetData] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const { id } = useParams();
  const handleClick = async () => {
    try {
      const response = await fetch(`http://localhost:8080/getPetToken/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,

        },
      });

      const data = await response.json();
      
      if (response.ok) {
        navigator.clipboard.writeText(data.token);
        setShowAlert(true);
        console.log('Data:', data);
      } else {
        // Handle errors
        console.error(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowAlert(false);
  };
  useEffect(() => {
    // Fetch the pet data from the server using a GET request with the 'id' parameter
    fetch(`http://localhost:8080/getpet?id=${id}`)
      .then(response => response.json())
      .then(data => setPetData(data))
      .catch(error => console.error(error));
  }, [id]);

  if (!petData) {
    return <div>Loading...</div>; // Display a loading state while fetching the data
  }

  const { name, species, breed, gender, birthday } = petData[0];


  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ display: 'flex', flexDirection: 'row' }}>
            <CardMedia
              sx={{ width: 400 }}
              image={dogImage} // Replace 'dogImage' with the actual image URL or import statement for the pet's image
              title={name}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography gutterBottom variant="h4" component="div">
                    {name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PetsIcon />
                    <Typography variant="body2" color="text.secondary">
                      Species: {species}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CategoryIcon />
                    <Typography variant="body2" color="text.secondary">
                      Breed: {breed}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GenderMaleIcon /> {/* Replace with GenderFemaleIcon for female pets */}
                    <Typography variant="body2" color="text.secondary">
                      Sex: {gender}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CakeIcon />
                    <Typography variant="body2" color="text.secondary">
                      Born: {new Date(birthday).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              {role==="pet owner"&&<CardActions sx={{ mt: 'auto', justifyContent: 'flex-end' }}>
                <Button size="small" variant="" onClick={handleClick}>Share</Button>
                <Link to="/editpet">
                  <Button size="small" variant="">Edit</Button>
                </Link>
                <Snackbar open={showAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
                  Token copied to clipboard!
                </Alert>
              </Snackbar>
              </CardActions>}
            </Box>
          </Card>
        </Grid>
          <Grid item xs={12}>
            <RecordList petId={id} token={token} role={role} id ={id}/>
          </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default PetView;
