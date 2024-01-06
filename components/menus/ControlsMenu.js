'use client'
import React, { useState } from "react";
import { ButtonMenu } from "@/components/menus";
import { ControlDataDisplay } from "@/components/compliance/ControlData";
import CloseIcon from "@mui/icons-material/Close";


import CheckIcon from '@mui/icons-material/Check';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoIcon from '@mui/icons-material/Info';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { MiniStatisticsCard } from "@/components/compliance";

export function ControlsMenu({ controls }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [controlUrl, setControlUrl] = useState("");

  const controlCoverage = createControlCoverage(controls);

  console.log("ControlsMenu:controls: ", controls);
  let icon = { color: "success", icon: CheckIcon };

  if (controlCoverage && controlCoverage.controlCoverage < 50) {
    icon = { color: "error", icon: ErrorOutlineIcon };
  } else if (controlCoverage && controlCoverage.controlCoverage < 100) {
    icon = { color: "warning", icon: WarningAmberIcon };
  } else if (!controlCoverage.controlCoverage) {
    icon = { color: "info", icon: InfoIcon };
  }

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
        // initialCollapsed={controlCoverage && controlCoverage.length ? false : true}
        initialCollapsed={false}
        loading={false}
        fetching={false}
        handleButtonClick={handleControlClick}
      >
        <MiniStatisticsCard
          color="text.highlight"
          title="Controls"
        //   count={10}
          count={controlCoverage.controlCount}
          percentage={{ value: controlCoverage.controlCoverage ? controlCoverage.controlCoverage : '0', text: "% coverage" }}
        //   percentage={{ value: 100, text: "% coverage" }}
        //   icon={{ color: "success", icon: "check" }}
          icon={icon}
        />
      </ButtonMenu>
      {controlUrl.selectedControl && (
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          fullWidth={true}
          maxWidth={"lg"}
          sx={{
            "& .MuiDialog-container": {
              alignItems: "flex-start",
            },
          }}
          scroll="paper"
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h4">
              {controlUrl.selectedControl?.data?.friendly_name ||
                controlUrl.selectedControl?.data?.name}{" "}
              ({controlUrl.selectedControl?.data?.id || "N/A"})
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => setDialogOpen(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <ControlDataDisplay data={controlUrl.selectedControl} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

function createControlMenu(controls) {
  // console.log('createControlMenu:controls: ', controls)
  try {
    const links = controls.map((control) => {
      const label = control.data.friendly_name || control.data.id || ""; // Adjust the property name according to your control data structure
      const url = control.file;

      return {
        label,
        url,
      };
    });

    return [
      {
        links: links,
      },
    ];
  } catch (error) {
    // // console.log('createControlMenu:error: ', error)

    return [
      {
        groupTitle: "Controls",
        links: [],
      },
    ];
  }
}

function createControlCoverage(controls) {
  // // console.log('createControlCoverage:controls: ', controls)

  let controlCountCovered = 0;
  let controlCountUnCovered = 0;
  let controlMethods = 0;
  let controlCoverage = 0;

  for (const control of controls) {
    if (
      control.data &&
      control.data.methods &&
      control.data.methods.length > 0
    ) {
      controlMethods += control.data.methods.length;
      controlCountCovered++;
    } else {
      controlCountUnCovered++;
    }
  }
  // calculate the percentage of covered controls vs controls
  controlCoverage = Math.round((controlCountCovered / controls.length) * 100);
  // // console.log('createControlCoverage:controlCoverage: ', controlCoverage)
  return {
    controlCountCovered,
    controlCountUnCovered,
    controlMethods,
    controlCoverage,
    controlCount: controls.length,
  };
}
