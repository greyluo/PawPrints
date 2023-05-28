import React from 'react';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import PetsIcon from '@mui/icons-material/Pets';
import Link from '@mui/material/Link';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState, useEffect } from 'react';

export function MainListItems({setToken}) {
  const handleLogout = () => {
    setToken({token:null});
  };
  return (
    <React.Fragment>
    <Link href="/dashboard" underline="none" color="inherit">
      <ListItemButton>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />

      </ListItemButton>
      </Link>
      <Link href="/profile" underline="none" color="inherit">
      <ListItemButton>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>

        <ListItemText primary="Your Profile" />

      </ListItemButton>
      </Link>
      <Link href="/" underline="none" color="inherit" onClick={handleLogout}>
      <ListItemButton>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>

        <ListItemText primary="Logout" />

      </ListItemButton>
      </Link>
    </React.Fragment>
  );
}

export function SecondaryListItems({ open }) {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    // Fetch the list of pets from the server using a GET request
    fetch('http://localhost:8080/getpets') // Replace '/getpets' with your actual endpoint to fetch the list of pets
      .then(response => response.json())
      .then(data => setPets(data))
      .catch(error => console.error(error));
  }, []);
  console.log(pets)

  return (
    <React.Fragment>
      {open && <ListSubheader component="div">Your Pets</ListSubheader>}

      {pets[0]!=undefined && pets[0].map(pet => (
        <Link key={pet.id} href={`/petview/${pet.id}`} underline="none" color="inherit">
          <ListItemButton>
            <ListItemIcon>
              <PetsIcon />
            </ListItemIcon>
            <ListItemText primary={pet.name} />
          </ListItemButton>
        </Link>
      ))}

      <Link href="/addPet" underline="none" color="inherit">
        <ListItemButton>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Add your Pet" />
        </ListItemButton>
      </Link>
    </React.Fragment>
  );
}