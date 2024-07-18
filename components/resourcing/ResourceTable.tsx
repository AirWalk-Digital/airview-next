/* eslint-disable react/jsx-no-useless-fragment */
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import type {
  JobsExtraDetail,
  JobsInfo,
  PlaceholderData,
  Resource,
  UserInfo,
} from 'src/model/model';
import { Placeholder } from 'src/model/model';
import { RoleDetails } from 'src/model/RoleDetails';

interface UserPopupProps {
  data: UserInfo;
  open: boolean;
  handleClose: () => void;
}

const LoadingSkeleton = () => {
  return (
    <FormGroup>
      {Array.from(new Array(3)).map((_, index) => (
        <FormControlLabel
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          control={<Skeleton variant='rectangular' width={40} height={20} />}
          label={<Skeleton variant='text' width={100} />}
        />
      ))}
    </FormGroup>
  );
};

const determineColor = (info?: JobsInfo) => {
  if (!info) {
    return 'error';
  }

  // Provide default values when fields are null
  const hypo = info.days_hypo;
  const working = info.days_working;
  const holiday = info.holidays;
  const days = info.days_allocated;
  if (hypo === 0) {
    return 'primary';
  }
  if (days + holiday > working) return 'error';
  if (days + holiday < hypo) return 'primary';
  return 'success';
};

