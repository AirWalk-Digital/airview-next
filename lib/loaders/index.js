// lib/parseExcelXml.js
import { parseStringPromise } from 'xml2js';
// const { parseStringPromise } = require('xml2js');

// Helper function to strip namespace prefixes from tag names
function stripPrefix(str) {
  return str.replace(/(^[^:]+:)|(xmlns[^=]*="[^"]+"[\s]*)/g, '');
}

// Function to escape potential invalid characters in XML content
function escapeInvalidXmlChars(xmlContent) {
  return xmlContent.replace(/&(?!amp;|lt;|gt;|quot;|apos;)/g, '&amp;');
}

// Function to parse the Excel XML and extract data from the second sheet
export function parseExcelXml(xmlContent) {
  // Pre-process the XML content to escape invalid characters
  const escapedXmlContent = escapeInvalidXmlChars(xmlContent);

  // Parse the XML with xml2js
  return parseStringPromise(escapedXmlContent, {
    explicitArray: false,
    tagNameProcessors: [stripPrefix]
  }).then(result => {
    const worksheets = result.Workbook.Worksheet;
    if (!Array.isArray(worksheets) || worksheets.length < 2) {
      throw new Error('No second sheet found.');
    }
    const secondSheet = worksheets[1];
    const table = secondSheet.Table;
    const rows = Array.isArray(table.Row) ? table.Row : [table.Row];

    // Extract headers
    const headers = rows[0].Cell.map(cell => cell.Data ? (cell.Data._ || cell.Data) : '');

    // Map each row to an object using headers
    const jsonData = rows.slice(1).map(row => {
      const cells = Array.isArray(row.Cell) ? row.Cell : [row.Cell];
      const rowObj = {};
      cells.forEach((cell, index) => {
        const header = headers[index] || `Column${index + 1}`;
        // Check if the cell has a Data property and use it accordingly
        const dataValue = cell.Data ? (cell.Data._ || cell.Data) : '';
        rowObj[header] = dataValue;
      });
      return rowObj;
    });

    return jsonData;
  });
}

function toSnakeCase(str) {
  return str
    // Replace all sequences of characters that are not letters or digits with an underscore
    .replace(/[^a-zA-Z0-9]+/g, '_')
    // Insert an underscore before any uppercase letter followed by a lowercase letter,
    // but only if it's not at the start of the string
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    // Convert the whole string to lowercase
    .toLowerCase()
    // Remove any leading or trailing underscores
    .replace(/^_+|_+$/g, '');
}

// Recursively convert object keys to camelCase
function keysToSnakeCase(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(keysToSnakeCase);
  }
  return Object.keys(obj).reduce((newObj, key) => {
    const val = obj[key];
    const newVal = typeof val === 'object' ? keysToSnakeCase(val) : val;
    newObj[toSnakeCase(key)] = newVal;
    return newObj;
  }, {});
}

function groupBy(data, nameKey, resourceKey, nobodyKey) {
  const grouped = [];

  // Helper function to find the existing group
  const findGroup = (name, resource, nobody) => {
    return grouped.find(group => group.name === name && group.resourceBu === resource && group.nobody === nobody);
  };

  data.forEach(item => {
    // Convert keys of item to camelCase
    const cleanItem = keysToSnakeCase(item);

    // Use 'Unknown' as default if values are missing
    const nameValue = cleanItem[toSnakeCase(nameKey)] || 'Unknown';
    const resourceValue = cleanItem[toSnakeCase(resourceKey)] || 'Unknown';
    const nobodyValue = cleanItem[toSnakeCase(nobodyKey)] || 'Unknown';

    // Destructure the cleanItem to omit the keys we don't want in the jobs list
    const { [toSnakeCase(nameKey)]: _, [toSnakeCase(resourceKey)]: __, [toSnakeCase(nobodyKey)]: ___, tbd: ____, status: _____, ...jobDetails } = cleanItem;

    // Find an existing group
    let group = findGroup(nameValue, resourceValue, nobodyValue);

    // If group doesn't exist, create a new one with camelCase keys
    if (!group) {
      group = {
        name: nameValue,
        resourceBu: resourceValue,
        nobody: nobodyValue,
        jobs: []
      };
      grouped.push(group);
    }

    // Add the job details to the jobs array of the group
    group.jobs.push(jobDetails);
  });

  return grouped.map(g => keysToSnakeCase(g));  // Convert the grouped object keys to camelCase
}

// Example usage:
// const jsonData = JSON.parse(yourJSONString); // Replace with the actual JSON string
// const groupedData = groupBy(jsonData, 'NAME', 'RESOURCE BU', 'Nobody');
// console.log(JSON.stringify(groupedData, null, 2));



