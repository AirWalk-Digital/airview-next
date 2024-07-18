import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonIcon from '@mui/icons-material/Person';
import {
  Chip,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import type { Placeholder, Resource } from 'src/model/model';

import { UsersDialog } from './UsersDialogue';

const DemandTableSkeleton = () => {
  return (
    <Table size='small' style={{ tableLayout: 'auto' }}>
      <TableHead>
        <TableRow>
          <TableCell colSpan={5}>
            <Skeleton variant='rectangular' width='100%' height={20} />
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <TableRow key={i}>
            {[...Array(5)].map((_, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <TableCell key={index}>
                <Skeleton variant='text' />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const Resources = (role: Role, resources: Resource) => {
  // console.log('Resource:role: ', role)
  const [resource, setResource] = useState<Resource | null>(null);
  const [popupContent, setPopupContent] = useState<Role | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // console.log('Resource:useEffect')
      console.log('Resource:role: ', role);
      try {
        const response = await fetch(
          `/api/resourcing/placeholder?code=${role.code}&role_id=${String(
            role.id
          )}`
        );
        if (!response.ok) throw new Error('Network response was not ok');
        const fetchedData = await response.json();
        // console.log('Resource:response: ', response)

        const jsonParsedData = JSON.parse(fetchedData.content);
        // console.log('Resource:jsonParsedData: ', jsonParsedData)

        setResource(jsonParsedData); // Adjust according to actual API response
        // console.log('Resource:jsonParsedData: ', jsonParsedData)
      } catch (err) {
        console.error('Resource:ERROR: ', err);
      }
    };

    fetchData();
  }, [role, showPopup]);

  const handleDelete = async (selectedRole: Role) => {
    try {
      const response = await fetch(
        `/api/resourcing/placeholder?code=${selectedRole.code}&role_id=${selectedRole.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setResource(null);
      const result = await response.json();
      console.log(result); // Process the response as needed
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  return (
    <>
      <Stack
        direction='row'
        spacing={1}
        justifyContent='flex-end'
        alignItems='center'
      >
        {resource && (
          <Chip
            variant='outlined'
            label={resource.displayName}
            icon={<PersonIcon />}
            onDelete={() => handleDelete(role)}
          />
        )}
        <IconButton
          onClick={() => {
            setPopupContent(role);
            setShowPopup(true);
          }}
        >
          <AddCircleIcon />
        </IconButton>
      </Stack>
      {popupContent && (
        <UsersDialog
          open={showPopup}
          onClose={() => setShowPopup(false)}
          resourcingData={popupContent}
          resources={resources}
        />
      )}
    </>
  );
};

interface DemandTableProps {
  isLoading: boolean;
  months: string[];
  data: string;
  error: string;
  resources: Resource[];
}

export const DemandTable: React.FC<DemandTableProps> = ({
  isLoading,
  months,
  data,
  error,
  resources,
}) => {
  const [filteredData, setFilteredData] = useState([]);
  const [customerFilter, setCustomerFilter] = useState('');
  const [monthStartIndex, setMonthStartIndex] = useState(0);

  console.log('DemandTable:data: ', data);
  useEffect(() => {
    if (data) {
      const groupedData: Placeholder[] = [];

      data.forEach((item) => {
        Object.keys(item.Roles || {}).forEach((month) => {
          item.Roles[month].forEach((roleDetail) => {
            const existingEntry = groupedData.find(
              (groupData) =>
                groupData.customer === item.Customer &&
                // e.Description === roleDetail.Description &&
                groupData.role === roleDetail.role
            );

            if (existingEntry) {
              existingEntry.monthlyDetails[month] = roleDetail;
            } else {
              groupedData.push({
                customer: item.Customer,
                code: item.Code,
                description: item.Description,
                role: roleDetail.role,
                role_id: roleDetail.role_id,
                grade: roleDetail.grade,
                monthlyDetails: { [month]: roleDetail },
              });
            }
          });
        });
      });

      if (customerFilter) {
        setFilteredData(
          groupedData.filter((item) => item.Customer === customerFilter)
        );
      } else {
        setFilteredData(groupedData);
        // console.log('groupedData: ', groupedData)
      }
    }
  }, [customerFilter, data]);

  if (isLoading) {
    return <DemandTableSkeleton />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const displayedMonths = months
    ? months.slice(monthStartIndex, monthStartIndex + 3)
    : [];

  return (
    <Paper>
      {/* <FormControl fullWidth variant="outlined" style={{ marginBottom: '20px' }}>
                <InputLabel>Filter by Customer</InputLabel>
                <Select
                    value={customerFilter}
                    onChange={(e) => setCustomerFilter(e.target.value)}
                    label="Filter by Customer"
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {Array.from(new Set(data?.map(item => item.Customer))).map(customer => (
                        <MenuItem key={customer} value={customer}>
                            {customer}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl> */}

      <Table size='small' style={{ tableLayout: 'auto' }}>
        <TableHead>
          <TableRow>
            <TableCell>
              Customer
              <Select
                value=''
                onChange={(e) => setCustomerFilter(e.target.value)}
                displayEmpty
                size='small'
                // sx={{ ml: 1 }}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                    outline: 'none',
                  },
                  '&.MuiSelect-select:focus': {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                <MenuItem value='' />
                {Array.from(new Set(data?.map((item) => item.Customer) || []))
                  .sort() // This will sort the array alphabetically
                  .map((customer) => (
                    <MenuItem key={customer} value={customer}>
                      {customer}
                    </MenuItem>
                  ))}
              </Select>
            </TableCell>
            <TableCell>JSO</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Resource</TableCell>

            {displayedMonths.map((month) => (
              <TableCell align='center' key={month}>
                {new Date(month).toLocaleString('default', { month: 'long' })}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.Customer}</TableCell>
              <TableCell>{item.Description}</TableCell>
              <TableCell>
                {item.role} {item.grade !== 'N/A' ? `[${item.grade}]` : ''}
              </TableCell>
              <TableCell>
                <Resources role={item} resources={resources} />
              </TableCell>
              {displayedMonths.map((month) => (
                <TableCell
                  key={month}
                  // style={{ backgroundColor: (item.monthlyDetails && item.monthlyDetails[month] && item.monthlyDetails[month].days_allocated) ? 'blue' : 'transparent' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                    }}
                  >
                    {item.monthlyDetails && item.monthlyDetails[month] && (
                      <Chip
                        sx={{ minWidth: '100px' }}
                        color='primary'
                        label={
                          parseInt(
                            item.monthlyDetails[month].days_allocated,
                            10
                          ) +
                          parseInt(item.monthlyDetails[month].days_forecast, 10)
                        }
                      />
                    )}{' '}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};
