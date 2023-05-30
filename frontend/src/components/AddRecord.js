import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { useState} from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function CreateMedicalRecordForm({token}) {
    let navigate = useNavigate();
    const { id } = useParams();
    const [record, setRecord] = useState({
        petId: id,
        visitedDate: '',
        diagnosis: '',
        procedure: '',
        prescription: '',
        procedureFee: '',
        medicationFee: '',
        notes: '',
        title: '',
      });
      const handleChange = (e) => {
        setRecord({ ...record, [e.target.id]: e.target.value });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(record);
        const response = await fetch('http://localhost:8080/createRecord', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(record),
        });
        navigate(`/petview/${id}`);
        if (response.ok) {

            console.log('Success:', response);

        } else {
          console.error('Error:', response);
        }
      };
  return (
    <Container maxWidth="md" >
        <Paper elevation={3} sx={{ padding: 5 }}>
        <Box display="flex" justifyContent="center">
            <Typography variant="h4" component="h4" gutterBottom  fontWeight="bold">
                Add Medical Record
                </Typography>
            </Box>

        <Box
            component="form"
            sx={{
            '& .MuiTextField-root': { mt: 2 },

            }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
        >
            <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField required fullWidth id="title" label="Title" type="title" InputLabelProps={{ shrink: true }} value={record.title} onChange={handleChange}  />
            </Grid>
            <Grid item xs={12}>
                <TextField required fullWidth id="visitedDate" label="Visited Date" type="date" InputLabelProps={{ shrink: true }} value={record.visitedDate} onChange={handleChange}  />
            </Grid>
            <Grid item xs={12}>
                <TextField required fullWidth id="diagnosis" label="Diagnosis" value={record.diagnosis} onChange={handleChange}  />
            </Grid>
            <Grid item xs={12}>
                <TextField required fullWidth id="procedure" label="Procedure" value={record.procedure} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
                <TextField fullWidth id="prescription" label="Prescription" value={record.prescription} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField fullWidth id="procedureFee" label="Procedure Fee" type="number" InputProps={{ inputProps: { min: 0 } }} value={record.procedureFee} onChange={handleChange}/>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField fullWidth id="medicationFee" label="Medication Fee" type="number" InputProps={{ inputProps: { min: 0 } }} value={record.medicationFee} onChange={handleChange}/>
            </Grid>
            <Grid item xs={12}>
                <TextField fullWidth id="notes" label="Notes" multiline maxRows={4} value={record.note} onChange={handleChange} />
            </Grid>
            </Grid>
            <Box display="flex" justifyContent="center" mt={3}>
                <Button variant="contained" type="submit">
                    Submit
                </Button>
            </Box>
        </Box>
        </Paper>
    </Container>
  );
}
