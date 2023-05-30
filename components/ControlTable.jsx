import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Stack } from '@mui/material'
import { Chip } from '@mui/material'


function Implementation({ children }) {
    return (
        <TableCell align="right">
            <Stack direction="row-reverse" spacing={1} >
                <Chip label="Azure Policy" color="success" />
            </Stack>
        </TableCell>
    )

}

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];


export function ControlTable({controls, framework='NIST80053'}) {

console.log('ControlTable:controls: ', controls)

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead sx={{ color: 'background.primary' }} >
                    <TableRow>
                        <TableCell>Framework Section</TableCell>
                        <TableCell align="right">Control</TableCell>
                        <TableCell align="left">Description</TableCell>
                        <TableCell align="right">Implementation(s)</TableCell>
                        <TableCell align="right">Owner</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {controls.map((row, i) => (
                        <TableRow
                            key={i}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row"> {row.data?.framework?.[framework]?.section ?? null}                            </TableCell>
                            <TableCell align="right">{row?.data?.id ?? null}</TableCell>
                            <TableCell align="left">{row?.data?.description ?? null }</TableCell>
                            <TableCell component={Implementation} align="right">{row?.carbs ?? null}</TableCell>
                            <TableCell align="right">{row?.data?.control_owner ?? null}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}