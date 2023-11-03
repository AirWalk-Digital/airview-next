// You can use this code in a separate component that's imported in your pages.
// import type { CodeBlockEditorDescriptor } from '@mdxeditor/editor';
import { ResourceTable, DemandTable } from '@/components/resourcing'
import { useState, useEffect } from "react";
import resourcing from './resourcing.json';
import users from './users.json';
import demand from './demand.json';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';


import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import ReceiptIcon from '@mui/icons-material/Receipt';

export default function Page() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    console.log('index:', newValue)
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab icon={<ReceiptIcon />} iconPosition="start" label="Demand" index="0" />
          <Tab icon={<SupervisedUserCircleIcon />} iconPosition="start" label="Resources" index="1" />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <DemandTable data={demand} users={users} resources={resourcing}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ResourceTable data={resourcing} />
      </TabPanel>
    </Box>
  )
}


function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={index}
    >
      {value === index && (
       <Card variant="outlined" sx={{mt:'2%'}}>
        <CardContent>
          {children}
          </CardContent>
        </Card>
      )}
    </div>
  );
}