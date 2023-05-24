import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import AddPet from './components/AddPet';
import Box from '@mui/material/Box';
import Bar from './components/Bar';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { Routes, Route, useNavigate} from "react-router-dom";
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import PetView from './components/PetView';
import EditPet from './components/EditPet';
import useToken from './components/useToken';
function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        PawPrints
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const mdTheme = createTheme({
  palette: {
    /*  modern color */
    primary: {
      /* white */
      main: '#ffffff',
    }

  },
});
function RedirectToSignIn() {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate('/signin');
  }, [navigate]);

  return null;
}
function App() {
  const { token, setToken } = useToken();
  if (!token) {
    return (
      <Routes>
      <Route path="/signin" element={<SignIn setToken={setToken} />} />
      <Route path="/signup" element={<SignUp setToken={setToken} />} />
      <Route path="*" element={<RedirectToSignIn />} />
    </Routes>
    );
  }
  return (
    <React.Fragment>
       <CssBaseline />
      <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        {<Bar setToken={setToken} />}
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/addPet" element={<AddPet />} />
              <Route path= "/signup" element={<SignUp />} />
              <Route path="/petview" element={<PetView />} />
              <Route path="/editpet" element={<EditPet />} />
              <Route path="/signup" element={<SignUp />} />

            </Routes>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>

      {/* Your other components */}
      </Box>
      </ThemeProvider>

    </React.Fragment>

  );

}

export default App;
