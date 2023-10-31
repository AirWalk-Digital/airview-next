import { useState, useEffect } from 'react';
import {
    Box, Table, TableBody, TableCell, TableHead, TableRow, Paper, Select, MenuItem, InputLabel, FormControl,
    Dialog, DialogContent, DialogTitle, Button
} from '@mui/material';

function determineColor(daysAllocated, daysHypo) {
    const hypo = parseInt(daysHypo, 10);
    if (daysAllocated > hypo + 3) return 'red';
    if (daysAllocated < hypo - 1) return 'blue';
    return 'green';
}

function Row({ data, displayedMonths, setPopupContent, setShowPopup }) {
    return (
        <TableRow>
            <TableCell style={{ whiteSpace: 'nowrap', width: 'max-content' }}>
                {data.displayName || data.name}
            </TableCell>
            <TableCell style={{ whiteSpace: 'nowrap', width: 'max-content' }}>
                {data.department || "Associate"}
            </TableCell>

            {displayedMonths.map(month => (
                <TableCell
                    key={month}
                    style={{
                        backgroundColor: data.booked.some(item => item.month === month) ?
                            determineColor(data.booked.find(item => item.month === month).days_allocated,
                                data.booked.find(item => item.month === month).days_hypo)
                            : 'transparent'
                    }}
                    onClick={() => {
                        const monthData = data.booked.find(item => item.month === month);
                        setPopupContent(monthData ? monthData.jobs : null);
                        setShowPopup(true);
                    }}
                >
                    {data.booked.some(item => item.month === month) &&
                        data.booked.find(item => item.month === month).jobs.reduce((sum, job) => sum + parseInt(job.Days, 10), 0)}
                </TableCell>
            ))}
        </TableRow>
    );
}

export function ResourceTable({ data }) {
    const [filteredData, setFilteredData] = useState(data);
    const [disciplineFilter, setDisciplineFilter] = useState('');
    const [monthStartIndex, setMonthStartIndex] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [popupContent, setPopupContent] = useState(null);

    const months = Array.from(new Set(data.flatMap(item => item.booked.map(b => b.month)))).sort();
    const displayedMonths = months.slice(monthStartIndex, monthStartIndex + 3);

    useEffect(() => {
        if (disciplineFilter) {
            setFilteredData(data.filter(item => item.department === disciplineFilter));
        } else {
            setFilteredData(data);
        }
    }, [disciplineFilter, data]);

    return (
        <Paper>
            <FormControl fullWidth variant="outlined" style={{ marginBottom: '20px' }}>
                <InputLabel>Filter by Discipline</InputLabel>
                <Select
                    value={disciplineFilter}
                    onChange={(e) => setDisciplineFilter(e.target.value)}
                    label="Filter by Discipline"
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {Array.from(new Set(data.map(item => item.department))).map(discipline => (
                        <MenuItem key={discipline} value={discipline}>
                            {discipline}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="10px">
                <Button variant="contained" disabled={monthStartIndex === 0} onClick={() => setMonthStartIndex(prev => prev - 1)}>Previous</Button>
                <Button variant="contained" disabled={monthStartIndex + 3 >= months.length} onClick={() => setMonthStartIndex(prev => prev + 1)}>Next</Button>
            </Box>

            <Table style={{ tableLayout: 'fixed' }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Discipline</TableCell>
                        {displayedMonths.map(month => (
                            <TableCell key={month}>{new Date(month).toLocaleString('default', { month: 'long' })}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredData.map(item => (
                        <Row key={item.name} data={item} displayedMonths={displayedMonths} setPopupContent={setPopupContent} setShowPopup={setShowPopup} />
                    ))}
                </TableBody>
            </Table>

            <Dialog open={showPopup} onClose={() => setShowPopup(false)}>
                <DialogTitle>Job Details</DialogTitle>
                <DialogContent>
                    {popupContent && popupContent.map(job => (
                        <div key={job.Code}>
                            <strong>{job.Description}</strong> ({job.Days} days) for {job.Customer}
                        </div>
                    ))}
                </DialogContent>
            </Dialog>
        </Paper>
    );
}
