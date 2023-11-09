import React, { useState, useEffect } from 'react';
import {
    Box,
    Chip,
    Table,
    Switch, FormGroup, FormControlLabel,
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
    Skeleton,
    Stack
} from '@mui/material';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';

function determineColor(daysAllocated, daysHypo) {
    const hypo = parseInt(daysHypo, 10);
    if (daysAllocated > hypo + 3) return 'error';
    if (daysAllocated < hypo - 1) return 'primary';
    return 'success';
}

function UserPopup({ data, open, handleClose }) {
    // Example toggles' state
    const [toggle1, setToggle1] = useState(false);
    const [toggle2, setToggle2] = useState(false);
    const [toggle3, setToggle3] = useState(false);

    // Handle toggle change
    const handleToggleChange = (toggleSetter) => (event) => {
        toggleSetter(event.target.checked);
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>
                {data.displayName || data.name}
                <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={toggle1}
                                onChange={handleToggleChange(setToggle1)}
                            />
                        }
                        label="SC Cleared"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={toggle2}
                                onChange={handleToggleChange(setToggle2)}
                            />
                        }
                        label="TIR"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={toggle3}
                                onChange={handleToggleChange(setToggle3)}
                            />
                        }
                        label="Mansion House"
                    />
                </FormGroup>
            </DialogContent>
        </Dialog>
    );
}


