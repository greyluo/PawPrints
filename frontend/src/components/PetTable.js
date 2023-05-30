import React from 'react';
import { Typography } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, TextField, Box } from '@mui/material';
import { useState, useEffect } from 'react';

// Assuming this is your data

//
function PetTable({token,setToken}) {
    const handleLogout = () => {
        setToken({token:null});
      };

    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        fetch('http://localhost:8080/getpetbyhospital', {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            // Add any additional headers as needed
            },
        }).then(response => {
            if (response.status === 401) {
                handleLogout();
              }
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }

            else {return response.json();}
          })
          .then(petData => {
            setData(petData)
            console.log(petData)
        })
          .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
          });
      }, []);
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
      };
      const filteredData = data.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.owner_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', m: 1 }}>
            <TextField
              label="Search Pet"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Box>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
             {/*  <TableRow>
                    <TableCell
                    colSpan={4}
                    sx={{
                        bgcolor: 'primary.main',  // Background color
                    }}
                    >
                    <Typography
                        variant="h4"
                        component="div"
                        align="center"

                        sx={{ fontWeight: 'bold' }}  // Text bold
                    >
                        Pet List
                    </Typography>
                    </TableCell>
                </TableRow> */}
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Pet Name</TableCell>
                  <TableCell>Owner Name</TableCell>
                  <TableCell >Staff Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">{index + 1}</TableCell>
                    <TableCell>
                      <Link href={`/petview/${row.id}`} underline="hover" color="inherit">
                        {row.name}
                      </Link>
                    </TableCell>
                    <TableCell>{row.owner_name}</TableCell>
                    <TableCell>{row.staff_name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      );
}

export default PetTable;
