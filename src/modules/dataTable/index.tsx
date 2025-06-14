import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import { getAllUsersData } from "../../api";

const DataTable: React.FC = () => {
  const [data, setData] = useState<User[]>([]);

  useEffect(() => {
    // Fetch all users when the component mounts
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsersData();
        setData(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>About Me</TableCell>
              <TableCell sx={{ width: 150 }}>Address</TableCell>
              <TableCell sx={{ width: 130 }}>Zip Code</TableCell>
              <TableCell sx={{ width: 130 }}>City</TableCell>
              <TableCell sx={{ width: 130 }}>State</TableCell>
              <TableCell sx={{ width: 130 }}>Birthdate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.aboutMe}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>{user.zipCode}</TableCell>
                <TableCell>{user.city}</TableCell>
                <TableCell>{user.state}</TableCell>
                <TableCell>{user.birthdate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DataTable;

// Define the type for a single user entry
interface User {
  email: string;
  aboutMe: string;
  address: string;
  zipCode: string;
  state: string;
  city: string;
  birthdate: string;
}
