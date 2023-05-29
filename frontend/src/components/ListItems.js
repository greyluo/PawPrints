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

export function SecondaryListItems({ setToken, open, token, role }) {
  const handleLogout = () => {
    setToken({token:null});
  };
  const [pets, setPets] = useState([]);

  useEffect(() => {
    // Fetch the list of pets from the server using a GET request
    if(role.role==="pet owner"){
      fetch('http://localhost:8080/getpets', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          // Add any additional headers as needed
        },
      })
      .then(response => {
        if (response.status === 401) {
          handleLogout();
        } else {
        response.json()}})
      .then(data => setPets(data))
      .catch(error => console.error(error));
    }
  }, []);

  return (
    <React.Fragment>
      {open&&role==="pet owner" && <ListSubheader component="div">Your Pets</ListSubheader>}

      {pets[0]!==undefined && pets[0].map(pet => (
        <Link key={pet.id} href={`/petview/${pet.id}`} underline="none" color="inherit">
          <ListItemButton>
            <ListItemIcon>
              <PetsIcon />
            </ListItemIcon>
            <ListItemText primary={pet.name} />
          </ListItemButton>
        </Link>
      ))}

      {role==="pet owner" &&<Link href="/addPet" underline="none" color="inherit">
        <ListItemButton>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Add a Pet" />
        </ListItemButton>
      </Link>}
      {role==="hospital" &&<Link href="/linkPet" underline="none" color="inherit">
        <ListItemButton>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Link a Pet" />
        </ListItemButton>
      </Link>}

    </React.Fragment>
  );
}