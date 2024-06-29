import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { dirname } from 'path';
import * as React from 'react';
import { useState } from 'react';

// import * as matter from "gray-matter";
import { siteConfig } from '@/config';
import { getLogger } from '@/lib/Logger';

const logger = getLogger().child({ namespace: 'NewContentDialog' });
logger.level = 'info';

// Custom Dropdown Indicator defined outside
const DropdownIndicator = ({ isLoadingItems }: { isLoadingItems: boolean }) =>
  isLoadingItems ? (
    <CircularProgress size={24} style={{ color: 'inherit', marginRight: 8 }} />
  ) : (
    <ArrowDropDownIcon />
  );

export function NewContentDialog({
  dialogOpen = false,
  handleDialog,
  initialDropDownData = [],
}: {
  dialogOpen: boolean;
  handleDialog: (value: { frontmatter: any } | null) => Promise<void>;
  initialDropDownData?: any[];
}) {
  const [dropDownData, setDropDownData] = useState(initialDropDownData);
  const [selectedDropDown, setSelectedDropDown] = useState('');
  const [docType, setDocType] = useState('');

  const [parent, setParent] = useState('None');

  const [availableParents, setAvailableParents] = useState(['None']);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingItems, setIsLoadingItems] = useState(false);

  const [error, setError] = useState('' as string);

  const docTypes = Object.entries(siteConfig.content)
    .map(([_, item]) => {
      // Now TypeScript understands `item` is a `ContentItem` or undefined
      if (item && item.reference && item.path) {
        return {
          label: item.reference,
          prefix: item.path.split('/').pop(), // Extract the last segment of the path as the prefix
        };
      }
      return null; // Exclude the item from the list
    })
    .filter(
      (entry): entry is { label: string; prefix: string } => entry !== null
    );

  const getParentContentElements = (): { [key: string]: string[] } => {
    const parentContentElements: { [key: string]: string[] } = {};

    Object.entries(siteConfig.content).forEach(([contentType, content]) => {
      content?.collections?.forEach((collection) => {
        const entries = parentContentElements[collection] || ['None'];
        entries.push(contentType);
        parentContentElements[collection] = entries;
      });
    });
    return parentContentElements;
  };

  const parentReference = () => {
    for (const [key, content] of Object.entries(siteConfig.content)) {
      if (key === parent) {
        return content.reference;
      }
    }
    return null;
  };

  const parentContentElements = getParentContentElements();

  // console.log('parentContentElements: ', parentContentElements);
  // // console.log(docTypes);
  // const docTypes = [{ label: 'Solution', prefix: 'solutions' }, { label: 'Design', prefix: 'designs' }, { label: 'Service', prefix: 'services' }, { label: 'Provider', prefix: 'providers' }, { label: 'Knowledge', prefix: 'knowledge' }];

  const handleCreateNew = async () => {
    // console.log('create new pad: ', title, ' / ', selectedDropDown, ' / ', parent);
    // const pad = uuidv4(); // Generate a unique padID

    const parentRef = parentReference();
    // console.log('parentRef: ', parentRef);

    let frontmatter;
    if (!parentRef) {
      // define the object for when parent === 'None'
      frontmatter = {
        type: docType,
        title,
      };
    } else {
      // define the object for when parent !== 'None'
      frontmatter = {
        type: docType,
        [parentRef.toLowerCase()]: dirname(selectedDropDown),
        title,
      };
    }
    setIsLoading(true);
    setError('');
    try {
      await handleDialog({ frontmatter });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleParentChange = async (newParent: string) => {
    setIsLoadingItems(true);
    setParent(newParent);
    setSelectedDropDown('');
    fetch(`/api/content/structure?collection=${newParent}`)
      .then((res) => res.json())
      .then((data) => {
        // const values = data.docs.map(
        //   ({ file, frontmatter }: { file: string; frontmatter: any }) => ({
        //     label: frontmatter.title,
        //     url: file,
        //   })
        // );

        const values = data;
        logger.info({ values });
        setDropDownData(
          values.sort((a: any, b: any) => {
            // Assuming that some objects might not have a 'label' property
            const labelA = a.label || '';
            const labelB = b.label || '';

            if (labelA < labelB) {
              return -1; // a comes first
            }
            if (labelA > labelB) {
              return 1; // b comes first
            }
            return 0; // no change in order
          })
        );
        setIsLoadingItems(false);
      })
      .catch((err: any) => {
        logger.error(err);
        setError('error loading content');
        setIsLoadingItems(false);
      });
  };

  const handleDocTypeChange = async (x: string) => {
    setAvailableParents(parentContentElements[x] ?? ['None']);
    setDocType(x);
    setSelectedDropDown('');
  };

  const handleDropDownChange = (event: any) => {
    logger.info('handleDropDownChange: ', event.target.value);
    setSelectedDropDown(event.target.value);
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={() => handleDialog(null)}
      fullWidth
      maxWidth='md'
    >
      <DialogTitle>Create New</DialogTitle>
      <DialogContent>
        {/* Title Input */}
        <Typography variant='subtitle1' gutterBottom>
          Title
        </Typography>
        <TextField
          autoFocus
          margin='dense'
          id='title'
          label='Title'
          type='text'
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {/* Parent Buttons */}
        <Typography
          variant='subtitle1'
          gutterBottom
          style={{ marginTop: '20px' }}
        >
          Document Type
        </Typography>
        <ButtonGroup
          variant='outlined'
          color='primary'
          aria-label='outlined primary button group'
        >
          {docTypes.map((docTypeItem) => (
            <Button
              key={docTypeItem?.prefix} // Add the key prop with a unique identifier
              variant={
                docTypeItem?.prefix === docType ? 'contained' : 'outlined'
              }
              onClick={() => handleDocTypeChange(docTypeItem?.prefix)}
            >
              {docTypeItem?.label}
            </Button>
          ))}
        </ButtonGroup>

        {/* Document Type Buttons */}
        <Typography
          variant='subtitle1'
          gutterBottom
          style={{ marginTop: '20px' }}
        >
          Select Parent
        </Typography>
        <ButtonGroup
          variant='outlined'
          color='primary'
          aria-label='outlined primary button group'
        >
          {availableParents.map((parentOption) => (
            <Button
              key={parentOption} // Add the key prop with a unique identifier
              variant={parentOption === parent ? 'contained' : 'outlined'}
              onClick={() => handleParentChange(parentOption)}
            >
              {parentOption}
            </Button>
          ))}
        </ButtonGroup>

        {/* Dropdown for selected parent */}
        <Typography
          variant='subtitle1'
          gutterBottom
          style={{ marginTop: '20px' }}
        >
          Select Item
        </Typography>
        <FormControl fullWidth>
          <Select
            value={selectedDropDown}
            onChange={handleDropDownChange}
            // eslint-disable-next-line react/no-unstable-nested-components
            IconComponent={(props) => (
              <DropdownIndicator isLoadingItems={isLoadingItems} {...props} />
            )}
            disabled={isLoadingItems || dropDownData.length === 0} // Disable when loading or no data
          >
            {dropDownData.map((item) => (
              <MenuItem key={item.label} value={item.url}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => handleDialog(null)}>Cancel</Button>
        <Button onClick={handleCreateNew} disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : 'Submit'}
        </Button>
      </DialogActions>
      {error && <Alert severity='error'>{error}</Alert>}
    </Dialog>
  );
}
