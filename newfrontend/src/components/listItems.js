import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PaidIcon from "@mui/icons-material/Paid";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';

export const mainListItems = (
  <React.Fragment>
    <a href="/">
      <ListItemButton>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
    </a>
    <a href="/add">
      <ListItemButton>
        <ListItemIcon>
          <PaidIcon />
        </ListItemIcon>
        <ListItemText primary="Add/Buy Crypto" />
      </ListItemButton>
    </a>
    <a href="/sell">
      <ListItemButton>
        <ListItemIcon>
          <RemoveCircleIcon />
        </ListItemIcon>
        <ListItemText primary="Sell/Remove Crypto" />
      </ListItemButton>
    </a>
    <a href="/conversion">
      <ListItemButton>
        <ListItemIcon>
          <CurrencyExchangeIcon />
        </ListItemIcon>
        <ListItemText primary="Magic Conversion" />
      </ListItemButton>
    </a>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    {/* <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItemButton> */}
  </React.Fragment>
);
