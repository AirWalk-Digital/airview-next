import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Stack } from '@mui/material'
import { Chip } from '@mui/material'
import * as React from 'react';

// import { DataGrid } from '@mui/x-data-grid';

// import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';




import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Button, Dialog, DialogTitle, DialogContent, styled } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Info, Close } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material';
import { baseTheme } from '../constants/baseTheme';

const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: baseTheme.palette.background.primary,
            color: 'white',
          },
        },
      },
    },
  },
});


export const FrameworkCoverageTable = ({ rows, sx }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [open, setOpen] = useState(false);

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const renderInfoButton = (params) => {
    return (
      <IconButton
        aria-label="Show Controls"
        onClick={() => handleRowClick(params.row)}
        size="small"
      >
        <Info />
      </IconButton>
    );
  };

  const columns = [
    { field: 'appName', headerName: 'Application Name', flex: 1 },
    { field: 'businessUnit', headerName: 'Business Unit', flex: 1 },
    { field: 'exemptions', headerName: 'Exemptions', flex: 1 },
    {
      field: '',
      headerName: ' ',
      width: 50,
      align: 'right',
      renderCell: (params) => (
        <>
          {params.value}
          {renderInfoButton(params)}
        </>
      ),
    },
  ];

  const rowsWithId = rows.map((row) => ({ ...row, id: row.id.toString() }));

  return (
    <ThemeProvider theme={theme}>
      <DataGrid
        rows={rowsWithId}
        columns={columns}
        sx={{ ...sx }}
      />
      <Dialog open={open} onClose={handleDialogClose} maxWidth="md" fullWidth>
        {selectedRow && (
          <>
            <DialogTitle>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ flex: 1 }}>{selectedRow.appName} Controls</span>
                <Button
                  onClick={handleDialogClose}
                  startIcon={<Close />}
                  color="primary"
                >
                  Close
                </Button>
              </div>
            </DialogTitle>
            <DialogContent>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Control Name</TableCell>
                    <TableCell>Issues</TableCell>
                    <TableCell>Criticality</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedRow.controls.map((control) => (
                    <TableRow key={control.name}>
                      <TableCell>{control.name}</TableCell>
                      <TableCell>{control.issues}</TableCell>
                      <TableCell>{control.criticality}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DialogContent>
          </>
        )}
      </Dialog>
    </ThemeProvider>
  );
};



// export const FrameworkCoverageTable = ({ rows, sx }) => {
//   const [expandedRows, setExpandedRows] = useState([]);

//   const handleRowExpand = (params) => {
//     const expandedRowIds = new Set(expandedRows);
//     if (expandedRowIds.has(params.id)) {
//       expandedRowIds.delete(params.id);
//     } else {
//       expandedRowIds.add(params.id);
//     }
//     setExpandedRows(Array.from(expandedRowIds));
//   };

//   const renderCollapsibleElement = (row) => {
//     return (
//       <div>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Control Name</TableCell>
//               <TableCell>Issues</TableCell>
//               <TableCell>Criticality</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {row.controls.map((control) => (
//               <TableRow key={control.name}>
//                 <TableCell>{control.name}</TableCell>
//                 <TableCell>{control.issues}</TableCell>
//                 <TableCell>{control.criticality}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     );
//   };

//   const columns = [
//     { field: 'appName', headerName: 'Application Name', flex: 1 },
//     { field: 'businessUnit', headerName: 'Business Unit', flex: 1 },
//     { field: 'exemptions', headerName: 'Exemptions', flex: 1 },
//   ];

//   const rowsWithCollapsible = rows.map((row) => ({
//     ...row,
//     isExpanded: expandedRows.includes(row.id),
//   }));

//   return (
//       <DataGrid
//         rows={rowsWithCollapsible}
//         columns={columns}
//         isRowExpandable={(params) => true}
//         renderRowDetail={(params) => renderCollapsibleElement(params.row)}
//         onRowExpand={handleRowExpand}
//         sx={{...sx}}

//       />
//   );
// };

// export default CollapsibleTable;