function groupByName(data) {
  // console.debug(data)
  const groupedData = groupBy(data, 'NAME', 'RESOURCE BU', 'Nobody')
  // console.debug(groupedData)
  // console.debug(groupedData[0])
  return groupedData

}

export function expandResourceData(data, userData) {
  const groupedData = groupByName(data)
  // console.debug('userData: ', userData[0])
  // console.debug('groupedData: ', groupedData[0])
  // Define fields to add from users_data
  const fieldsToAdd = [
    "displayName",
    "givenName",
    "surname",
    "jobTitle",
    "mail",
    "officeLocation",
    "department",
    "manager_email"
  ]
  // Create a lookup map from surname, givenName to the entire user object
  const replyNameToUserData = userData.reduce((acc, user) => {
    const surname = user.surname ? user.surname.toLowerCase() : '';
    const givenName = user.givenName ? user.givenName.toLowerCase() : '';
    const replyName = `${surname}, ${givenName}`;
    acc[replyName] = user;
    return acc;
  }, {});

  
  const replyDiff = userData.reduce((acc, user) => {
    const replyName = user.faxNumber ? user.faxNumber.toLowerCase() : '';
    acc[replyName] = user;
    return acc;
  }, {});


  // Function to add fields to each entry in data
  function addFieldsToData(groupedData, fieldsToAdd, replyNameToUserData) {
    return groupedData.map(item => {
      const nameKey = item.name.toLowerCase(); // name is expected in 'Surname, GivenName' format
      const userData = replyNameToUserData[nameKey];

      if (userData) {
        fieldsToAdd.forEach(field => {
          // Convert snake_case to camelCase for the field name
          const camelCaseField = field.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase());
          item[camelCaseField] = userData[field];
        });
      } else {
        // If no userData is found, populate fields with null
        fieldsToAdd.forEach(field => {
          const camelCaseField = field.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase());
          item[camelCaseField] = null;
        });
      }
      return item;
    });
  }
  function addFieldsToMissing(groupedData, fieldsToAdd, replyDiff) {
    return groupedData.map(item => {
      // Check if faxNumber is not null and not undefined
      const nameKey = item.name.toLowerCase(); // name is expected in 'Surname, GivenName' format
  
      if (nameKey && replyDiff[nameKey]) {
        const userData = replyDiff[nameKey];
        fieldsToAdd.forEach(field => {
          // Convert snake_case to camelCase for the field name
          const camelCaseField = field.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase());
          item[camelCaseField] = userData[field];
        });
      }
      return item;
    });
  }
  

  // Now, add the fields to the data array
  let augmentedData = addFieldsToData(groupedData, fieldsToAdd, replyNameToUserData);
  // add Reply users with different names in AAD
  augmentedData = addFieldsToMissing(augmentedData, fieldsToAdd, replyDiff);

  const groupedMonthData = augmentedData.map(item => {
    // Object to hold the grouping by month
    const jobsByMonth = {};

    item.jobs.forEach(job => {
      const month = job.month;
      let days_allocated = 0;
      let days_forecast = 0;
      
      if (job.exp_coge === 'Y') { // job has been forcast to Coge
        days_allocated = parseInt(job.days, 10) || 0;  // Ensure days is a number, default to 0 if NaN
      } else { // this is not forcast yet
        days_forecast = parseInt(job.days, 10) || 0;  // Ensure days is a number, default to 0 if NaN
      }
      

      // Initialize days_hypo and days_working as null
      let hypoDd = null;
      let workDd = null;

      // Convert hypo_dd and work_dd to numbers if they are numbers or strings representing numbers
      if (typeof job.hypo_dd === 'number' || (typeof job.hypo_dd === 'string' && !isNaN(parseInt(job.hypo_dd, 10)))) {
        hypoDd = parseInt(job.hypo_dd, 10);
      }

      if (typeof job.work_dd === 'number' || (typeof job.work_dd === 'string' && !isNaN(parseInt(job.work_dd, 10)))) {
        workDd = parseInt(job.work_dd, 10);
      }

      if (!jobsByMonth[month]) {
        // Initialize if this month hasn't been added yet
        jobsByMonth[month] = {
          month: month,
          jobs: [],
          days_allocated: 0,
          days_forecast: 0,
          days_hypo: hypoDd,  // Initialize with hypoDd if it's a number
          days_working: workDd  // Initialize with workDd if it's a number
        };
      } else {
        // Only update days_hypo and days_working if hypoDd and workDd are numbers
        if (hypoDd !== null) {
          jobsByMonth[month].days_hypo = Math.max(jobsByMonth[month].days_hypo, hypoDd);
        }
        if (workDd !== null) {
          jobsByMonth[month].days_working = Math.max(jobsByMonth[month].days_working, workDd);
        }
      }

      // Add this job to the month, we'll clean it up later
      jobsByMonth[month].jobs.push(job);

      // Sum the days
      jobsByMonth[month].days_allocated += days_allocated;
      jobsByMonth[month].days_forecast += days_forecast;
    });

    // After all jobs have been processed for this item
    Object.values(jobsByMonth).forEach(monthData => {
      monthData.jobs.forEach(job => {
        // Remove hypo_dd and work_dd from individual jobs
        delete job.hypo_dd;
        delete job.work_dd;
      });
    });

    // Filter out months where days_allocated is 0
    const filteredJobsByMonth = Object.values(jobsByMonth).filter(monthData => 
      monthData.days_allocated > 0 || monthData.days_forecast > 0);
    
    // Replace the jobs array with the filtered grouped data
    item.jobs = filteredJobsByMonth;
    return item;
  });


  // console.log(groupedMonthData);


  // console.log(augmentedData);
  return groupedMonthData
}






