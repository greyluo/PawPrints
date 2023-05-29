import React from 'react';
import { Typography } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, TextField, Box } from '@mui/material';
import { useState } from 'react';
// Assuming this is your data
const data = [
  { petName: 'Fido', ownerName: 'John Doe', petLink: '/fido', staffName: 'Staff 1' },
  { petName: 'Spot', ownerName: 'Jane Doe', petLink: '/spot', staffName: 'Staff 2' },
  // ... more data
];

function PetTable() {
    const [searchTerm, setSearchTerm] = useState("");
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
      };
      const filteredData = data.filter((item) =>
      item.petName.toLowerCase().includes(searchTerm.toLowerCase()) || item.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
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
                      <Link href={row.petLink} underline="hover" color="inherit">
                        {row.petName}
                      </Link>
                    </TableCell>
                    <TableCell>{row.ownerName}</TableCell>
                    <TableCell>{row.staffName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      );
}

export default PetTable;
