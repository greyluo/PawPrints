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

const PetView = () => {

    return(
        <React.Fragment>
            <Grid container spacing={3}>
                <Grid item xs={12} >
                    <Card  sx={{ display: 'flex', flexDirection: 'row' } }>
                        <CardMedia
                            sx={{ width: 300, height: 200 }}
                            image="/assets/images/pets/dog1.jpg"
                            title="green iguana"

                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column',  width: '100%' }}>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Petty
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                Lizards are a widespread group of squamate reptiles, with over 6,000
                                species, ranging across all continents except Antarctica
                                </Typography>
                            </CardContent>
                            <CardActions  sx={{ mt: 'auto', justifyContent: 'flex-end' }}>
                                <Button size="small" variant="outlined ">Share</Button>
                                <Button size="small" variant="outlined ">Edit</Button>
                            </CardActions>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} md={8} lg={9}>
                <Paper elevation={3}>

                </Paper>
                </Grid>
            </Grid>
        </React.Fragment>
    )


}

export default PetView;