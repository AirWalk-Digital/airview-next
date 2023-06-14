import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Stack } from '@mui/material'
import { Chip } from '@mui/material'


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

    // console.log('ControlTable:controls: ', controls)

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