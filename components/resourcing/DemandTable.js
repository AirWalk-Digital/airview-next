import { useState, useEffect } from 'react';
import {
    Stack, Dialog, DialogContent, DialogTitle, Chip, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Paper, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonIcon from '@mui/icons-material/Person';
import { UsersDialog } from '@/components/resourcing'


export function DemandTable({ data, users, resources}) {
    const [filteredData, setFilteredData] = useState([]);
    const [customerFilter, setCustomerFilter] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [popupContent, setPopupContent] = useState(null);
    const [displayedMonths] = useState([
        "2023-11-01T00:00:00.000", "2023-12-01T00:00:00.000", "2024-01-01T00:00:00.000"
    ]);

    useEffect(() => {
        let groupedData = [];

        data.forEach(item => {
            Object.keys(item.Roles || {}).forEach(month => {
                item.Roles[month].forEach(roleDetail => {
                    const existingEntry = groupedData.find(
                        e => e.Customer === item.Customer &&
                            e.Description === item.Description &&
                            e.role === roleDetail.role
                    );

                    if (existingEntry) {
                        existingEntry.monthlyDetails[month] = roleDetail;
                    } else {
                        groupedData.push({
                            Customer: item.Customer,
                            Description: item.Description,
                            role: roleDetail.role,
                            monthlyDetails: { [month]: roleDetail }
                        });
                    }
                });
            });
        });

        if (customerFilter) {
            setFilteredData(groupedData.filter(item => item.Customer === customerFilter));
        } else {
            setFilteredData(groupedData);
        }
    }, [customerFilter, data, displayedMonths]);

    return (
        <Paper>
            <FormControl fullWidth variant="outlined" style={{ marginBottom: '20px' }}>
                <InputLabel>Filter by Customer</InputLabel>
                <Select
                    value={customerFilter}
                    onChange={(e) => setCustomerFilter(e.target.value)}
                    label="Filter by Customer"
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {Array.from(new Set(data.map(item => item.Customer))).map(customer => (
                        <MenuItem key={customer} value={customer}>
                            {customer}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Table size="small" style={{ tableLayout: 'auto' }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Customer</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Proposed Resource</TableCell>

                        {displayedMonths.map(month => (
                            <TableCell key={month}>{new Date(month).toLocaleString('default', { month: 'long' })}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredData.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>{item.Customer}</TableCell>
                            <TableCell>{item.Description}</TableCell>
                            <TableCell>{item.role}</TableCell>
                            <TableCell>
                                <Stack direction="row" spacing={1}>
                                    <Resources />

                                    <IconButton
                                    onClick={() => {
                                        
                                        setPopupContent(item);
                                        setShowPopup(true);
                                    }}>
                                        <AddCircleIcon />
                                    </IconButton>
                                </Stack>
                            </TableCell>
                            {displayedMonths.map(month => (
                                <TableCell key={month} style={{ backgroundColor: (item.monthlyDetails && item.monthlyDetails[month] && item.monthlyDetails[month].days_allocated) ? 'blue' : 'transparent' }} >
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '100%'
                                    }}>
                                        {item.monthlyDetails && item.monthlyDetails[month] && <Chip color="primary" label={item.monthlyDetails[month].days_allocated} />}
                                    </div>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>


            {popupContent && <UsersDialog open={showPopup} onClose={() => setShowPopup(false)} resourcingData={popupContent} users={users} resources={resources}/>}
                
        </Paper>
    );
}



function Resources() {
    return (
        <Stack spacing={1}>
            <Chip variant="outlined" label="user one sdlkjsdlkjsd" icon={<PersonIcon />} />
            <Chip variant="outlined" label="user" icon={<PersonIcon />} />
        </Stack>
    )
}