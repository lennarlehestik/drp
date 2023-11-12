import logo from './logo.svg';
import './App.css';
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import { DataContext } from './DataContext';
import { useContext } from 'react';
import Table from '@mui/joy/Table';
import Button from '@mui/joy/Button';
import {caseStages} from './stages';
import ToggleButtonGroup from '@mui/joy/ToggleButtonGroup';
import {useState} from 'react';
import Input from '@mui/joy/Input';
import Switch from '@mui/joy/Switch';
import Divider from '@mui/joy/Divider';
import Textarea from '@mui/joy/Textarea';
import FileUpload from './FileUpload';

function VerdictView() {
  const { cases, caseView, accountName} = useContext(DataContext);
  const [value, setValue] = useState("")

  return (
    <>
      <Card className="contentCard">
        <Typography level="title-lg">Verdict for case: {caseView?.case_id}</Typography>
        <Typography level="title-md">Case summary</Typography>
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">{caseView?.claimant_name} claims against {caseView?.respondents_account}:</Typography>
        <div class="claimCardWrapper">
        {
          caseView?.claims?.map((value, index)=>{
            return(
              <Card className="claimCard">
                <Typography sx={{marginBottom:"-8px"}} level="title-sm">{value}</Typography>
                <Typography level="body-sm" sx={{lineHeight:"12px"}}>{caseView?.fine[index]} fine</Typography>
                <Typography level="body-sm" sx={{lineHeight:"12px"}}>{caseView?.relief[index]} relief</Typography>
                <Typography level="body-sm" sx={{lineHeight:"12px"}}>{caseView?.suspension[index]} day suspension</Typography>
                <Typography level="body-sm" sx={{lineHeight:"12px"}}>{caseView?.ban == 0 ? "No ban requested" : "Ban requested"}</Typography>
              </Card>
            )
          })
        }
        </div>
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">{caseView?.respondents_account}'s counteroffer:</Typography>
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">{caseView?.respondents_account}'s claim against {caseView?.claimant_name}:</Typography>
        <Divider />
        <Typography level="title-md">Verdict</Typography>
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Verdict for:</Typography>
        <ToggleButtonGroup
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <Button value={caseView?.claimant_name}>{caseView?.claimant_name}</Button>
          <Button value={caseView?.respondents_account}>{caseView?.respondents_account}</Button>
          <Button value="negotiated">negotiated</Button>
        </ToggleButtonGroup>
        <Input
          placeholder="Fine amount"
          startDecorator={'EOS'}
          sx={{width:"100%"}}
          onChange={(e, value) => console.log(e)}
          value={null}
        />
        <Input
          placeholder="Relief amount"
          startDecorator={'EOS'}
          sx={{width:"100%"}}
          onChange={(e, value) => console.log(e)}
          value={null}
        />
        <Input
          placeholder="Suspension"
          startDecorator={'Days'}
          sx={{width:"100%"}}
          onChange={(e, value) => console.log(e)}
          value={null}
        />
        <Typography level="body-md" component="label" endDecorator={<Switch sx={{ ml: 1 }} />}>
          Ban:
        </Typography>
        <Textarea placeholder="Provide info on the verdict." minRows={5} sx={{width:"100%"}}/>
        <FileUpload />
        <Button>Submit verdict</Button>
        </Card>
    </>
  );
}
export default VerdictView;
