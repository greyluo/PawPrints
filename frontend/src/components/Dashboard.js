import React from 'react'
import { Container, Grid, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import PetTable from './PetTable';

const Dashboard = ({role, token,setToken}) => {
    return (
        <div>
             {role==="hospital"&&<Grid container spacing={3}>
              {/* <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                </Paper>
              </Grid> */}
              <Grid item xs={12}>
                  <PetTable token={token}/>
              </Grid>
            </Grid>}


        </div>
    )
}

export default Dashboard