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
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useNavigate } from 'react-router-dom';


//react function component
function AddPet() {
  const navigate = useNavigate();
  const [name, setName] = React.useState("");
  const [species, setSpecies] = React.useState("");
  const [color, setColor] = React.useState([]);
  const [breed, setBreed] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [birthday, setBirthday] = React.useState(null);
  const [isNeutered, setIsNeutered] = React.useState(false);
  const [insuranceProvider, setInsuranceProvider] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    const colors = color.join(',');
    const pet = {
      name,
      species,
      colors,
      breed,
      gender,
      birthday,
      isNeutered,
      weight,
      insuranceProvider,
      ownerId: 1, // Temporarily hardcoded, update this with the actual owner's id
    };

    try {
      const response = await fetch('http://localhost:8080/addpet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pet)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const data = await response.json();
        const petId = data.results[0].insertId; // Adjust this based on your actual response structure
        // Navigate to the PetView page with the pet ID
        navigate(`/petview/${petId}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }



    const labelStyle = {
        display: "flex",
        justifyContent: "center",
        fontWeight: 700
      }


      const handleColorChange = (event) => {
        const selectedColors = event.target.value;
        if (selectedColors.length <= 3) {
          setColor(selectedColors);
        }
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
    const speciesType = [
        "dog",
        "cat",
        ];
    const colorType = [
        "black",
        "white",
        "brown",
        "grey",
        "yellow",
        "orange",
        "red",
        "blue",
        "green",
        "purple",
        "pink",
        "other"
    ];


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

          <Box component="form" onSubmit={handleSubmit} sx={{ padding: 5 }}>

            <Grid container spacing={3} >
            {/*  Add a title for the form */}
                <Grid item  xs={12}>
                    <Box display="flex" justifyContent="center">
                    <Typography variant="h4" component="h4" gutterBottom  fontWeight="bold">
                        Add Your Pet
                    </Typography>
                </Box>
                </Grid>

              <Grid item  md={4}>
                <InputLabel
                  sx={labelStyle}
                >
                  Name
                </InputLabel>
              </Grid>
              <Grid item  md={8}>
                <TextField
                  required
                  id="name"
                  name="name"
                  label="name"
                  fullWidth
                  size="small"
                  autoComplete="off"
                  variant="outlined"
                  onChange={e => setName(e.target.value)}
                  value = {name}
                />
              </Grid>
              <Grid item sm={12} md={4}>
                <InputLabel
                  sx={labelStyle}
                >
                Species
                </InputLabel>
              </Grid>
              <Grid item sm={12} md={8}>
                  <Select
                    fullWidth
                    size="small"
                    labelId="Species"
                    label="Species"
                    id="Species"
                    name='species'
                    onChange={e => setSpecies(e.target.value)}
                    value = {species}

                  >
                    {speciesType.map((item) => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ))}
                  </Select>
              </Grid>
              <Grid item sm={12} md={4}>
                <InputLabel
                  sx={labelStyle}
                >
                Color
                </InputLabel>
              </Grid>
              <Grid item sm={12} md={8}>

                  <Select
                    multiple
                    fullWidth
                    size="small"
                    labelId="Color"
                    label="Color"
                    id="color"
                    name="color"
                    onChange={handleColorChange}
                    value = {color}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    {colorType.map((item) => (
                      <MenuItem key={item} value={item}>
                        <Checkbox defaultChecked checked={color.indexOf(item) > -1} />
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Pick max 3</FormHelperText>
              </Grid>
              <Grid item sm={12} md={4}>
                <InputLabel sx={labelStyle}>
                  Weight
                </InputLabel>
              </Grid>
              <Grid item sm={12} md={8}>
                <TextField
                  required
                  id="weight"
                  name="weight"
                  label="weight"
                  fullWidth
                  size="small"
                  autoComplete="off"
                  placeholder="Enter weight in pounds"
                  variant="outlined"
                  inputProps={{ inputMode: 'numeric', pattern: "[0-9]*"}}
                  onChange={e => setWeight(!isNaN(parseInt(e.target.value)) ? parseInt(e.target.value) : "")}
 // Parse the value to an integer, if parsing fails it will be set to ""
                  value={weight}
                />
              </Grid>

              <Grid item  md={4}>
                <InputLabel
                  sx={labelStyle}
                >
                  Breed
                </InputLabel>
              </Grid>
              <Grid item  md={8}>
                <TextField
                    required
                    id="breed"
                    name="breed"
                    label="breed"
                    fullWidth
                    size="small"
                    autoComplete="off"
                    variant="outlined"
                    onChange={e => setBreed(e.target.value)}
                    value = {breed}
                    />
              </Grid>
              <Grid item sm={12} md={4}>
                <InputLabel sx={labelStyle}>Birthday</InputLabel>
              </Grid>
              <Grid item sm={12} md={8}>
                <TextField
                  id="birthday"
                  type="date"
                  name="birthday"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={e => setBirthday(e.target.value)}
                  value = {birthday}
                />
              </Grid>
              <Grid item sm={12} md={4}>
                <InputLabel sx={labelStyle}>Is Neutered</InputLabel>
              </Grid>
              <Grid item sm={12} md={8}>
                <FormControlLabel
                  control={
                    <Checkbox
                      defaultChecked
                      id="isNeutered"
                      name="isNeutered"
                      color="primary"
                      onChange={e => setIsNeutered(e.target.checked)}
                      checked={isNeutered}
                    />
                  }
                />
              </Grid>


              <Grid item  md={4}>
                <InputLabel
                  sx={labelStyle}
                >
                  Gender
                </InputLabel>
              </Grid>
              <Grid item  md={8}>
                <Select
                    fullWidth
                    size="small"
                    labelId="Gender"
                    label="gender"
                    name='gender'
                    onChange={e => setGender(e.target.value)}
                    value={gender}
                >
                  <MenuItem value='M'>Male</MenuItem>
                  <MenuItem value='F'>Female</MenuItem>
                </Select>
              </Grid>
              <Grid item sm={12} md={4}>
                  <InputLabel sx={labelStyle}>Insurance Provider</InputLabel>
                </Grid>
                <Grid item sm={12} md={8}>
                  <TextField
                    id="insuranceProvider"
                    name="insuranceProvider"
                    fullWidth
                    size="small"
                    autoComplete="off"
                    variant="outlined"
                    onChange={e => setInsuranceProvider(e.target.value)}
                    value = {insuranceProvider}
                  />
              </Grid>

              <Grid item xs ={6}  sm={6} md={4}>
                <InputLabel
                  sx={labelStyle}
                >
                 Image
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
            <Grid item  >
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

export default AddPet;
