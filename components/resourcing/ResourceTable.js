import React, { useState, useEffect } from 'react';
import {
    Box,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    InputLabel,
    IconButton,
    FormControl,
    Dialog,
    DialogContent,
    DialogTitle,
    Button,
    Skeleton
} from '@mui/material';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function determineColor(daysAllocated, daysHypo) {
    const hypo = parseInt(daysHypo, 10);
    if (daysAllocated > hypo + 3) return 'red';
    if (daysAllocated < hypo - 1) return 'blue';
    return 'green';
}

function Row({ data, displayedMonths, setPopupContent, setShowPopup }) {
    console.debug('Row: ', data)
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
                        backgroundColor: data.jobs.some(item => item.month === month) ?
                            determineColor(data.jobs.find(item => item.month === month).days_allocated,
                                data.jobs.find(item => item.month === month).days_hypo)
                            : 'transparent'
                    }}
                    onClick={() => {
                        const monthData = data.jobs.find(item => item.month === month);
                        setPopupContent(monthData ? monthData.jobs : null);
                        setShowPopup(true);
                    }}
                >
                    {data.jobs.some(item => item.month === month) &&
                        <Chip sx={{ color: 'white' }} variant="outlined" color="info" label={data.jobs.find(item => item.month === month).jobs.reduce((sum, job) => sum + parseInt(job.days, 10), 0)} />
                    }
                </TableCell>
            ))}
        </TableRow>
    );
}

const ResourceTableSkeleton = () => {
    return (
        <Table size="small" style={{ tableLayout: 'fixed' }}>
            <TableHead>
                <TableRow>
                    <TableCell colSpan={6}>
                        <Skeleton variant="rectangular" width="100%" height={20} />
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {[...Array(10)].map((e, i) => (
                    <TableRow key={i}>
                        {[...Array(6)].map((e, index) => (
                            <TableCell key={index}>
                                <Skeleton variant="text" />
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export function ResourceTable() {
    const [data, setData] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [disciplineFilter, setDisciplineFilter] = useState('');
    const [monthStartIndex, setMonthStartIndex] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [popupContent, setPopupContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [months, setMonths] = useState([]);
    //   const [months, setMonths] = useState([]);



    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/resourcing/resources');
                if (!response.ok) throw new Error('Network response was not ok');
                const fetchedData = await response.json();
                const jsonParsedData = JSON.parse(fetchedData.content)
                setData(jsonParsedData); // Adjust according to actual API response
                setMonths(Array.from(new Set(jsonParsedData.flatMap(item => item.jobs.map(b => b.month)))).sort())
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const sortUsersByName = (users) => {
            return users
                .filter(user => user.displayName != null)
                .sort((a, b) => a.displayName.localeCompare(b.displayName));
        };
        console.debug(data)
        if (data && !isLoading) {
            if (disciplineFilter) {
                setFilteredData(sortUsersByName(data.filter(item => item.department === disciplineFilter)));
            } else {
                setFilteredData(sortUsersByName(data));
            }
        }
    }, [disciplineFilter, data]);

    // Ensure we only proceed if data is an array
    // const isDataArray = Array.isArray(data);
    // const months = isDataArray ? Array.from(new Set(data.flatMap(item => item.booked.map(b => b.month)))).sort() : [];
    // const disciplines = isDataArray ? Array.from(new Set(data.map(item => item.department))) : [];
    const displayedMonths = months ? months.slice(monthStartIndex, monthStartIndex + 3) : [];

    if (isLoading) {
        return <ResourceTableSkeleton />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Paper>
            {/* <FormControl fullWidth variant="outlined" style={{ marginBottom: '20px' }}>
                <InputLabel>Filter by Discipline</InputLabel>
                <Select
                    value={disciplineFilter}
                    onChange={(e) => setDisciplineFilter(e.target.value)}
                    label="Filter by Discipline"
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {Array.from(new Set(data?.map(item => item.department) || [])).map(discipline => (
                        <MenuItem key={discipline} value={discipline}>
                            {discipline}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl> */}

            {/* <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="10px">
                <Button variant="contained" disabled={monthStartIndex === 0} onClick={() => setMonthStartIndex(prev => prev - 1)}>Previous</Button>
                <Button variant="contained" disabled={monthStartIndex + 3 >= months.length} onClick={() => setMonthStartIndex(prev => prev + 1)}>Next</Button>
            </Box> */}

            <Table size="small" style={{ tableLayout: 'fixed' }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Discipline
                            <Select
                                value='{}'
                                onChange={(e) => setDisciplineFilter(e.target.value)}
                                displayEmpty
                                size="small"
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
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {Array.from(new Set(data?.map(item => item.department) || []))
                                    .sort() // This will sort the array alphabetically
                                    .map(discipline => (
                                        <MenuItem key={discipline} value={discipline}>
                                            {discipline}
                                        </MenuItem>
                                    ))}

                            </Select>
                        </TableCell>
                        {displayedMonths.map((month, index) => (<TableCell key={month} sx={{ pl: index === 1 ? '0px' : '8px' }}>
                            {index === 0 && (
                                <IconButton
                                    // sx={{ position: 'absolute', right: 8, top: 8 }}


                                    disabled={monthStartIndex === 0}
                                    onClick={() => setMonthStartIndex(prev => Math.max(prev - 1, 0))}
                                    sx={{ pl: '0' }}
                                >
                                    <ChevronLeftIcon />
                                </IconButton>
                            )}
                            {new Date(month).toLocaleString('default', { month: 'long' })}
                            {index === displayedMonths.length - 1 && (
                                <IconButton variant="contained"
                                    disabled={monthStartIndex + 3 >= months.length}
                                    onClick={() => setMonthStartIndex(prev => Math.min(prev + 1, months.length - 3))}
                                    sx={{ marginLeft: 1 }}
                                >
                                    <ChevronRightIcon />
                                </IconButton>
                            )}
                        </TableCell>))}
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
                        <div key={typeof job.job_s_ord_code === 'string' ? job.job_s_ord_code : job.description}>
                            <strong>{job.description}</strong> ({job.days} days) for {typeof job.customer === 'string' ? job.customer : 'OTHER'}
                        </div>
                    ))}
                </DialogContent>
            </Dialog>
        </Paper>
    );
}

export default ResourceTable;
