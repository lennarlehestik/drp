import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react';
import { DataContext } from './DataContext';
import { useContext } from 'react';
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
import Sheet from '@mui/joy/Sheet';
import Switch from '@mui/joy/Switch';
import FileUpload from './FileUpload';
import ToggleButtonGroup from '@mui/joy/ToggleButtonGroup';
import VerdictFileUpload from './VerdictFileUpload';
import sweetalert from './alert';
import Swal from 'sweetalert2';

function GiveVerdict() {
  const { cases, caseView, accountName, setPage, activeUser, community, setRefresh} = useContext(DataContext);
  const [value, setValue] = useState("")

  const [formData, setFormData] = useState({
    ipfsProof:[],
    verdict_for: "",
    fine: "0",
    relief: "0",
    suspension: 0,
    verdict_info: "",
    banselected: false,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
        ...prevState,
        [name]: value
    }));
  };

  const submitVerdict = async () =>{
    console.log({
      case_winner: formData?.verdict_for,
      lead_arbitrator: accountName,
      community: community,
      case_id: caseView?.case_id,
      fine_verdict: [Number(formData?.fine).toFixed(4) + " EOS"],
      relief_verdict: [Number(formData?.relief).toFixed(4) + " EOS"],
      suspension_verdict: [formData?.suspension],
      verdict_description: formData?.verdict_info,
      ipfs_cid_verdict: formData?.ipfsProof,
      ban_verdict: formData?.banselected

    })
    if (activeUser) {
      try {
        const transaction = {
          actions: [
            {
              account: "drpappdrpapp",
              name: "giveverdict",
              authorization: [
                {
                  actor: accountName,
                  permission: "active",
                },
              ],
              data:
              {
                case_winner: formData?.verdict_for,
                lead_arbitrator: accountName,
                community: community,
                case_id: caseView?.case_id,
                fine_verdict: [Number(formData?.fine).toFixed(4) + " EOS"],
                relief_verdict: [Number(formData?.relief).toFixed(4) + " EOS"],
                suspension_verdict: [formData?.suspension],
                verdict_description: formData?.verdict_info,
                ipfs_cid_verdict: formData?.ipfsProof,
                ban_verdict: formData?.banselected
              },
            },
          ],
        };
        await activeUser.signTransaction(transaction, {
          expireSeconds: 300,
          blocksBehind: 3,
          broadcast: true,
        });
        Swal.fire({
          title: "Verdict submitted!",
          text: "You have submitted the verdict. Other arbitrators can now sign it.",
          showConfirmButton: false,
        });
        setPage("ALL_CASES")
        setTimeout(()=>{
          setRefresh((prevRefresh) => prevRefresh + 1)
        }, 3000)
       } catch (error) {
        sweetalert(error.message)
      }
    } else {
      sweetalert("Please log in.")
    }
  }

  return (
    <>
    <div className="contentCard">
    <>
      <Card>
        <Typography level="title-lg">Verdict for case: #{caseView?.number}</Typography>
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
              </Card>
            )
          })
        }
        </div>
        <Typography level="body-sm" sx={{lineHeight:"12px"}}>{caseView?.ban == 0 ? "No ban requested" : "Ban requested!"}</Typography>

        <Typography sx={{marginBottom:"-8px"}} level="title-sm">{caseView?.respondents_account}'s counteroffer:</Typography>
        <div class="claimCardWrapper">
        {
          caseView?.claims?.map((value, index)=>{
            return(
              <Card className="claimCard">
                <Typography sx={{marginBottom:"-8px"}} level="title-sm">{value}</Typography>
                <Typography level="body-sm" sx={{lineHeight:"12px"}}>{caseView?.fine_counter[index]} fine</Typography>
                <Typography level="body-sm" sx={{lineHeight:"12px"}}>{caseView?.relief_counter[index]} relief</Typography>
                <Typography level="body-sm" sx={{lineHeight:"12px"}}>{caseView?.suspension_counter[index]} day suspension</Typography>
              </Card>
            )
          })
        }
        </div>
        <Divider />
        <Typography level="title-md">Verdict</Typography>
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Verdict for:</Typography>
        <ToggleButtonGroup
          value={formData?.verdict_for}
          onChange={(event, newValue) => {
            setFormData({ ...formData, verdict_for: newValue });
          }}
        >
          <Button value={caseView?.claimant_name}>{caseView?.claimant_name}</Button>
          <Button value={caseView?.respondents_account}>{caseView?.respondents_account}</Button>
          <Button value="negotiated">negotiated</Button>
        </ToggleButtonGroup>
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Fine amount</Typography>
        <Input
          placeholder="Fine amount"
          startDecorator={'EOS'}
          sx={{width:"100%"}}
          onChange={(e) => setFormData({ ...formData, fine: e.target.value })}
          value={formData?.fine}
          type="number"
        />
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Relief amount</Typography>
        <Input
          placeholder="Relief amount"
          startDecorator={'EOS'}
          sx={{width:"100%"}}
          onChange={(e) => setFormData({ ...formData, relief: e.target.value })}
          value={formData?.relief}
          type="number"
        />
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Suspension days</Typography>
        <Input
          placeholder="Suspension"
          startDecorator={'Days'}
          sx={{width:"100%"}}
          onChange={(e) => setFormData({ ...formData, suspension: e.target.value })}
          value={formData?.suspension}
          type="number"
        />
        <Typography component="label" sx={{width:"100%"}} endDecorator={<Switch checked={formData?.banselected} name="banselected" sx={{ ml: 1 }} onChange={(e) => setFormData(prevState => ({ ...prevState, banselected: !formData.banselected }))}/>}>
          Ban:
        </Typography>
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Info on the verdict</Typography>
        <Textarea 
          placeholder="Provide info on the verdict." 
          minRows={5} 
          sx={{width:"100%"}}
          onChange={(e) => setFormData({ ...formData, verdict_info: e.target.value })}
          value={formData?.verdict_info}
        />
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Upload supporting documents</Typography>
        <VerdictFileUpload setFormData={setFormData} formData={formData}/>
        <Button onClick={()=>submitVerdict()}>Submit verdict</Button>
        </Card>
    </>
    </div>
    </>
  );
}
export default GiveVerdict;
