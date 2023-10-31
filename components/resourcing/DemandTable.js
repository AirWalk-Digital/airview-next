import { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableHead, TableRow, Paper, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';

export function DemandTable({ data }) {
    const [filteredData, setFilteredData] = useState([]);
    const [customerFilter, setCustomerFilter] = useState('');
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

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Customer</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Resource</TableCell>

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
                            <TableCell></TableCell>
                            {displayedMonths.map(month => (
                                <TableCell key={month}>
                                    {item.monthlyDetails && item.monthlyDetails[month] && item.monthlyDetails[month].days_allocated}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}
