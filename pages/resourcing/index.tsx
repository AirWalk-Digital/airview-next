// You can use this code in a separate component that's imported in your pages.
// import type { CodeBlockEditorDescriptor } from '@mdxeditor/editor';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import UploadIcon from '@mui/icons-material/Upload';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tab from '@mui/material/Tab';
// import resourcing from './js_resource_full.json';
// import users from './users.json';
// import demand from './demand.json';
import Tabs from '@mui/material/Tabs';
import { DemandTable, FileUpload, ResourceTable } from 'components/resourcing';
import { type SyntheticEvent, useEffect, useState } from 'react';
import type { GroupData } from 'src/model/model';

const TabPanel: React.FC<{
  index: number;
  value: number;
  children: JSX.Element;
}> = ({ index, value, children }) => {
  return (
    <div role='tabpanel' hidden={value !== index} id={index.toString()}>
      {value === index && (
        <Card variant='outlined' sx={{ mt: '2%' }}>
          <CardContent>{children}</CardContent>
        </Card>
      )}
    </div>
  );
};

function DemandTableContainer() {
  const [isLoading, setIsLoading] = useState(true);
  const [months, setMonths] = useState([
    '2023-11-01T00:00:00.000',
    '2023-12-01T00:00:00.000',
    '2024-01-01T00:00:00.000',
  ]);
  const [data, setData] = useState<GroupData[]>([]);
  const [error, setError] = useState('');
  const [resources, setResources] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/resourcing/demand?demand=true');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const fetchedData = await response.json();
        if (fetchedData.content) {
          const jsonParsedData: GroupData[] = JSON.parse(fetchedData.content);
          // console.log('jsonParsedData: ', jsonParsedData)
          setData(jsonParsedData); // Adjust according to actual API response
          setMonths(
            Array.from(
              new Set(jsonParsedData.flatMap((item) => Object.keys(item.roles)))
            ).sort()
          );

          setIsLoading(false);
        } else {
          setIsLoading(true);
        }
      } catch (err) {
        setError((err as Error).message);
        setIsLoading(false);
      }

      try {
        const response = await fetch('/api/resourcing/demand');
        if (!response.ok) throw new Error('Network response was not ok');
        const fetchedData = await response.json();
        if (fetchedData.content) {
          const jsonParsedData = JSON.parse(fetchedData.content);
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
    <DemandTable
      isLoading={isLoading}
      months={months}
      data={data}
      error={error}
      resources={resources}
    />
  );
}

export const Page = () => {
  const [value, setValue] = useState(0);

  const handleChange = (
    event: SyntheticEvent<Element, Event>,
    newValue: number
  ) => {
    console.log('index:', newValue);
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab icon={<ReceiptIcon />} iconPosition='start' label='Demand' />
          <Tab
            icon={<SupervisedUserCircleIcon />}
            iconPosition='start'
            label='Resources'
          />
          <Tab icon={<PersonIcon />} iconPosition='start' label='Bench' />

          <Tab icon={<UploadIcon />} iconPosition='start' label='Upload' />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <DemandTableContainer />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ResourceTable />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ResourceTable bench />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <FileUpload />
      </TabPanel>
    </Box>
  );
};
