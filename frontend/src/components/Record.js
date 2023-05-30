import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Paper, Container, Grid, Card, CardContent, Typography, Divider, List, ListItem, ListItemText } from '@mui/material';
import Link from "@mui/material/Link";



function Record({ token}) {
  const [record, setRecord] = useState({});
  const { id } = useParams();

  useEffect(() => {
    console.log(id);
    fetch(`http://localhost:8080/getrecord/${id}`, {
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
        setRecord(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [id]);

  return (
    <Container>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8}>
          <Card elevation={3} sx={{ marginTop: 5,p:2 }} >
            <CardContent>
            <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'grey.700' }}>
            {record.title}
            </Typography>
              <Divider />
              <List>
                <ListItem>
                  <ListItemText primary="Visited Date" secondary={new Date(record.visited_date).toLocaleDateString()} />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText primary="Diagnosis" secondary={record.diagnosis} />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText primary="Procedure" secondary={record.medical_procedure} />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText primary="Prescription" secondary={record.prescription} />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText primary="Procedure Fee" secondary={record.procedure_fee} />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText primary="Medication Fee" secondary={record.medication_fee} />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText primary="Notes" secondary={record.notes} />
                </ListItem>
                <Link href = {`https://mumbai.polygonscan.com/tx/${record.transaction_hash}`}  color="inherit" >
                <ListItem>
                  <ListItemText primary="Record Chain Address"/>
                </ListItem>
                </Link>

              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );

}

export default Record;