const UserPopup: React.FC<UserPopupProps> = ({ data, open, handleClose }) => {
  // Example toggles' state
  const [toggleSC, setToggleSC] = useState(false);
  const [toggleTIR, setToggleTIR] = useState(false);
  const [toggleMH, setToggleMH] = useState(false);
  const [resource, setResource] = useState<Resource | null>(null);

  const updateUser = async () => {
    const recordProposal = {
      resource: data.mail,
      sc: toggleSC,
      tir: toggleTIR,
      mh: toggleMH,
    };
    try {
      const response = await fetch('/api/resourcing/resources', {
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
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  // Handle toggle change
  const handleToggleChange =
    (toggleSetter: React.Dispatch<React.SetStateAction<boolean>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      toggleSetter(event.target.checked);
    };

  useEffect(() => {
    if (resource) {
      setToggleSC(resource.sc);
      setToggleTIR(resource.tir);
      setToggleMH(resource.mh);
    }
  }, [resource]);

  useEffect(() => {
    if (resource) {
      updateUser();
    }
  }, [toggleSC, toggleTIR, toggleMH]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/resourcing/resources?resource=${data.mail}`
        );
        if (!response.ok) throw new Error('Network response was not ok');
        const fetchedData = await response.json();

        if (fetchedData.content && fetchedData.content.length > 0) {
          const jsonParsedData = JSON.parse(fetchedData.content);
          setResource(jsonParsedData); // Adjust according to actual API response
        } else {
          // record doesn't exist yet
          const recordProposal = {
            resource: data.mail,
            sc: false,
            tir: false,
            mh: false,
          };

          setResource(recordProposal); // Adjust according to actual API response
        }
      } catch (err) {
        console.error('Resource:ERROR: ', err);
      }
    };

    fetchData();
  }, []);

  if (!resource) {
    return (
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>
          {data.displayName || data.name} {` - ${data.jobTitle}` || ''}
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <LoadingSkeleton />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>
        {data.displayName || data.name} {` - ${data.jobTitle}` || ''}
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={toggleSC}
                onChange={handleToggleChange(setToggleSC)}
              />
            }
            label='SC Cleared'
          />
          <FormControlLabel
            control={
              <Switch
                checked={toggleTIR}
                onChange={handleToggleChange(setToggleTIR)}
              />
            }
            label='TIR'
          />
          <FormControlLabel
            control={
              <Switch
                checked={toggleMH}
                onChange={handleToggleChange(setToggleMH)}
              />
            }
            label='Mansion House'
          />
        </FormGroup>
      </DialogContent>
    </Dialog>
  );
};

const ResourceInfo: React.FC<{ info: Resource }> = ({ info }) => {
  if (!info) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }
  return (
    <Stack
      direction='row'
      justifyContent='flex-start'
      alignItems='center'
      spacing={0.5}
    >
      {info.sc && <Chip size='small' label='SC' variant='outlined' />}
      {info.mh && <Chip size='small' label='MH' variant='outlined' />}
      {info.tir && <Chip size='small' label='TIR' variant='outlined' />}
    </Stack>
  );
};

interface RowProps {
  data: UserInfo;
  displayedMonths: string[];
  setPopupContent: (content: any) => void;
  setShowPopup: (show: boolean) => void;
  placeholderItem?: Placeholder;
  refreshData: () => void;
}

const Row: React.FC<RowProps> = ({
  data,
  displayedMonths,
  setPopupContent,
  setShowPopup,
  placeholderItem,
  refreshData,
}) => {
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
        <Stack
          direction='row'
          spacing={1}
          justifyContent='space-between'
          alignItems='center'
        >
          {data.displayName || data.name}
          {data.info && <ResourceInfo info={data.info} />}
          <InfoIcon onClick={handleInfoClick} />
        </Stack>
        {popupOpen && (
          <UserPopup
            data={data}
            open={popupOpen}
            handleClose={() => {
              handleClose();
              refreshData(); // <-- Invoke refreshData after closing the popup
            }}
          />
        )}
      </TableCell>
      <TableCell style={{ whiteSpace: 'nowrap', width: 'max-content' }}>
        {data.department || 'Associate'}
      </TableCell>

      {displayedMonths.map((month) => {
        const monthData = data.jobs.find((item) => item.month === month);
        if (!monthData) {
          return <></>;
        }
        const isMonthWithHolidays = monthData.holidays > 0;
        const isMonthWithDaysAllocated = monthData?.days_allocated > 0;
        const isMonthForecast = monthData?.days_forecast > 0;

        const chosenMonth = placeholderItem?.monthlyDetails[month];
        return (
          <TableCell
            align='center'
            size='small'
            // sx={{ width: '100px' }}
            key={month}
            // style={{
            //     backgroundColor: data.jobs.some(item => item.month === month) ?
            //         determineColor(data.jobs.find(item => item.month === month).days_allocated,
            //             data.jobs.find(item => item.month === month).days_hypo)
            //         : 'transparent'
            // }}
            onClick={() => {
              setPopupContent(monthData ? monthData.jobs : null);
              setShowPopup(true);
            }}
          >
            <Stack
              direction='row'
              spacing={1}
              justifyContent='center'
              alignItems='center'
            >
              {isMonthWithHolidays && (
                <Chip
                  icon={<BeachAccessIcon />}
                  sx={{ color: 'primary' }}
                  label={monthData.holidays}
                />
              )}
              {chosenMonth && (
                // <WorkOutlineIcon />
                <Chip
                  icon={<WorkOutlineIcon />}
                  sx={{ color: 'primary' }}
                  label={chosenMonth.days_allocated}
                />
              )}
              {isMonthWithDaysAllocated && (
                <Chip
                  sx={{
                    color: 'white',
                    width: '100%',
                    // minWidth: (placeholder?.monthlyDetails?.[month]?.days_allocated > 0) ? '50px' : '100px',
                  }}
                  color={determineColor(
                    data.jobs.find((item) => item.month === month)
                  )}
                  label={monthData.days_allocated}
                />
              )}
              {isMonthForecast && (
                <Chip
                  sx={{
                    color: 'grey',
                    width: '100%',
                    // minWidth: (placeholder?.monthlyDetails?.[month]?.days_allocated > 0) ? '50px' : '100px',
                  }}
                  // color={
                  //     data.jobs.some(item => item.month === month) ?
                  //         determineColor(data.jobs.find(item => item.month === month))
                  //         : 'transparent'
                  // }
                  label={monthData.days_forecast}
                />
              )}
            </Stack>
          </TableCell>
        );
      })}
    </TableRow>
  );
};

const ResourceTableSkeleton = () => {
  return (
    <Table size='small' style={{ tableLayout: 'fixed' }}>
      <TableHead>
        <TableRow>
          <TableCell colSpan={6}>
            <Skeleton variant='rectangular' width='100%' height={20} />
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {[...Array(10)].map((e, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <TableRow key={i}>
            {[...Array(6)].map((_e, index) => (
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

export const ResourceTable: React.FC<{ bench: boolean }> = ({
  bench = false,
}) => {
  const [data, setData] = useState<UserInfo[]>([]);
  const [filteredData, setFilteredData] = useState<UserInfo[]>([]);
  //   const [disciplineFilter, setDisciplineFilter] = useState("");
  const [monthStartIndex, setMonthStartIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState<JobsExtraDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [placeholder, setPlaceholder] = useState<PlaceholderData | null>(null);
  const [months, setMonths] = useState<string[]>([]);

  const displayedMonths = months
    ? months.slice(monthStartIndex, monthStartIndex + 3)
    : [];

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/resourcing/demand');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const fetchedData = await response.json();
      const jsonParsedData: UserInfo[] = JSON.parse(fetchedData.content);
      setData(jsonParsedData); // Adjust according to actual API response
      setMonths(
        Array.from(
          new Set(
            jsonParsedData.flatMap((item) => item.jobs.map((b) => b.month))
          )
        ).sort()
      );
      setIsLoading(false);
    } catch (err: any) {
      setError(err);
      setIsLoading(false);
    }
  };

  const groupByMailAndSumDays = (dataToGroup: Placeholder[]) => {
    const groupedData: PlaceholderData = {};

    dataToGroup.forEach((item) => {
      if (!groupedData[item.resource]) {
        const newPlaceholder = new Placeholder();
        newPlaceholder.displayName = item.displayName;
        groupedData[item.resource] = newPlaceholder;

        Object.keys(item.monthlyDetails).forEach((month) => {
          const existingVal = groupedData[item.resource];
          if (existingVal) {
            const roleDetails = new RoleDetails();
            roleDetails.days_allocated =
              item.monthlyDetails[month]?.days_allocated ?? 0;

            existingVal.monthlyDetails[month] = roleDetails;
          }
        });
      } else {
        Object.keys(item.monthlyDetails).forEach((month) => {
          const nonExistingVal = groupedData[item.resource];
          if (nonExistingVal && !nonExistingVal.monthlyDetails[month]) {
            const roleDetails = new RoleDetails();
            roleDetails.days_allocated =
              item.monthlyDetails[month]?.days_allocated ?? 0;

            nonExistingVal.monthlyDetails[month] = roleDetails;
          } else {
            const existingVal =
              groupedData[item.resource]?.monthlyDetails[month];
            if (existingVal) {
              const roleDetails = new RoleDetails();
              roleDetails.days_allocated =
                item.monthlyDetails[month]?.days_allocated ?? 0;
              existingVal.days_allocated += roleDetails.days_allocated;
            }
          }
        });
      }
    });

    return groupedData;
  };

  const fetchPlaceholderData = async () => {
    try {
      const response = await fetch('/api/resourcing/placeholder');
      if (!response.ok) throw new Error('Network response was not ok');
      const fetchedData = await response.json();
      const placeholderData: Placeholder[] = JSON.parse(fetchedData.content);
      setPlaceholder(groupByMailAndSumDays(placeholderData)); // Adjust according to actual API response
    } catch (err) {
      console.error('Resource:ERROR: ', err);
    }
  };

  useEffect(() => {
    refreshData();
    fetchPlaceholderData();
  }, []);

  const sortUsersByName = (users: UserInfo[]) => {
    return users
      .filter((user) => user.displayName !== null)
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  };

  useEffect(() => {
    const filterRowsWithNoJobsAndLessHolidays = (
      users: UserInfo[],
      toFilterdisplayedMonths: string[]
    ) => {
      return users.filter((user) => {
        // Condition 1: Check if the user has no jobs in one or more of the displayed months
        const hasNoJobsInDisplayedMonths = toFilterdisplayedMonths.some(
          (month) => !user.jobs.some((job) => job.month.startsWith(month))
        );

        // Condition 2: Check if days_allocated plus holiday is less than days_hypo minus 3, using 18 if days_hypo is undefined
        // Only for jobs within the displayed months
        const hasLessDaysAllocated = user.jobs.some((job) => {
          const isInDisplayedMonths = toFilterdisplayedMonths.some((month) =>
            job.month.startsWith(month)
          );
          if (!isInDisplayedMonths) {
            return false; // Skip this job if it's not in one of the displayed months
          }

          const holiday = job.holidays || 0; // If there is no holiday, default to 0
          const daysHypo = job.days_hypo || 18; // Use 18 if days_hypo is not defined
          const daysAllocated = job.days_allocated || 0;
          return daysAllocated + holiday < daysHypo - 3;
        });

        // Return true if either condition is met
        return hasNoJobsInDisplayedMonths || hasLessDaysAllocated;
      });
    };

    if (data && data.length > 0 && !isLoading) {
      let usersToDisplay = sortUsersByName(data);
      usersToDisplay = usersToDisplay.filter(
        (item) => item.department !== 'Operations'
      );
      if (bench) {
        // Only apply this filter if bench prop is true
        usersToDisplay = filterRowsWithNoJobsAndLessHolidays(
          usersToDisplay,
          displayedMonths
        );
        usersToDisplay = usersToDisplay.filter(
          (item) => item.department !== 'Operations'
        );
      }

      setFilteredData(usersToDisplay);
    }
  }, [data]);

  // Define the initial state for the filters
  const [filters, setFilters] = useState({
    Red: false,
    TIR: false,
    SC: false,
    MH: false,
    Discipline: null,
  });

  const handleFilterChange = (
    filterName: string,
    toggled: string | boolean
  ) => {
    // Create a new filters object
    const newFilters = { ...filters, [filterName]: toggled };

    // Update the state of the changed filter
    setFilters(newFilters);

    let usersToDisplay = sortUsersByName(data);
    usersToDisplay = usersToDisplay.filter(
      (item) => item.department !== 'Operations'
    );

    // Apply all active filters
    if (newFilters.Discipline) {
      usersToDisplay = usersToDisplay.filter(
        (item) => item.department === toggled
      );
    }
    if (newFilters.Red) {
      usersToDisplay = usersToDisplay.filter((user) => {
        // Check if any job matches the criteria
        const hasRedMonth = user.jobs.some((job) => {
          const isDisplayedMonth = displayedMonths.includes(job.month);
          const color = determineColor(job);
          return isDisplayedMonth && color === 'error';
        });
        return hasRedMonth;
      });
    }
    if (newFilters.TIR) {
      usersToDisplay = usersToDisplay.filter((user) => user.info?.tir);
    }
    if (newFilters.SC) {
      usersToDisplay = usersToDisplay.filter((user) => user.info?.sc);
    }
    if (newFilters.MH) {
      usersToDisplay = usersToDisplay.filter((user) => user.info?.mh);
    }

    setFilteredData(usersToDisplay);
  };

  if (isLoading) {
    return <ResourceTableSkeleton />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Paper>
      <Box padding={2}>
        <FormGroup row>
          <FormControlLabel
            control={
              <Switch
                checked={filters.Red}
                onChange={(e) => handleFilterChange('Red', e.target.checked)}
              />
            }
            label='Over allocated'
          />
          <FormControlLabel
            control={
              <Switch
                checked={filters.TIR}
                onChange={(e) => handleFilterChange('TIR', e.target.checked)}
              />
            }
            label='TIR'
          />
          <FormControlLabel
            control={
              <Switch
                checked={filters.SC}
                onChange={(e) => handleFilterChange('SC', e.target.checked)}
              />
            }
            label='SC'
          />
          <FormControlLabel
            control={
              <Switch
                checked={filters.MH}
                onChange={(e) => handleFilterChange('MH', e.target.checked)}
              />
            }
            label='Mansion House'
          />
        </FormGroup>
      </Box>

      <Table size='small' style={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>
              Business Unit
              <Select
                value=''
                onChange={(e) =>
                  handleFilterChange('Discipline', e.target.value)
                }
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
                {Array.from(new Set(data?.map((item) => item.department) || []))
                  .sort() // This will sort the array alphabetically
                  .map((discipline) => (
                    <MenuItem key={discipline} value={discipline}>
                      {discipline}
                    </MenuItem>
                  ))}
              </Select>
            </TableCell>
            {displayedMonths.map((month, index) => (
              <TableCell
                align='center'
                key={month}
                sx={{
                  mx: '5px',
                  pl: index === 0 ? '0px' : '5px',
                  pr: index === 2 ? '0px' : '5px',
                }}
              >
                {index === 0 && (
                  <IconButton
                    // sx={{ position: 'absolute', right: 8, top: 8 }}

                    disabled={monthStartIndex === 0}
                    onClick={() =>
                      setMonthStartIndex((prev) => Math.max(prev - 1, 0))
                    }
                    sx={{ pl: '0' }}
                  >
                    <ChevronLeftIcon />
                  </IconButton>
                )}
                {new Date(month).toLocaleString('default', { month: 'long' })}
                {index === displayedMonths.length - 1 && (
                  <IconButton
                    disabled={monthStartIndex + 3 >= months.length}
                    onClick={() =>
                      setMonthStartIndex((prev) =>
                        Math.min(prev + 1, months.length - 3)
                      )
                    }
                    sx={{ marginLeft: 1 }}
                  >
                    <ChevronRightIcon />
                  </IconButton>
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map((item) => (
            <Row
              key={item.name}
              data={item}
              displayedMonths={displayedMonths}
              setPopupContent={setPopupContent}
              setShowPopup={setShowPopup}
              refreshData={refreshData}
              placeholderItem={
                placeholder && placeholder[item.mail]
                  ? placeholder[item.mail]
                  : undefined
              }
            />
          ))}
        </TableBody>
      </Table>

      <Dialog fullWidth open={showPopup} onClose={() => setShowPopup(false)}>
        <DialogTitle>
          Job Details
          <IconButton
            onClick={() => setShowPopup(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {popupContent && (
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>Days</TableCell>
                  <TableCell>JSO</TableCell>
                  <TableCell>Customer</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {popupContent.map((job) => (
                  <TableRow key={job.description}>
                    <TableCell>{job.days}</TableCell>
                    <TableCell>
                      {job.description}
                      {job.contract_type}
                    </TableCell>
                    <TableCell>{job.customer}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
    </Paper>
  );
};