export function calculateDemand(jsonData) {
  // Read JSON file
  //   const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

  // Filter out users whose names don't begin with "NOB,"
  const nobUsers = jsonData.filter(user => user.nobody === "Y");

  // Pivot the data to group by the job description
  const adjustedPivotedData = {};
  nobUsers.forEach(user => {
    user.jobs.forEach(booking => {
      booking.jobs.forEach(job => {
        const customer = job.customer;
        const code = job.job_s_ord_code;
        const description = job.description;
        const month = booking.month;
        const userDetails = {
          name: user.name,
          days_allocated: booking.days_allocated,
          days_hypo: booking.days_hypo,
          days_working: booking.days_working
        };

        if (!adjustedPivotedData[customer]) adjustedPivotedData[customer] = {};
        if (!adjustedPivotedData[customer][code]) adjustedPivotedData[customer][code] = {};
        if (!adjustedPivotedData[customer][code][description]) adjustedPivotedData[customer][code][description] = {};
        if (!adjustedPivotedData[customer][code][description][month]) adjustedPivotedData[customer][code][description][month] = [];
        adjustedPivotedData[customer][code][description][month].push(userDetails);
      });
    });
  });

  function extractRoleAndGrade(name) {
    // console.log('extractRoleAndGrade:name: ', name)
    const idMatch = name.match(/NOB, (\d+)/); // Match the 'NOB, ' followed by digits.
    const id = idMatch ? parseInt(idMatch[1], 10) : null; // Parse the matched digits to an integer.

    // Split the string by " - " to separate role and grade.
    const parts = name.split(" - ");
    let role, grade;

    if (parts.length > 2) {
      role = parts.slice(1, -1).join(" - ").trim();
      grade = parts[parts.length - 1].trim();
    } else {
      role = parts[1].trim();
      grade = "N/A";
    }

    return { id, role, grade };
  }


  Object.values(adjustedPivotedData).forEach(codes => {
    Object.values(codes).forEach(descriptions => {
      Object.values(descriptions).forEach(months => {
        Object.values(months).forEach(users => {
          users.forEach(user => {
            const { id, role, grade } = extractRoleAndGrade(user.name);
            user.role = role;
            user.role_id = id;
            user.grade = grade;
            delete user.name;
          });
        });
      });
    });
  });

  // Transform the pivoted data to the desired format
  const finalTransformedData = [];
  Object.entries(adjustedPivotedData).forEach(([customer, codes]) => {
    Object.entries(codes).forEach(([code, descriptions]) => {
      Object.entries(descriptions).forEach(([description, months]) => {
        const entry = {
          Customer: customer,
          Code: code,
          Description: description,
          Roles: months
        };
        finalTransformedData.push(entry);
      });
    });
  });
  return finalTransformedData
  // Save the transformed data to the output file
  //   fs.writeFileSync(outputFilePath, JSON.stringify(finalTransformedData, null, 4));
}


