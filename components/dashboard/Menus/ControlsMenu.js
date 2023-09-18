import React, { useState } from 'react'
import { ButtonMenu } from '@/components/airview-ui';
import { ControlDataDisplay } from '@/components/compliance/ControlData';
import CloseIcon from '@mui/icons-material/Close';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography, Box } from '@mui/material';


export function ControlsMenu({
    controls
}) {

    const [dialogOpen, setDialogOpen] = useState(false);
    const [controlUrl, setControlUrl] = useState('');

    const handleControlClick = (url, label) => {
        // Show the dialog box
        setDialogOpen(true);
        const selectedControl = controls.find((control) => control.file === url);
        setControlUrl({ url, label, selectedControl });

    };

    return (
        <>
            <ButtonMenu
                menuTitle="Controls"
                menuItems={createControlMenu(controls)}
                initialCollapsed={false}
                loading={false}
                fetching={false}
                handleButtonClick={handleControlClick}
            />

            {controlUrl.selectedControl &&
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth={true} maxWidth={'lg'} sx={{
                    "& .MuiDialog-container": {
                        alignItems: "flex-start"
                    }
                }}
                    scroll='paper'>
                    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h4">{controlUrl.selectedControl?.data?.friendly_name || controlUrl.selectedControl?.data?.name } ({controlUrl.selectedControl?.data?.id || 'N/A'})</Typography>
                        <IconButton edge="end" color="inherit" onClick={() => setDialogOpen(false)} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <ControlDataDisplay data={controlUrl.selectedControl} />
                    </DialogContent>
                </Dialog>
            }
        </>
    )

}



function createControlMenu(controls) {
    // console.log('createControlMenu:controls: ', controls)
    try {
        const links = controls.map((control) => {
            const label = control.data.friendly_name || control.data.id || ''; // Adjust the property name according to your control data structure
            const url = control.file;

            return {
                label,
                url,
            };
        });

        return [
            {
                links: links
            }];
    } catch (error) {
        // // console.log('createControlMenu:error: ', error)

        return [
            {
                groupTitle: "Controls",
                links: [],
            }]
    }
};


