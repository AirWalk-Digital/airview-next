import { Box, Typography, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Card, CardContent, Chip, Stepper, Step, StepLabel, Button, Alert, TabList, Tab, Tabs } from '@mui/material';
import { useState } from 'react';

function FrameworkPanel({value, index, framework}) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
    >
      {value === index && (
    <Box>
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
     )}
     </div>
   );
}

function MethodPanel({value, index, method}) {
  // const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
    >
      {value === index && (
            <Card variant="outlined" sx={{ my: '1%' }}>
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
      )}
    </div>
  );
}


function MethodsList({ methods }) {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ mt: '2%' }}>
      <Alert variant="outlined" severity="info">
        Technical or Audit/Manual methods in place to enforce the control
      </Alert>

      <Box mt={2}>
        <Tabs value={value} onChange={handleChange}>
          {methods.map((method, index) => (
            <Tab label={method.system} id={index} />
          ))}
        </Tabs>
        </Box>
        {methods.map((method, index) => (
          <MethodPanel value={value} index={index} key={index} method={method} />
        ))}

    </Box>
  );
}


function FrameworksList({ frameworks }) {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ mt: '2%' }}>
     <Alert variant="outlined" severity="info">
            Industry or Organisational Frameworks that the control maps to.
          </Alert>

      <Box mt={2}>
        <Tabs value={value} onChange={handleChange}>
          {frameworks.map((framework, index) => (
            <Tab label={framework.name} id={index} />
          ))}
        </Tabs>
        </Box>
        {frameworks.map((framework, index) => (
          <FrameworkPanel value={value} index={index} key={index} framework={framework} />
        ))}

    </Box>
  );
}



export function ControlDataDisplay({ data }) {

  // console.log('ControlDataDisplay:data: ', data)
  const steps = ['Overview', 'Frameworks', 'Methods'];
  const [activeStep, setActiveStep] = useState(0);

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  data = data.data
  return (
    <Box>


      <Stepper activeStep={activeStep} alternativeLabel connector={null}>
        {steps.map((label, index) => (
          <Step key={label} completed={false} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button onClick={() => setActiveStep(index)}>
              <StepLabel sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{label}</StepLabel>
            </Button>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Box>
          <Typography variant="body1" sx={{mb: '2%'}}>{data?.description || 'N/A'}</Typography>
          
          <Typography variant="body1">
            <strong>Provider:  </strong><Chip label={data?.csp || 'N/A'} />
          </Typography>
          <Typography variant="body1">
            <strong>Service:</strong> {data?.service || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Control Owner:  </strong><Chip label={data?.control_owner || 'N/A'} />
          </Typography>
          <Typography variant="body1">
            <strong>Quality Model:  </strong><Chip label={data?.quality_model || 'N/A'} />
          </Typography>
        </Box>
      )}
      {activeStep === 1 && (
        <FrameworksList frameworks={data?.frameworks || []} />
      )}
      {activeStep === 2 && (
        <MethodsList methods={data?.methods || []} />
      )}

    </Box>
  );
}