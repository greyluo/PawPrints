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

export function MainListItems({setToken}) {
  const handleLogout = () => {
    setToken(0);
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

export function SecondaryListItems({open}) {
  return (
    <React.Fragment>
      {open && <ListSubheader component="div">Your Pets</ListSubheader>}
      {/* Create pet with random name */}
      <Link href="/petview" underline="none" color="inherit">
        <ListItemButton>
          <ListItemIcon>
            <PetsIcon />
          </ListItemIcon>
          <ListItemText primary="Pet 1" />
        </ListItemButton>
      </Link>

      <ListItemButton>
        <ListItemIcon>
          <PetsIcon />
        </ListItemIcon>
        <ListItemText primary="Pet 2" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <PetsIcon />
        </ListItemIcon>
        <ListItemText primary="Pet 3" />
      </ListItemButton>
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