function Row({ data, displayedMonths, setPopupContent, setShowPopup, placeholder }) {
    // console.debug('Row: ', data)
    // if (placeholder) {
    //     console.debug('Placeholder: ', placeholder)
    // }
    // {
    const [popupOpen, setPopupOpen] = useState(false);

    const handleInfoClick = () => {
        setPopupOpen(!popupOpen);
    };

    const handleClose = () => {
        setPopupOpen(false);
    };


    return (
        <TableRow>
            <TableCell style={{ whiteSpace: 'nowrap', width: 'max-content' }}>
                <Stack direction="row" spacing={1}
                    justifyContent="space-between"
                    alignItems="center">
                    {data.displayName || data.name}
                    <InfoIcon onClick={handleInfoClick} />
                </Stack>
                {popupOpen && <UserPopup data={data} open={popupOpen} handleClose={handleClose} />}

            </TableCell>
            <TableCell style={{ whiteSpace: 'nowrap', width: 'max-content' }}>
                {data.department || "Associate"}
            </TableCell>

            {displayedMonths.map(month => (
                <TableCell
                    align="center"
                    size="small"
                    // sx={{ width: '100px' }}
                    key={month}
                    // style={{
                    //     backgroundColor: data.jobs.some(item => item.month === month) ?
                    //         determineColor(data.jobs.find(item => item.month === month).days_allocated,
                    //             data.jobs.find(item => item.month === month).days_hypo)
                    //         : 'transparent'
                    // }}
                    onClick={() => {
                        const monthData = data.jobs.find(item => item.month === month);
                        setPopupContent(monthData ? monthData.jobs : null);
                        setShowPopup(true);
                    }}
                ><Stack direction="row" spacing={1} justifyContent="center"
                    alignItems="center">

                        {data.jobs.some(item => item.month === month) && data.jobs.find(item => item.month === month).holiday > 0 &&
                            <Chip
                                icon={<BeachAccessIcon />}
                                sx={{ color: 'primary' }}
                                label={data.jobs.find(item => item.month === month).holiday}
                            />

                        }
                        {
                            placeholder &&
                            placeholder.monthlyDetails &&
                            placeholder.monthlyDetails[month] && (
                                // <WorkOutlineIcon />
                                <Chip
                                    icon={<WorkOutlineIcon />}
                                    sx={{ color: 'primary' }}
                                    label={placeholder.monthlyDetails[month].days_allocated}
                                />
                            )
                        }
                        {data.jobs.some(item => item.month === month) && data.jobs.find(item => item.month === month).days_allocated > 0 &&

                            <Chip
                                sx={{
                                    color: 'white',
                                    width: '100%'
                                    // minWidth: (placeholder?.monthlyDetails?.[month]?.days_allocated > 0) ? '50px' : '100px',
                                }}
                                color={
                                    data.jobs.some(item => item.month === month) ?
                                        determineColor(data.jobs.find(item => item.month === month).days_allocated,
                                            data.jobs.find(item => item.month === month).days_hypo)
                                        : 'transparent'
                                } label={data.jobs.find(item => item.month === month).jobs.reduce((sum, job) => sum + parseInt(job.days, 10), 0)} />
                        }

                    </Stack>
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

export function ResourceTable({ bench = false }) {
    const [data, setData] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [disciplineFilter, setDisciplineFilter] = useState('');
    const [monthStartIndex, setMonthStartIndex] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [popupContent, setPopupContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [placeholder, setPlaceholder] = useState(null);
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
        const fetchPlaceholderData = async () => {

            try {
                const response = await fetch('/api/resourcing/placeholder');
                if (!response.ok) throw new Error('Network response was not ok');
                const fetchedData = await response.json();
                console.debug('Resource:placeholder: ', fetchedData.content)

                // const jsonParsedData = JSON.parse(fetchedData.content.length > 0 ? fetchedData.content : null)
                setPlaceholder(groupByMailAndSumDays(fetchedData.content)); // Adjust according to actual API response
                // console.debug('Resource:placeholder: ', jsonParsedData)

            } catch (err) {
                console.error('Resource:ERROR: ', err)
            }
        };

        fetchData();
        fetchPlaceholderData();
    }, []);

    function groupByMailAndSumDays(data) {
        const groupedData = {};

        data.forEach(item => {
            if (!groupedData[item.resource]) {
                groupedData[item.resource] = { displayName: item.displayName, monthlyDetails: {} };
                Object.keys(item.monthlyDetails).forEach(month => {
                    groupedData[item.resource].monthlyDetails[month] = { days_allocated: item.monthlyDetails[month].days_allocated };
                })
            } else {
                Object.keys(item.monthlyDetails).forEach(month => {
                    if (!groupedData[item.resource].monthlyDetails[month]) {
                        groupedData[item.resource].monthlyDetails[month] = { days_allocated: item.monthlyDetails[month].days_allocated };
                    } else {
                        groupedData[item.resource].monthlyDetails[month].days_allocated += item.monthlyDetails[month].days_allocated;
                    }
                });
            }
        });

        return groupedData;
    }


    useEffect(() => {
        const sortUsersByName = (users) => {
            return users
                .filter(user => user.displayName != null)
                .sort((a, b) => a.displayName.localeCompare(b.displayName));
        };

        const filterRowsWithNoJobsInDisplayedMonths = (users) => {
            return users.filter(user =>
                displayedMonths.some(month =>
                    !user.jobs.some(job => job.month === month)
                )
            );
        };



        const filterRowsWithNoJobsAndLessHolidays = (users, displayedMonths) => {
            return users.filter(user => {
                // Condition 1: Check if the user has no jobs in one or more of the displayed months
                const hasNoJobsInDisplayedMonths = displayedMonths.some(month =>
                    !user.jobs.some(job => job.month.startsWith(month))
                );

                // Condition 2: Check if days_allocated plus holiday is less than days_hypo minus 3, using 20 if days_hypo is undefined
                const hasLessDaysAllocated = user.jobs.some(job => {
                    const holiday = job.holiday || 0; // If there is no holiday, default to 0
                    const daysHypo = job.days_hypo || 20; // Use 20 if days_hypo is not defined
                    return (job.days_allocated + holiday) < (daysHypo - 3);
                });

                // Return true if either condition is met
                return hasNoJobsInDisplayedMonths || hasLessDaysAllocated;
            });
        };

        console.debug(data)
        if (data && !isLoading) {
            let usersToDisplay = sortUsersByName(data);

            if (disciplineFilter) {
                usersToDisplay = usersToDisplay.filter(item => item.department === disciplineFilter);
            }

            if (bench) { // Only apply this filter if bench prop is true
                usersToDisplay = filterRowsWithNoJobsAndLessHolidays(usersToDisplay, displayedMonths);
            }

            setFilteredData(usersToDisplay);
        }
    }, [disciplineFilter, data, bench, displayedMonths]);


    // console.log('placeholder: ', placeholder)
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
                                value=''
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
                        {displayedMonths.map((month, index) => (<TableCell align='center' key={month} sx={{ mx: '5px', pl: index === 0 ? '0px' : '5px', pr: index === 2 ? '0px' : '5px' }}>
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
                        <Row
                            key={item.name}
                            data={item}
                            displayedMonths={displayedMonths}
                            setPopupContent={setPopupContent}
                            setShowPopup={setShowPopup}
                            placeholder={placeholder && placeholder[item.mail] ? placeholder[item.mail] : null}
                        />

                    ))}
                </TableBody>
            </Table>

            <Dialog fullWidth open={showPopup} onClose={() => setShowPopup(false)}>
                <DialogTitle>Job Details
                <IconButton onClick={() => setShowPopup(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <CloseIcon />
                </IconButton>
                </DialogTitle>
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
