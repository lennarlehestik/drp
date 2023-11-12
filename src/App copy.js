import logo from './logo.svg';
import './App.css';
import {useState} from 'react';
import Divider from '@mui/joy/Divider';
import Button from '@mui/joy/Button';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Textarea from '@mui/joy/Textarea';
import Checkbox from '@mui/joy/Checkbox';
import Typography from '@mui/joy/Typography';
import Input from '@mui/joy/Input';
import LinearProgress from '@mui/joy/LinearProgress';
import Card from '@mui/joy/Card';
import Cases from './Cases';
import DrawerFilters from './Drawer';
import Box from '@mui/joy/Box';

function App() {
  const [view, setView] = useState("claim")
  const [claimtypes, setClaimtypes] = useState([])
  const [claimtypeselected, setClaimtypeselected] = useState()

  const addclaimtype = () => {
    console.log(claimtypes)
    setClaimtypes([...claimtypes, claimtypeselected])
  }

  const handleClaimchange = (value) => {
    console.log("handleClaimchange", value); 
    setClaimtypeselected(value);
  }
  return (
    <div className="App">
    <div className = "navigation">
    <Cases />
    <DrawerFilters />
    </div>
      <Card className="card">
      {view == "claim" ?
      <>
        <Typography level="title-lg" sx={{width:"100%"}}>
          Claim
        </Typography>
        <div class="added-buttons">

        {
          claimtypes?.map((claimtype) =>{
            return(<Button variant="outlined">{claimtype}</Button>)
          })
        }
        </div>
        <div class="select-add">
        <Select value={claimtypeselected} placeholder="Claim type..." sx={{width:"100%"}} onChange={(e, value) => handleClaimchange(value)}>
          <Option value="Execution of Unexecuted Case">Execution of Unexecuted Case</Option>
          <Option value="Harm or Injury">Harm or Injury</Option>
          <Option value="Arbitrator Wrongful Action">Arbitrator Wrongful Action</Option>
          <Option value="Failure to Deliver Project">Failure to Deliver Project</Option>
          <Option value="Breach of Bylaws">Breach of Bylaws</Option>
          <Option value="Miscellaneous">Miscellaneous</Option>
        </Select>
        <Button onClick={()=>addclaimtype()}>Add</Button>
        </div>
        <Textarea placeholder="Provide background, describe events, explain reasoning, and outline claim details..." minRows={5} sx={{width:"100%"}} />
        <div className="buttons"><Button variant="solid" sx={{width:"100%"}} onClick={() =>setView("contacts")}>Next</Button></div>
        <LinearProgress determinate value={5} thickness={5} sx={{width:"100%"}} />

        </>
        : view == "relief" ?
        <>
        <Typography level="title-lg" sx={{width:"100%"}}>
          Relief requested
        </Typography>
        <Typography level="title-sm" sx={{width:"100%"}}>
          Fine
        </Typography>
        <Input
          placeholder="Amount"
          startDecorator={'EOS'}
          sx={{width:"100%"}}
        />
        <Checkbox placeholder="Refund" sx={{width:"100%"}} />
        <div className="buttons">
          <Button variant="outlined" sx={{width:"100%"}} onClick={() =>setView("claim")}>Previous</Button>
          <Button variant="solid" sx={{width:"100%"}} onClick={() =>setView("contacts")}>Next</Button>
        </div>
        <LinearProgress determinate value={25} thickness={5} sx={{width:"100%"}} />

        </>
        : view =="contacts" ?
        <>
        <Typography level="title-lg" sx={{width:"100%"}}>
          Contacts
        </Typography>
        <Input placeholder="Email" sx={{width:"100%"}} />
        <Input placeholder="Respondent's email (if available)" sx={{width:"100%"}} />
        <Input placeholder="Respondent's EOS account name" sx={{width:"100%"}} />
        <div className="buttons">
          <Button variant="outlined" sx={{width:"100%"}} onClick={() =>setView("claim")}>Previous</Button>
          <Button variant="solid" sx={{width:"100%"}} onClick={() =>setView("evidence")}>Next</Button>
        </div>
        <LinearProgress determinate value={60} thickness={5} sx={{width:"100%"}} />

        </>
        : view == "evidence" ?
        <>
        <Typography level="title-lg" sx={{width:"100%"}}>
          Evidence
        </Typography>
        <div className="buttons">
          <Button variant="outlined" sx={{width:"100%"}} onClick={() =>setView("contacts")}>Previous</Button>
          <Button variant="solid" sx={{width:"100%"}} onClick={() =>setView("")}>Submit case</Button>
        </div>
        <LinearProgress determinate value={90} thickness={5} sx={{width:"100%"}} />

        </>
        :
        <Typography level="title-lg" sx={{width:"100%"}}> Something went wrong.</Typography>
      }
    </Card>
    </div>
  );
}
export default App;
