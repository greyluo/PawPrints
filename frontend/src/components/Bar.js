import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { MainListItems, SecondaryListItems } from './ListItems';
const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open, matches }) => ({
  zIndex: theme.zIndex.drawer + 1,
  ...(matches
    ? {
        width: '100%',
        marginLeft: 0,
      }
    : {
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
          marginLeft: drawerWidth,
          width: `calc(100% - ${drawerWidth}px)`,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }),
      }),
}));
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',

      [theme.breakpoints.down('sm')]: {
        position: 'fixed',
        height: '100%',
        width: '100%',
        top: 0,
        left: 0,
        zIndex: theme.zIndex.appBar - 1,
      },

      transition: theme.transitions.create(['width', 'height', 'transform'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),

      width: theme.spacing(23),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(30),
      },

      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create(['width', 'height', 'transform'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {

        },
        [theme.breakpoints.down('sm')]: {
          width: theme.spacing(0),
          transform: 'translateX(-100%)',
        },
      }),
    },
  }),
);






function BarContent() {
  const matches = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [open, setOpen] = React.useState(!matches);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
      <div>


        <AppBar position="absolute" open={open}  matches={matches} elevation={1}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...((open && !matches) && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h5"
              color= "secondary"
              noWrap
              fontWeight="bold"
              sx={{ flexGrow: 1 }}
            >

              PawPrints
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant={"permanent"} open={open} matches = {matches} >
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>

           {/*  <Divider /> */}

          <List component="nav">

            <MainListItems ></MainListItems>
            <Divider variant="middle" sx={{ my: 1 }} />
            <SecondaryListItems open = {open}>
            </SecondaryListItems>
          </List>
        </Drawer>

      </div>
  );
}

export default function Bar() {
  return <BarContent />;
}