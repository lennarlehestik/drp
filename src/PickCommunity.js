import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import { useState } from 'react';
import './App.css';
import { DataContext } from './DataContext';
import { useContext } from 'react';
import React from 'react';
import { Typography } from '@mui/joy';

function PickCommunity() {
    const { community, setCommunity, communities, setPage } = React.useContext(DataContext);
    const switchCommunity = (community) => {
        setCommunity(community)
        const newPath = `/community/${community}`;
        window.history.pushState({}, '', newPath);
        setPage("ALL_CASES")
    }
    return (
    <div className="cases">
    <Dropdown>
        
        <MenuButton>{community}</MenuButton>
        <Menu>
        <MenuItem disabled>Pick a community</MenuItem>
        {communities?.filter(community => community?.community !== 'drpappdrpapp').map((community) => (
        <MenuItem onClick={() => switchCommunity(community?.community)}>{community?.community}</MenuItem>
        ))}
        </Menu>
    </Dropdown>
  </div>
  );
}
export default PickCommunity;
