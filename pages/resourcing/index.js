// You can use this code in a separate component that's imported in your pages.
// import type { CodeBlockEditorDescriptor } from '@mdxeditor/editor';
import { ResourceTable, DemandTable, FileUpload } from '@/components/resourcing'
import { useState, useEffect } from "react";
// import resourcing from './js_resource_full.json';
// import users from './users.json';
// import demand from './demand.json';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';


import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import ReceiptIcon from '@mui/icons-material/Receipt';
import UploadIcon from '@mui/icons-material/Upload';
import PersonIcon from '@mui/icons-material/Person';

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
          <Tab icon={<PersonIcon />} iconPosition="start" label="Bench" index="2" />

          <Tab icon={<UploadIcon />} iconPosition="start" label="Upload" index="3" />

        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <DemandTableContainer />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ResourceTable  />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ResourceTable bench={true}/>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <FileUpload />
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


function DemandTableContainer() {

  const [isLoading, setIsLoading] = useState(true);
  const [months, setMonths] = useState([
    '2023-11-01T00:00:00.000', '2023-12-01T00:00:00.000', '2024-01-01T00:00:00.000',
]);
const [data, setData] = useState(null);
const [error, setError] = useState(null);
const [resources, setResources] = useState(null);


  useEffect(() => {


    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/resourcing/demand?demand=true');
            if (!response.ok) throw new Error('Network response was not ok');
            const fetchedData = await response.json();
            if (fetchedData.content) {
                const jsonParsedData = JSON.parse(fetchedData.content)
                // console.log('jsonParsedData: ', jsonParsedData)
                setData(jsonParsedData); // Adjust according to actual API response
                setMonths(
                    Array.from(
                        new Set(
                            jsonParsedData.flatMap(item => Object.keys(item.Roles))
                        )
                    ).sort()
                );

                setIsLoading(false);
            } else {
                setIsLoading(true);
            }
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }

        try {
            const response = await fetch('/api/resourcing/demand');
            if (!response.ok) throw new Error('Network response was not ok');
            const fetchedData = await response.json();
            if (fetchedData.content) {
                const jsonParsedData = JSON.parse(fetchedData.content)
                // console.log('jsonParsedData: ', jsonParsedData)
                setResources(jsonParsedData); // Adjust according to actual API response
                setIsLoading(false);
            } else {
                setIsLoading(true);
            }
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }

    };

    fetchData();
}, []);

return (
  <DemandTable isLoading={isLoading} months={months} data={data} error={error} resources={resources} />

)

}