const columns = [
  { field: 'id', headerName: 'APP ID', width: 70 },
  { field: 'appName', headerName: 'Application', width: 130 },
  { field: 'businessUnit', headerName: 'Business Unit', width: 130 },
  {
    field: 'exemptions',
    headerName: 'Exemptions',
    type: 'number',
    width: 90,
  }
];


// const columns = [
//   { field: 'id', headerName: 'APP ID', width: 70 },
//   { field: 'appName', headerName: 'Application', width: 130 },
//   { field: 'businessUnit', headerName: 'Business Unit', width: 130 },
//   {
//     field: 'age',
//     headerName: 'Age',
//     type: 'number',
//     width: 90,
//   },
//   {
//     field: 'fullName',
//     headerName: 'Full name',
//     description: 'This column has a value getter and is not sortable.',
//     sortable: false,
//     width: 160,
//     valueGetter: (params) =>
//       `${params.row.firstName || ''} ${params.row.lastName || ''}`,
//   },
// ];


const rows = [
  { id: 1, appName: 'Airview', businessUnit: 'Cloud CoE', exemptions: 35, controls: [{ name: 'AC1', name: 'Control Storage Accounts', issues: 5, criticality: 'high' }, { name: 'AC2', name: 'Control Storage Accounts', issues: 5, criticality: 'high' }, { name: 'AC3', name: 'Control Storage Accounts', issues: 5, criticality: 'high' }] },
  { id: 2, appName: 'Microsoft Teams', businessUnit: 'Central IT', exemptions: 42, controls: [{ name: 'AC1', name: 'Control Storage Accounts', issues: 5, criticality: 'high' }, { name: 'AC2', name: 'Control Storage Accounts', issues: 5, criticality: 'high' }, { name: 'AC3', name: 'Control Storage Accounts', issues: 5, criticality: 'high' }] },
  { id: 3, appName: 'Public Website', businessUnit: 'Marketing', exemptions: 45, controls: [{ name: 'AC1', name: 'Control Storage Accounts', issues: 5, criticality: 'high' }, { name: 'AC2', name: 'Control Storage Accounts', issues: 5, criticality: 'high' }, { name: 'AC3', name: 'Control Storage Accounts', issues: 5, criticality: 'high' }] },
];


controls: [{ name: 'AC1', name: 'Control Storage Accounts', issues: 5, criticality: 'high' }, { name: 'AC2', name: 'Control Storage Accounts', issues: 5, criticality: 'high' }, { name: 'AC3', name: 'Control Storage Accounts', issues: 5, criticality: 'high' }]

export function FrameworkCoverageTableOld({ sx }) {
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: { page: 0, pageSize: 5 },
        },
      }}
      pageSizeOptions={[5, 10]}
      checkboxSelection
      sx={{ ...sx }}
    />
  );
}

function Implementation({ methods }) {
  if (methods) {
    return (
      <TableCell align="right">
        <Stack direction="column" spacing={0.2} >
          {methods.map((row, i) => (
            row.system && <Chip key={i} label={row?.system ?? 'n/a'} variant='outlined' size='small' color="success" />
          ))}
        </Stack>
      </TableCell>
    )

  } else {
    return (
      <TableCell align="right"></TableCell>
    )
  }
}
export function ControlTable({ controls, framework = 'NIST80053' }) {

  console.log('ControlTable:controls: ', controls)

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead sx={{ color: 'background.primary' }} >
          <TableRow>
            <TableCell>Framework Domain</TableCell>
            <TableCell align="right">Control</TableCell>
            <TableCell align="left">Description</TableCell>
            <TableCell align="right">Implementation(s)</TableCell>
            <TableCell align="right">Owner</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {controls.map((row, i) => (
            <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {/* {row.data?.frameworks?.find(f => f.name === framework)?.mapping?.section ?? null} */}
                {row.data?.frameworks?.filter(f => f.name === framework).flatMap(f => f.mapping?.map(m => m.domain)).join(", ") || null}

              </TableCell>
              <TableCell align="right">{row?.data?.id ?? null}</TableCell>
              <TableCell align="left">{row?.data?.description ?? null}</TableCell>
              <TableCell component={Implementation} align="right" methods={row?.data?.methods ?? null} />
              <TableCell align="right">{row?.data?.control_owner ?? null}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}