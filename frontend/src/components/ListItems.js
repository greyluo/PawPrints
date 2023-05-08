import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PetsIcon from '@mui/icons-material/Pets';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';

export const mainListItems = (
  <React.Fragment>
    <ListItemButton>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>

    <ListItemButton>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Your Profile" />
    </ListItemButton>

    <ListItemButton>
      <ListItemIcon>
        <AddIcon />
      </ListItemIcon>
      <ListItemText primary="Add your Pet" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div"  >
      Your Pets
    </ListSubheader>
    {/* Create pet with random name */}
    <ListItemButton>
        <ListItemIcon>
            <PetsIcon />
        </ListItemIcon>
        <ListItemText primary="Pet 1" />
    </ListItemButton>
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
  </React.Fragment>
);