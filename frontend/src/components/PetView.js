import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardActions, CardMedia, Typography, Box, Button, Paper, Grid } from '@mui/material';
import dogImage from '../assets/images/pets/dog1.jpg';
import CakeIcon from '@mui/icons-material/Cake';
import PetsIcon from '@mui/icons-material/Pets';
import GenderMaleIcon from '@mui/icons-material/Male';
import CategoryIcon from '@mui/icons-material/Category';
import { useParams } from 'react-router-dom';
import GenderFemaleIcon from '@mui/icons-material/Female';

const PetView = () => {
  const [petData, setPetData] = useState(null);
  const { id } = useParams();

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
                      Gender: {gender}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CakeIcon />
                    <Typography variant="body2" color="text.secondary">
                      Born: {birthday}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardActions sx={{ mt: 'auto', justifyContent: 'flex-end' }}>
                <Button size="small" variant="">Share</Button>
                <Link to="/editpet">
                  <Button size="small" variant="">Edit</Button>
                </Link>
              </CardActions>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3}>
            {/* Display medical records in timeline/list format*/}
            <Box sx={{ padding: 5 }}>
            <Typography variant="h4" component="h4" gutterBottom>
                Medical Records
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {/* Display the medical records here */}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default PetView;
