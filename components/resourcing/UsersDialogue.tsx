// components/UsersDialog.js
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import { DialogContent } from '@mui/material';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import React, { useEffect, useState } from 'react';
import type { UserInfo } from 'src/model/model';
import { Placeholder } from 'src/model/model';

interface UserProps {
  open: boolean;
  onClose: () => void;
  resourcingData: Placeholder;
  resources: UserInfo[];
}

// Import your JSON data here. In a real-world scenario, you would load this data from a file or API

export const UsersDialog: React.FC<UserProps> = ({
  open,
  onClose,
  resourcingData,
  resources,
}) => {
  const [view, setView] = useState(1);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [departments, setDepartments] = useState<string[]>([]);

  console.log('resourcingData', resourcingData);

  useEffect(() => {
    // Extract distinct departments from the resources
    const uniqueDepartments = Array.from(
      new Set(
        resources.map((user: UserInfo) => user.department).filter(Boolean)
      )
    );
    setDepartments(uniqueDepartments);
  }, [resources]);

  // Function to filter out any users without a displayName or department
  const filterInvalidUsers = (users: UserInfo[]) => {
    return users.filter((user) => user.displayName && user.department);
  };

  // Function to filter users by department
  const filterByDepartment = (users: UserInfo[], department: string) => {
    if (!department) return users;
    return users.filter((user) => user.department === department);
  };

  // Function to sort users by displayName
  const sortUsersByName = (users: UserInfo[]) => {
    return users.sort((a, b) => a.displayName.localeCompare(b.displayName));
  };

  // Function to handle adding a user

  const onAddUser = async (user: UserInfo) => {
    const recordProposal = new Placeholder();
    recordProposal.resource = user.mail;
    recordProposal.role_id = resourcingData.role_id;
    recordProposal.displayName = user.displayName;
    recordProposal.customer = resourcingData.customer;
    recordProposal.description = resourcingData.description;
    recordProposal.code = resourcingData.code;
    recordProposal.role = resourcingData.role;
    recordProposal.monthlyDetails = resourcingData.monthlyDetails;
    console.log('added:', recordProposal);
    try {
      const response = await fetch('/api/resourcing/placeholder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recordProposal),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result); // Process the response as needed
      onClose(); // Close the dialog after adding a user
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };
  // Function to check if a user should be included in View 1
  const isUserEligibleForView1 = (user: UserInfo) => {
    // Check if user has no jobs or less than 5 days allocated in any month specified in propData
    const eligibleMonths = Object.keys(resourcingData.monthlyDetails);
    return eligibleMonths.every((month) => {
      const bookingInMonth = user.jobs.find(
        (booking) => booking.month === month
      );
      // If no booking for that month or less than 5 days allocated, user is eligible
      return !bookingInMonth || bookingInMonth.days_allocated < 5;
    });
  };
  // Function to process the data based on the `view`
  const processData = (currentView: number, users: UserInfo[]) => {
    let processedUsers = filterInvalidUsers(users);
    processedUsers = filterByDepartment(processedUsers, departmentFilter);
    processedUsers = sortUsersByName(processedUsers);

    if (currentView === 1) {
      // Apply the filter logic for view 1
      return processedUsers.filter((user) => isUserEligibleForView1(user));
    }
    // Return all data for view 2
    return processedUsers;
  };

  const usersToDisplay = processData(view, resources);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {/* {view === 1 ? 'Available Users' : 'Employees'} */}
        Select Resource
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack direction='row' spacing={2} justifyContent='space-between'>
          {/* Department Filter Dropdown */}
          <FormControl size='small'>
            {/* <InputLabel id="department-select-label">Department</InputLabel> */}
            <Select
              labelId='department-select-label'
              id='department-select'
              value={departmentFilter}
              label='Department'
              onChange={(event) => setDepartmentFilter(event.target.value)}
              displayEmpty
            >
              <MenuItem value=''>
                <em>All Departments</em>
              </MenuItem>
              {departments.map((department, index) => (
                <MenuItem
                  // this is bad for rendering performance
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  value={department}
                >
                  {department}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <ButtonGroup disableElevation variant='contained'>
            <Button
              onClick={() => setView(1)}
              variant={view === 1 ? 'contained' : 'text'}
            >
              Available
            </Button>
            <Button
              onClick={() => setView(2)}
              variant={view === 2 ? 'contained' : 'text'}
            >
              Everyone
            </Button>
          </ButtonGroup>
          {/* Dropdown or text input to filter by department */}
          {/* Implement the department filter input here */}
        </Stack>
        <List>
          {usersToDisplay.map((user: UserInfo, index: number) => (
            <ListItem
              // this is bad for rendering performance
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              secondaryAction={
                <IconButton edge='end' onClick={() => onAddUser(user)}>
                  <AddCircleIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={user.displayName}
                secondary={`${user.jobTitle} - ${user.department}`}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};
