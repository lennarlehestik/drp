import logo from './logo.svg';
import './App.css';
import Card from '@mui/joy/Card';
import { DataContext } from './DataContext';
import { useContext } from 'react';
import Table from '@mui/joy/Table';
import Button from '@mui/joy/Button';
import {caseStages} from './stages';
import { Typography } from '@mui/joy';
import Select from '@mui/joy/Select';
import { useState, useEffect } from 'react';
import Option from '@mui/joy/Option';

function AllCases() {
  const { cases, setPage, setCaseView, community, accountName} = useContext(DataContext);
  const [filter, setFilter] = useState("All cases")
  const [displaycases, setDisplayCases] = useState(cases)

  const goToCase = (case_id) => {
    setCaseView(case_id)
    setPage("CASE_VIEW")
  }

  useEffect(()=>{
    setDisplayCases(cases)
  }, [cases])

  useEffect(()=>{
    setDisplayCases(cases)
    setFilter("All cases")
  }, [cases])

  useEffect(() => {
    if (filter === "All cases") {
      setDisplayCases(cases);
    } else if (filter === "Cases against me") {
      setDisplayCases(cases.filter(value => value?.respondents_account === accountName));
    } else if (filter === "Cases by me") {
      setDisplayCases(cases.filter(value => value?.claimant_name === accountName));
    } else if (filter === "My arbitrated cases") {
      setDisplayCases(cases.filter(value => 
        value?.arbitrators.some(arbitrator => arbitrator.key === accountName)
      ));
    }
  }, [filter, cases, accountName]); // Make sure to include all dependencies here
  

  return (
    <>
    <div className="contentCard">
      <Card sx={{marginBottom:"10px", display:"flex"}}>
        <div className="allCasesMenu">
        <Typography level="title-lg">{community}</Typography>
        <Select value={filter} onChange={(e, value) => setFilter(value)}>
          <Option disabled>Sort by</Option>
          <Option value="All cases">All cases</Option>
          <Option value="Cases against me">Cases against me</Option>
          <Option value="Cases by me">Cases by me</Option>
          <Option value="My arbitrated cases">My arbitrated cases</Option>
        </Select>
        </div>
      </Card>
      {cases.length > 0 ?
      displaycases?.map((value, index)=>{
        return(
          <Card sx={{marginBottom:"10px"}} key={value?.case_id}>
            <Typography level="title-lg">Case: #{value?.number} 
            {value?.related_cases && value?.related_cases.length > 0 
            ? ` - ${value?.case_id}` 
            : null}
        </Typography>
            <Typography sx={{marginBottom:"-8px"}} level="title-sm">Claimant account name</Typography>
            <Typography level="body-sm">{value?.claimant_name}</Typography>
            <Typography sx={{marginBottom:"-8px"}} level="title-sm">Respondent account name</Typography>
            <Typography level="body-sm">{value?.respondents_account}</Typography>
            <Typography sx={{marginBottom:"-8px"}} level="title-sm">Current stage</Typography>
            <Typography level="body-sm">{caseStages[Number(value?.stage)]}</Typography>
            <Button size="sm" sx={{width:"100px"}} onClick={()=> goToCase(value)}>Open case</Button>
          </Card>
        )
      })
    :
    <Card>
      <Typography level="title-lg">No cases in this community</Typography>
      </Card>
    }
    </div>
    </>
  );
}
export default AllCases;
