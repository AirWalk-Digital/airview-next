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
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (params) =>
      `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

export function FrameworkCoverageTable() {
  return (
    <div style={{ height: 400, width: '100%' }}>
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
      />
    </div>
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