export async function timesheetPortalHolidays(clientID, clientSecret) {

  const TIMESHEET_PORTAL_CLIENT_ID = clientID;
  const TIMESHEET_PORTAL_CLIENT_SECRET = clientSecret;
  const today = new Date().toISOString().split('T')[0]; // Assuming today is the current date
  const threeMonths = new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0];

  // Get access token from timesheet portal
  let codePayload = {
    client_id: TIMESHEET_PORTAL_CLIENT_ID,
    client_secret: TIMESHEET_PORTAL_CLIENT_SECRET,
    response_type: "code"
  };

  let response = await fetch('https://api-rest.timesheetportal.com/oauth/authorise', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(codePayload)
  });
  let data = await response.json();
  let code = data.code;

  let tokenPayload = {
    client_id: TIMESHEET_PORTAL_CLIENT_ID,
    client_secret: TIMESHEET_PORTAL_CLIENT_SECRET,
    grant_type: "authorisation_code",
    code: code
  };

  response = await fetch('https://api-rest.timesheetportal.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tokenPayload)
  });
  data = await response.json();

  let accessToken = data.access_token;

  // Get the leave booking
  let leaveBookingPayload = {
    StartDate: today,
    EndDate: threeMonths,
    ReportFields: [
      "EmployeeName", "LeaveStartDate", "LeaveEndDate", "LeaveTotalWorkingDays", "ApproverName", "LeaveCategory"
    ],
    StatusFilters: [
      "Approved"
    ]
  };
  let headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };

  response = await fetch('https://api-rest.timesheetportal.com/leavebookings/reports/bookings', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(leaveBookingPayload)
  });

  

  // return await response.json();

  const leaveBookingsResponse = await response.json();
  // console.log('loaders/timesheetPortalHolidays:response: ', await response.json() )
  if (response.status != 200 ) {
    // console.error('loaders/timesheetPortalHolidays:response:ERROR: ', await response.statusText )
  }

  // Now include the processing logic here to group the leave bookings
  const groupedData = groupLeaveData(leaveBookingsResponse);
  // console.log('loaders/timesheetPortalHolidays:response: ', JSON.stringify(leaveBookingsResponse) )

  
  // console.log('groupLeaveData: ', JSON.stringify(groupedData))

  // Return the grouped data
  return groupedData;

}


// Function to parse a date string in "dd/mm/yyyy hh:mm:ss" format
function parseDate(dateStr) {
  const parts = dateStr.split(/[:\/\s]/);
  return new Date(parts[2], parts[1] - 1, parts[0], parts[3] || 0, parts[4] || 0, parts[5] || 0);
}

// Function to calculate the number of working days between two dates
function calculateWorkingDays(startDate, endDate) {
  let count = 0;
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0 = Sunday, 6 = Saturday
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return count;
}

// Function to group the leave data
function groupLeaveData(data) {
  const groupedData = {};

  data.slice(1).forEach(row => {
    const employeeName = row[0];
    const leaveStartDate = parseDate(row[1]);
    const leaveEndDate = parseDate(row[2]);
    const leaveMonth = `${leaveStartDate.getFullYear()}-${('0' + (leaveStartDate.getMonth() + 1)).slice(-2)}`;
    const workingDays = calculateWorkingDays(leaveStartDate, leaveEndDate);

    if (!groupedData[employeeName]) {
      groupedData[employeeName] = { holidays: [] };
    }

    let monthEntry = groupedData[employeeName].holidays.find(entry => entry.month === leaveMonth);
    if (monthEntry) {
      monthEntry.workingDays += workingDays;
    } else {
      groupedData[employeeName].holidays.push({ month: leaveMonth, workingDays: workingDays });
    }
  });

  return groupedData;
}


export function combineResourcesWithHolidays(dataArray, holidaysObject) {
  return dataArray.map(resource => {
    // Create a deep copy of the resource to avoid mutating the original data
    let newResource = JSON.parse(JSON.stringify(resource));

    // Ensure there is a job entry for every holiday month
    const displayName = newResource.displayName;
    if (holidaysObject[displayName]) {
      holidaysObject[displayName].holidays.forEach(holiday => {
        let jobForHolidayMonthExists = newResource.jobs.some(job => job.month.startsWith(holiday.month));
        if (!jobForHolidayMonthExists) {
          // Create a new job entry for the holiday month
          newResource.jobs.push({
            month: `${holiday.month}-01`,
            jobs: [],
            days_allocated: 0,
            days_hypo: 0,
            days_working: 0,
            holiday: holiday.workingDays
          });
        }
      });

      // Merge the holiday information with existing job entries
      newResource.jobs.forEach(job => {
        let holidayEntry = holidaysObject[displayName].holidays.find(holiday => holiday.month === job.month.slice(0, 7));
        if (holidayEntry) {
          job.holiday = holidayEntry.workingDays;
        } else if (job.holiday === undefined) {
          // If there's no holiday entry for this month and no existing holiday key, set it to 0
          job.holiday = 0;
        }
      });
    }

    return newResource;
  });
}
