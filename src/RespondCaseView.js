import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react';
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
import FileUpload from './FileUploadRespondCase';
import { DataContext } from './DataContext';
import { useContext } from 'react';
import ModalClose from '@mui/joy/ModalClose';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Drawer from '@mui/joy/Drawer';
import sweetalert from './alert';
import Swal from 'sweetalert2';

function RespondCaseView() {
  const {caseView, accountName, activeUser, community, setPage, setRefresh, depositData, endpoint} = useContext(DataContext);

  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState()

  const [view, setView] = useState("claim")
  const [claimtypes, setClaimtypes] = useState([])
  const [formData, setFormData] = useState({
    ipfsProof: [],
    description: "",
    evidence_description: "",
    fine_counter: [],
    relief_counter: [],
    suspension_counter: []
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
        ...prevState,
        [name]: value
    }));
  };

  const handleCounterChange = (event) => {
    const { name, value } = event.target;
    let newdata = [...formData[name]]; // Create a copy of the array
    newdata[editingIndex] = value;
    setFormData(prevState => ({
        ...prevState,
        [name]: newdata
    }));
};


  useEffect(()=>{
    setFormData(prevState => ({
      ...prevState,
      fine_counter: caseView["fine"],
      relief_counter: caseView["relief"],
      suspension_counter: caseView["suspension"]
  }));
  }, [])

  const edit = (index) => {
    setOpen(true)
    setEditingIndex(index)
    console.log(index)
  }

  const createResponse = async () =>{
    let haspaid = false
    if(depositData?.find(value => value?.case_id === caseView?.case_id).respondents_payment == caseView?.deposit_for_respondent){
      haspaid = true
    }
    let amounttopay = caseView?.deposit_for_respondent
    let deposittopay;
    try {
      // URL to EOSIO node
      const url = `${endpoint}/v1/chain/get_table_rows`;
      // Fetch data from EOSIO node
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          json: true,
          code: "swap.defi",
          table: "pairs",
          scope: "swap.defi",
          lower_bound: 12,
          upper_bound: 12,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // If response is not ok, throw an error
      if (!response.ok) {
        throw Error('Network response was not ok' + response.statusText);
      }

      // Parse JSON data
      const data = await response.json();
      deposittopay = (Number(amounttopay.split(" ")[0]) * Number(data?.rows[0]?.price1_last)).toFixed(4)
    }
    catch(error){
      console.log(error)
    }

    if (activeUser) {
      try {
        let transaction;
        if(haspaid){
        transaction = {
          actions: [
            {
              account: "drpappdrpapp",
              name: "respondcase",
              authorization: [
                {
                  actor: accountName, // use account that was logged in
                  permission: "active",
                },
              ],
              data:
              {
                case_id: caseView?.case_id,
                community: community,
                respondents_response: formData?.description,
                respondents_ipfs_cids: formData?.ipfsProof,
                respondents_evidents_description: formData?.evidence_description,
                fine_counter: formData?.fine_counter,
                relief_counter: formData?.relief_counter,
                suspension_counter: formData?.suspension_counter
              },
            },
          ],
        };
        }
        else{
          transaction = {
            actions: [
              {
                account: "eosio.token",
                name: "transfer",
                authorization: [
                  {
                    actor: accountName,
                    permission: "active",
                  },
                ],
                data: {
                  from: accountName,
                  to: "swap.defi",
                  quantity: (Number(deposittopay) + 0.0020) + " EOS",
                  memo: "swap,0,12",
                },
              },
              {
                account: "tethertether",
                name: "transfer",
                authorization: [
                  {
                    actor: accountName,
                    permission: "active",
                  },
                ],
                data:
                {
                  from: accountName,
                  to: "drpappdrpapp",
                  quantity: amounttopay,
                  memo: caseView?.case_id + ',' + community
                },
              },
              {
                account: "drpappdrpapp",
                name: "respondcase",
                authorization: [
                  {
                    actor: accountName, // use account that was logged in
                    permission: "active",
                  },
                ],
                data:
                {
                  case_id: caseView?.case_id,
                  community: community,
                  respondents_response: formData?.description,
                  respondents_ipfs_cids: formData?.ipfsProof,
                  respondents_evidents_description: formData?.evidence_description,
                  fine_counter: formData?.fine_counter,
                  relief_counter: formData?.relief_counter,
                  suspension_counter: formData?.suspension_counter
                },
              },
            ],
          };
        }
        await activeUser.signTransaction(transaction, {
          expireSeconds: 300,
          blocksBehind: 3,
          broadcast: true,
        });
        Swal.fire({
          title: "Responded to case!",
          text: "Arbitrators will now give a verdict.",
          showConfirmButton: false,
        });
        setTimeout(()=>{
          setRefresh((prevRefresh) => prevRefresh + 1)
        }, 5000)
        setPage("ALL_CASES") 
       } catch (error) {
        sweetalert(error.message)
      }
    } else {
      sweetalert("Please log in.")
    }
  }

  return (
    <>
      <Card className="card">
      {view == "claim" ?
      <>
        <Typography level="title-lg" sx={{width:"100%"}}>
          Response
        </Typography>
        <Textarea placeholder="Explain your response to the case..." minRows={5} sx={{width:"100%"}} name="description" onChange={handleInputChange} value={formData?.description}/>
        <Divider />

        <div className="buttons"><Button variant="solid" sx={{width:"100%"}} onClick={() =>setView("evidence")}>Next</Button></div>
        <LinearProgress determinate value={5} thickness={5} sx={{width:"100%"}} />

        </>
        
        : view == "evidence" ?
        <>
          <Typography level="title-lg" sx={{width:"100%"}}>
            Evidence
          </Typography>
          <Textarea placeholder="Evidence to support your case..." minRows={5} sx={{width:"100%"}} name="evidence_description" onChange={handleInputChange} value={formData?.evidence_description}/>
          <FileUpload setFormData={setFormData} formData={formData}/>
          <div className="buttons">
          <Button variant="outlined" sx={{width:"100%"}} onClick={() =>setView("claim")}>Previous</Button>
          <Button variant="solid" sx={{width:"100%"}} onClick={() =>setView("relief")}>Next</Button>
        </div>
        <LinearProgress determinate value={35} thickness={5} sx={{width:"100%"}} />

        </>

        : view == "relief" ?
        <>

        <Typography level="title-lg" sx={{width:"100%"}}>
          Counter claims
        </Typography>
        <Typography sx={{marginBottom:"-8px", width:"100%"}} level="title-sm">
          Click to counter the claims
        </Typography>
        <div className="claimcards">
        {caseView?.claims?.map((value, index)=>{
          return(
            <Sheet className="sheet" sx={{padding:"10px", fontSize:"12px", borderRadius:"10px"}} variant="outlined">
            <b>{caseView.claims[index]}</b>
            <br/>{caseView.fine[index] ? caseView.fine[index] + " fine" : "No fine."}
            {formData["fine_counter"] && formData["fine_counter"][index] ? " (Counter: " + formData["fine_counter"][index] + ")" : ""}
            <br/>{caseView.relief[index] ? caseView.relief[index] + " relief" : "No relief."}
            {formData["relief_counter"] && formData["relief_counter"][index] ? " (Counter: " + formData["relief_counter"][index] + ")" : ""}  
            <br/>{caseView.suspension[index] ? caseView.suspension[index] + " days suspension" : "No suspension"}
            {formData["suspension_counter"] && formData["suspension_counter"][index] ? " (Counter: " + formData["suspension_counter"][index] + " days)" : ""}
            <div className="sheetdelete" onClick={()=>edit(index)}>Respond</div>
            </Sheet>
          )
        })}
        </div>
        
        <Divider />

        <div className="buttons">
          <Button variant="outlined" sx={{width:"100%"}} onClick={() =>setView("evidence")}>Previous</Button>
          <Button variant="solid" sx={{width:"100%"}} onClick={() =>setView("submission")}>Next</Button>
        </div>
        <LinearProgress determinate value={75} thickness={5} sx={{width:"100%"}} />

        </>
        : view == "submission" ?
        <>
          <Typography level="title-lg" sx={{width:"100%"}}>
            Payment and submission
          </Typography>
          <Typography component="label" sx={{width:"100%"}} >
            If you haven't paid the deposit, then a payment of {caseView?.deposit_for_respondent} will be made. 
          </Typography>
          <div className="buttons">
            <Button variant="outlined" sx={{width:"100%"}} onClick={() =>setView("relief")}>Previous</Button>
            <Button variant="solid" sx={{width:"100%"}} onClick={() =>createResponse()}>Submit response</Button>
          </div>
          <LinearProgress determinate value={95} thickness={5} sx={{width:"100%"}} />

        </>
        :
        <></>
      }
    </Card>

    <Drawer
        size="md"
        variant="plain"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          content: {
            sx: {
              bgcolor: 'transparent',
              p: { md: 3, sm: 0 },
              boxShadow: 'none',
            },
          },
        }}
      >
        <Sheet
          sx={{
            borderRadius: 'md',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            height: '100%',
            overflow: 'auto',
          }}
        >
          <DialogTitle>Dispute Resolution</DialogTitle>
          <ModalClose />
          <DialogContent sx={{ gap: 2 }}>
        <Input
          placeholder="Requested fine amount"
          startDecorator={'EOS'}
          sx={{width:"100%"}}
          onChange={(e, value) => handleCounterChange(e)}
          name="fine_counter"
          value={formData?.fine_counter ? formData?.fine_counter[editingIndex] : ""}

        />
        <Input
          placeholder="Requested relief amount"
          startDecorator={'EOS'}
          sx={{width:"100%"}}
          onChange={(e, value) => handleCounterChange(e)}
          name="relief_counter"
          value={formData?.relief_counter ? formData?.relief_counter[editingIndex] : ""}

        />
        <Input
          placeholder="Requested supension time"
          startDecorator={'Days'}
          sx={{width:"100%"}}
          onChange={(e, value) => handleCounterChange(e)}
          name="suspension_counter"
          value={formData?.suspension_counter ? formData?.suspension_counter[editingIndex] : ""}
        />

        <Button sx={{width:"100%"}} onClick={()=>setOpen(false)}>Counter claim</Button>
          </DialogContent>
        </Sheet>
      </Drawer>
    </>
  );
}
export default RespondCaseView;
