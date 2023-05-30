import { Box, Typography, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Card, CardContent } from '@mui/material';


function FrameworkSection({ framework }) {
  return (
    <Box>
      <Typography variant="h6">{framework.name}</Typography>
      <Typography variant="subtitle1">{framework.description}</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Domain</TableCell>
              <TableCell>Control ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {framework.mapping.map((mapping, index) => (
              <TableRow key={index}>
                <TableCell>{mapping.domain}</TableCell>
                <TableCell>{mapping.control_id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}


function MethodCard({ method }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="body1">
          <strong>System:</strong> {method.system || 'N/A'}
        </Typography>
        <Typography variant="body1">
          <strong>Reference:</strong> {method.reference || 'N/A'}
        </Typography>
        <Typography variant="body1">
          <strong>Default Action:</strong> {method.default_action || 'N/A'}
        </Typography>
        <Typography variant="body1">
          <strong>Custom:</strong> {method.custom ? 'Yes' : 'No'}
        </Typography>
        <Typography variant="body1">
          <strong>Action:</strong> {method.action || 'N/A'}
        </Typography>
        <Typography variant="body1">
          <strong>Type:</strong> {method.type || 'N/A'}
        </Typography>
        <Typography variant="body1">
          <strong>TTL:</strong> {method.ttl || 'N/A'}
        </Typography>
        <Typography variant="body1">
          <strong>Is Blocking:</strong> {method.is_blocking ? 'Yes' : 'No'}
        </Typography>
        {/* Render other method details as needed */}
      </CardContent>
    </Card>
  );
}

function MethodsList({ methods }) {
  return (
    <Box>
      <Typography variant="h6">Methods</Typography>
      <Box mt={2}>
        {methods.map((method, index) => (
          <MethodCard key={index} method={method} />
        ))}
      </Box>
    </Box>
  );
}

  

export default function ControlDataDisplay({ data }) {
    data = data[0].data
    return (
      <Box>
        <Typography variant="h4">{data?.name || 'N/A'}</Typography>
        <Typography variant="body1">{data?.description || 'N/A'}</Typography>
        <Typography variant="body1">
          <strong>ID:</strong> {data?.id || 'N/A'}
        </Typography>
        <Typography variant="body1">
          <strong>CSP:</strong> {data?.csp || 'N/A'}
        </Typography>
        <Typography variant="body1">
          <strong>Service:</strong> {data?.service || 'N/A'}
        </Typography>
        <Typography variant="body1">
          <strong>Control Owner:</strong> {data?.control_owner || 'N/A'}
        </Typography>
        <Typography variant="body1">
          <strong>Quality Model:</strong> {data?.quality_model || 'N/A'}
        </Typography>
        {data?.frameworks?.map((framework, index) => (
          <FrameworkSection key={index} framework={framework} />
        ))}
        <MethodsList methods={data?.methods || []} />
      </Box>
    );
  }