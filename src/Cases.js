import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import { useState } from 'react';
import './App.css';
import { DataContext } from './DataContext';
import { useContext } from 'react';
import { Typography } from '@mui/joy';

function Cases() {
  const { cases, accountName, setCaseView, setPage} = useContext(DataContext);
  const goToCase = (case_id) => {
    setCaseView(case_id)
    setPage("CASE_VIEW")
  }
  const filteredCases = cases.filter(value => value?.claimant_name === accountName || value?.respondents_account === accountName);

  return (
    <div className="cases">
    <Dropdown>
        <MenuButton>My cases</MenuButton>
        <Menu>
        {
          // Check if there are any filtered cases to display
          filteredCases.length > 0 ? (
            filteredCases.map((value, index) => (
              <MenuItem key={index} onClick={() => goToCase(value)}>
                {value?.case_id} - {value?.claimant_name === accountName ? value?.respondents_account : value?.claimant_name}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No cases</MenuItem>
          )
        }

        </Menu>
    </Dropdown>
  </div>
  );
}
export default Cases;
