import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import React from 'react';

type Contributor = {
  authorName: string;
  authorDate: string;
};

const Contributors: React.FC<{ contributors: Contributor[] }> = ({
  contributors,
}) => {
  return (
    <Box sx={{ mx: 1 }}>
      <Accordion elevation={0} variant="outlined">
        <AccordionSummary
          sx={{ mx: 1 }}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Chip color="primary" label="Contributors" sx={{ mx: '2px' }} />
          {contributors
            .filter(
              (contributor) =>
                !contributor.authorName.toLowerCase().includes('[bot]') &&
                !contributor.authorName.toLowerCase().includes('airview'),
            )
            .slice(0, 4)
            .map((contributor) => (
              <Chip
                key={contributor.authorName}
                label={contributor.authorName}
                variant="outlined"
                sx={{ mx: '2px' }}
              />
            ))}
        </AccordionSummary>
        <AccordionDetails sx={{ mx: 1 }}>
          <Table>
            <TableBody>
              {contributors
                .filter(
                  (contributor) =>
                    !contributor.authorName.toLowerCase().includes('[bot]') &&
                    !contributor.authorName.toLowerCase().includes('airview'),
                )
                .map((contributor) => (
                  <TableRow key={contributor.authorName}>
                    <TableCell>{contributor.authorName}</TableCell>
                    <TableCell>{contributor.authorDate}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Contributors;
