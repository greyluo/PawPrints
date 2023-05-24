import React from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import dogImage from '../assets/images/pets/dog1.jpg';
import CakeIcon from '@mui/icons-material/Cake';
import PetsIcon from '@mui/icons-material/Pets';
import GenderMaleIcon from '@mui/icons-material/Male';
import CategoryIcon from '@mui/icons-material/Category';
import GenderFemaleIcon from '@mui/icons-material/Female';
import { Link } from 'react-router-dom';
const PetView = () => {

    return(
        <React.Fragment>
            <Grid container spacing={3}>
                <Grid item xs={12} >
                    <Card  sx={{ display: 'flex', flexDirection: 'row' } }>
                        <CardMedia
                            sx={{ width: 400 }}
                            image={dogImage}
                            title="dog1"

                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column',  width: '100%' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Typography gutterBottom variant="h4" component="div">
                                    Petty
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PetsIcon />
                                    <Typography variant="body2" color="text.secondary">
                                        Species: Dog
                                    </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CategoryIcon />
                                    <Typography variant="body2" color="text.secondary">
                                        Breed: Taddy
                                    </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <GenderMaleIcon /> {/* Replace with GenderFemaleIcon for female pets */}
                                    <Typography variant="body2" color="text.secondary">
                                        Sex: Male
                                    </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CakeIcon />
                                    <Typography variant="body2" color="text.secondary">
                                        Born: 01/01/2020
                                    </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                            <CardActions  sx={{ mt: 'auto', justifyContent: 'flex-end' }}>
                                <Button size="small" variant="outlined ">Share</Button>
                                <Link to="/editpet">
                                <Button size="small" variant="outlined ">Edit</Button>
                                </Link>
                            </CardActions>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Paper elevation={3}>
                        {/* Display medical records in timeline/list format*/}
                        <Box sx={{ padding: 5 }}>
                            <Typography variant="h4" component="h4" gutterBottom >
                                Medical Records
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </React.Fragment>
    )


}

export default PetView;