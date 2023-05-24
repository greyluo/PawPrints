import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText';
import OutlinedInput from '@mui/material/OutlinedInput';
import FilledInput from '@mui/material/FilledInput';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';


//react function component
function EditPet() {
    const [age, setAge] = React.useState("");

    const labelStyle = {
        display: "flex",
        justifyContent: "center",
        fontWeight: 700
      }

    const handleChange = (event) => {
      setAge(event.target.value);
    };
    const categories = [
        "science",
        "sports",
        "business",
        "politics",
        "entertainment",
        "technology",
        "world",
        "all"
      ];
    const sex = [ "male", "female", "other"];
    const handleUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
          console.log('File name:', file.name);
          console.log('File size:', file.size);
          console.log('File type:', file.type);
        } else {
          console.log('No file selected');
        }
      };

    return (
        <React.Fragment>
        <Paper elevation={3}>

          <Box component="form" sx={{ padding: 5 }}>

            <Grid container spacing={3} >
            {/*  Add a title for the form */}
                <Grid item sm={12} xs={12}>
                    <Box display="flex" justifyContent="center">
                    <Typography variant="h4" component="h4" gutterBottom fontWeight="bold" >
                        Edit
                    </Typography>
                </Box>
                </Grid>

              <Grid item sm={12} md={2}>
                <InputLabel
                  sx={labelStyle}
                >
                  Name
                </InputLabel>
              </Grid>
              <Grid item sm={12} md={10}>
                <TextField
                  required
                  id="name"
                  name="name"
                  label="name"
                  fullWidth
                  size="small"
                  autoComplete="off"
                  variant="outlined"
                />
              </Grid>
              <Grid item sm={12} md={2}>
                <InputLabel
                  sx={labelStyle}
                >
                  Species
                </InputLabel>
              </Grid>
              <Grid item sm={12} md={10}>
                <TextField
                  required
                  id="species"
                  name="species"
                  label="species"
                  fullWidth
                  size="small"
                  autoComplete="off"
                  variant="outlined"
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>
              <Grid item sm={12} md={2}>
                <InputLabel
                  sx={labelStyle}
                >
                  Breed
                </InputLabel>
              </Grid>
              <Grid item sm={12} md={4}>
                  <Select
                    fullWidth
                    size="small"
                    labelId="demo-simple-select-label"
                    label="Bread"
                    id="demo-simple-select"
                  >
                    {categories.map((item) => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ))}
                  </Select>
              </Grid>
              <Grid item sm={12} md={2}>
                <InputLabel
                  sx={labelStyle}
                >
                  Sex
                </InputLabel>
              </Grid>
              <Grid item sm={12} md={4}>
                <Select
                    fullWidth
                    size="small"
                    labelId="sex"
                    label="Sex"
                >
                {sex.map((item) => (
                    <MenuItem value={item}>{item}</MenuItem>
                ))}
                </Select>
              </Grid>
              <Grid item xs ={6}  sm={6} md={2}>
                <InputLabel
                  sx={labelStyle}
                >
                  Img Upload
                </InputLabel>
              </Grid>

              <Grid item xs={6}sm={6} md={3} style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <label htmlFor="upload-image">
             <input
                id="upload-image"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleUpload} // Your custom function to handle the file upload
            />

            <IconButton component="span"  size="large">
                <AddPhotoAlternateIcon />
            </IconButton>

            </label>
            </Grid>
            <Grid item sm={12} >
            <Box display="flex" justifyContent="center">
                <Button type="submit" variant="contained">
                    Submit
                </Button>
                </Box>

            </Grid>
            </Grid>
          </Box>
        </Paper>
      </React.Fragment>
    );

    }

export default EditPet;
