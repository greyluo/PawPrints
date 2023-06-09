import * as React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { useEffect } from 'react';
import { Card, CardHeader } from '@mui/material';
export default function RecordList({ role, token, id}) {
  const [medicalRecords,setMedicalRecords] = React.useState([
    { record_id: 1, title: 'Visit 1', visited_date: '2022-01-01' },
    { record_id: 2, title: 'Visit 2', visited_date: '2022-02-01' },
    // More records...
  ]);
  useEffect(() => {
    fetch(`http://localhost:8080/getrecords/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,

        }})  // Update with your real endpoint
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setMedicalRecords(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [id]);  // Run this effect whenever petId changes
  const address = `/addRecord/${id}`;
  return (
    <Grid item xs={12}>
      <Paper elevation={3}>
        <Box sx={{ padding: 5 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4" component="h4" gutterBottom>
              Medical Records
            </Typography>
            {role==="hospital"&&<Button variant="contained" component={Link} to={address}>
                <AddIcon />
            </Button>}
          </Box>
          <Typography variant="body2" color="text.secondary">
          {medicalRecords.map(record => (
            <Card elevation={2} key={record.id} sx={{ marginBottom: 5 }}>
              <CardHeader
                title={
                  <Link
                    to={`/record/${record.id}`}
                    style={{ color: 'inherit' }}
                  >
                    {record.title}
                  </Link>
                }
                subheader={`Visited Date: ${new Date(record.visited_date).toLocaleDateString()}`}
              />
            </Card>
          ))}
        </Typography>
        </Box>
      </Paper>
    </Grid>
  );
}
