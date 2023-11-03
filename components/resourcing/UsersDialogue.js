// components/UsersDialog.js
import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import AddCircleIcon from '@mui/icons-material/AddCircle';

// Import your JSON data here. In a real-world scenario, you would load this data from a file or API

export const UsersDialog = ({ open, onClose, users, resourcingData, resources }) => {
    const [view, setView] = useState(1);
    const propData = resourcingData;
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        // Extract distinct departments from the resources
        const uniqueDepartments = Array.from(new Set(resources.map(user => user.department).filter(Boolean)));
        setDepartments(uniqueDepartments);
    }, [resources]);

    // Function to filter out any users without a displayName or department
    const filterInvalidUsers = (users) => {
        return users.filter(user => user.displayName && user.department);
    };

    // Function to filter users by department
    const filterByDepartment = (users, department) => {
        if (!department) return users;
        return users.filter(user => user.department === department);
    };

    // Function to sort users by displayName
    const sortUsersByName = (users) => {
        return users.sort((a, b) => a.displayName.localeCompare(b.displayName));
    };

    // Function to handle adding a user
    const handleAddUser = (user) => {
        onAddUser(user);
        onClose(); // Close the dialog after adding a user
    };

    const onAddUser = (user) => {
        const recordProposal = {'employee': user.mail, 'customer' : resourcingData.Customer, 'project': resourcingData.Description, 'role' : resourcingData.role, 'monthlyDetails': resourcingData.monthlyDetails} 
        console.log('added:', recordProposal)
        
    }
    // Function to check if a user should be included in View 1
    const isUserEligibleForView1 = (user) => {

        // Check if user has no jobs or less than 5 days allocated in any month specified in propData
        const eligibleMonths = Object.keys(propData.monthlyDetails);
        return eligibleMonths.every(month => {
            const bookingInMonth = user.booked.find(booking => booking.month === month);
            // If no booking for that month or less than 5 days allocated, user is eligible
            return !bookingInMonth || bookingInMonth.days_allocated < 5;
        });
    };
    // Function to process the data based on the `view`
    const processData = (view, users) => {
        let processedUsers = filterInvalidUsers(users);
        processedUsers = filterByDepartment(processedUsers, departmentFilter);
        processedUsers = sortUsersByName(processedUsers);

        if (view === 1) {
            // Apply the filter logic for view 1
            return processedUsers.filter(user => isUserEligibleForView1(user));
        } else {
            // Return all data for view 2
            return processedUsers;
        }
    };

    const usersToDisplay = processData(view, resources);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {view === 1 ? 'Users with No Jobs or Less Than 5 Days Allocated' : 'All Users'}
                <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <Box textAlign="center" p={2}>
                 {/* Department Filter Dropdown */}
                 <FormControl fullWidth>
                    <InputLabel id="department-select-label">Department</InputLabel>
                    <Select
                        labelId="department-select-label"
                        id="department-select"
                        value={departmentFilter}
                        label="Department"
                        onChange={(event) => setDepartmentFilter(event.target.value)}
                        displayEmpty
                    >
                        <MenuItem value="">
                            <em>All Departments</em>
                        </MenuItem>
                        {departments.map((department, index) => (
                            <MenuItem key={index} value={department}>{department}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button onClick={() => setView(1)} color="primary" variant={view === 1 ? 'contained' : 'text'}>
                    View 1
                </Button>
                <Button onClick={() => setView(2)} color="secondary" variant={view === 2 ? 'contained' : 'text'}>
                    View 2
                </Button>
                {/* Dropdown or text input to filter by department */}
                {/* Implement the department filter input here */}
            </Box>
            <List>
                {usersToDisplay.map((user, index) => (
                    <ListItem button key={index}
                    secondaryAction={
                        <IconButton edge="end" onClick={() => handleAddUser(user)} >
                          <AddCircleIcon />
                        </IconButton>
                      }>
                        <ListItemText
                            primary={user.displayName}
                            secondary={`${user.jobTitle} - ${user.department}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
};


