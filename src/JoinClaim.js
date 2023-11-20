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
import sweetalert from './alert';
import Swal from 'sweetalert2';

function JoinClaim() {
  const { cases, caseView, accountName, setPage, activeUser, community, drpappconfig, communityconfig, endpoint, setRefresh} = useContext(DataContext);

  const [view, setView] = useState("claim")
  const [formData, setFormData] = useState({
    claims: [],
    banselected: false,
    description: "",
    ipfsProof: [],
    banselected:false,
    deposit_for_respondent: Number(drpappconfig?.min_deposit.split(" ")[0]),
    depositamount: Number(drpappconfig?.min_deposit.split(" ")[0]),
    case_description: "",
    fine:[],
    relief:[],
    suspension:[],
    claimants_telegram:"",
    respondents_telegram:"",
    respondents_account:"",
    other_info:"",
    terms:false,
    evidenceDescription: ""
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
        ...prevState,
        [name]: value
    }));
  };

  useEffect(()=>{
    console.log(formData)
  },[formData])

  const createCase = async () =>{

    console.log("DEPAM" + formData?.depositamount)
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
      deposittopay = (Number(formData?.depositamount) * Number(data?.rows[0]?.price1_last)).toFixed(4)
      console.log("DEPTOPAY" + deposittopay)
    }
    catch(error){
      console.log(error)
    }

    const handleFormatNumber = (inputNumber) => {
      // Format the number to have 4 decimal places
      const formatted = parseFloat(inputNumber).toFixed(4) + " EOS";
      console.log(formatted)
      return formatted
    };

    console.log(              {
      from: accountName,
      to: "drpappdrpapp",
      quantity: "1.0000 EOS",
      memo: '5555,' + community
    })
    console.log(caseView)

    console.log(              {
      community: community,
      claimant_name: accountName,
      case_id: formData?.case_id,
      nr_of_requested_arbitrators: 3,
      case_description: formData?.description,
      claims: formData?.claims.map(item => item.claimtype),
      fine: formData?.claims.map(item => handleFormatNumber(item.fine)),
      relief: formData?.claims.map(item => handleFormatNumber(item.relief)),
      suspension: formData?.claims.map(item => Number(item.suspension)),
      request_ban: formData?.banselected,
      claimants_evidence_description: formData?.evidenceDescription,
      claimants_ipfs_cids: formData?.ipfsProof,
      claimants_socials:[{key:"telegram", value:formData?.claimants_telegram}],
      respondents_socials:[{key:"telegram", value:formData?.respondents_telegram}],
      other_info_about_respondent:formData?.other_info
    })
    if (activeUser) {
      
      try {
        const transaction = {
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
                quantity: (Number(deposittopay) + 0.0010).toFixed(4) + " EOS",
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
                quantity: Number(formData?.depositamount).toFixed(4) + " USDT",
                memo: '5555,' + community
              },
            },
            {
              account: "drpappdrpapp",
              name: "joincase",
              authorization: [
                {
                  actor: accountName,
                  permission: "active",
                },
              ],
              data:
              {
                community: community,
                claimant_name: accountName,
                case_id: formData?.case_id,
                nr_of_requested_arbitrators: 3,
                case_description: formData?.description,
                claims: formData?.claims.map(item => item.claimtype),
                fine: formData?.claims.map(item => handleFormatNumber(item.fine)),
                relief: formData?.claims.map(item => handleFormatNumber(item.relief)),
                suspension: formData?.claims.map(item => Number(item.suspension)),
                request_ban: formData?.banselected,
                claimants_evidence_description: formData?.evidenceDescription,
                claimants_ipfs_cids: formData?.ipfsProof,
                claimants_socials:[{key:"telegram", value:formData?.claimants_telegram}],
                respondents_socials:[{key:"telegram", value:formData?.respondents_telegram}],
                other_info_about_respondent:formData?.other_info
              },
            }
          ],
        };
        await activeUser.signTransaction(transaction, {
          expireSeconds: 300,
          blocksBehind: 3,
          broadcast: true,
        });
        Swal.fire({
          title: "You have joined the case!",
          text: "You have joined the case. Arbitrators will now accept or reject your case.",
          showConfirmButton: false,
        });
        setTimeout(()=>{
          setRefresh((prevRefresh) => prevRefresh + 1)
        }, 3000)
        setPage("ALL_CASES")
       } catch (error) {
        sweetalert(error.message)
      }
    } else {
      sweetalert("Please log in.")
    }
  }

  const addNewClaim = () => {
    if(formData.newClaimType && formData.newFine && formData.newRelief && formData.newSuspension){
    // Create a new claim object from the temporary formData fields
    const newClaim = {
        claimtype: formData.newClaimType,
        fine: formData.newFine,
        relief: formData.newRelief,
        suspension: formData.newSuspension,
    };

    // Add the new claim to the claims array and reset the temporary fields
    setFormData(prevState => ({
        ...prevState,
        claims: [...prevState.claims, newClaim],
        newClaimType: "",
        newFine: "",
        newRelief: "",
        newSuspension: ""
    }));
    }
    else{
      sweetalert("Please fill all fields for the claim.")
    }
}

  const updateClaim = (index, field, value) => {
    const updatedClaims = [...formData.claims];
    updatedClaims[index][field] = value;
    setFormData(prevState => ({ ...prevState, claims: updatedClaims }));
  };

  const removeClaim = (index) => {
    const updatedClaims = [...formData.claims];
    updatedClaims.splice(index, 1);
    setFormData(prevState => ({ ...prevState, claims: updatedClaims }));
  };



  return (
    <>
    <div className="contentCard">
    <Card>
      {view == "claim" ?
      <>
        <Typography level="title-lg" sx={{width:"100%"}}>
          Case details
        </Typography>
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Select case to join</Typography>
        <Select
          value={formData?.case_id}
          onChange={(e, value) => {
            setFormData({ ...formData, case_id: value });
          }}           
          placeholder="Claim to join"
        >
          {cases.map((value, index) =>{
            return(<Option value={value.case_id}>{value.case_id} - {value?.claimant_name } claim against {value?.respondents_account}</Option>)
          })}
        </Select>
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Describe your case</Typography>

        <Textarea 
            name="description"
            placeholder="Provide background, describe events, explain reasoning, and outline claim details..." 
            minRows={5} 
            sx={{width:"100%"}} 
            value={formData.description} 
            onChange={handleInputChange} 
        />

        <Divider />

        <div className="buttons"><Button variant="solid" sx={{width:"100%"}} onClick={() =>setView("relief")}>Next</Button></div>
        <LinearProgress determinate value={5} thickness={5} sx={{width:"100%"}} />

        </>
        : view == "relief" ?
        <>

        <Typography level="title-lg" sx={{width:"100%"}}>
          Add your claims
        </Typography>
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Claim details</Typography>
        <div className="claimcards">
          {formData.claims.map((claim, index) => (
            <Sheet className="sheet" sx={{padding:"10px", fontSize:"12px", borderRadius:"10px"}} variant="outlined">
              <b>{claim.claimtype}</b>
              <br/>{claim.fine ? claim.fine + " EOS fine" : "No fine."}
              <br/>{claim.relief ? claim.relief + " EOS relief" : "No relief."}
              <br/>{claim.suspension ? claim.suspension + " days suspension" : "No suspension"} 
              <div className="sheetdelete" onClick={() => removeClaim(index)}>Remove</div>
            </Sheet>
          ))}
        </div>
        <Select 
          value={formData.newClaimType} 
          placeholder="Claim type..." 
          sx={{width:"100%"}} 
          onChange={(e, value) => {
            setFormData({ ...formData, newClaimType: value });
        }} 
        >
          {communityconfig?.rec_num_of_arb_and_claim_type?.map((claimtype) => (
            <Option value={claimtype?.key}>{claimtype?.key}</Option>
          ))}
          {/*<Option value="Execution of Unexecuted Case">Execution of Unexecuted Case</Option>
          <Option value="Harm or Injury">Harm or Injury</Option>
          <Option value="Arbitrator Wrongful Action">Arbitrator Wrongful Action</Option>
          <Option value="Failure to Deliver Project">Failure to Deliver Project</Option>
          <Option value="Breach of Bylaws">Breach of Bylaws</Option>
      <Option value="Miscellaneous">Miscellaneous</Option>*/}
        </Select>
        <Input 
            type="number"
            placeholder="Requested fine amount"
            startDecorator={'EOS'}
            sx={{width:"100%"}}
            onChange={(e) => setFormData({ ...formData, newFine: e.target.value })}
            value={formData.newFine}
        />
        <Input
            type="number" 
            placeholder="Requested relief amount"
            startDecorator={'EOS'}
            sx={{width:"100%"}}
            onChange={(e) => setFormData({ ...formData, newRelief: e.target.value })}
            value={formData.newRelief}
        />
        <Input 
            type="number"
            placeholder="Requested suspension time"
            startDecorator={'Days'}
            sx={{width:"100%"}}
            onChange={(e) => setFormData({ ...formData, newSuspension: e.target.value })}
            value={formData.newSuspension}
        />
        <Button onClick={addNewClaim} sx={{width:"100%"}}>Add Claim</Button>

        <Divider />
        <Typography component="label" sx={{width:"100%"}} endDecorator={<Switch checked={formData?.banselected} name="banselected" sx={{ ml: 1 }} onChange={(e) => setFormData(prevState => ({ ...prevState, banselected: !formData.banselected }))}/>}>
          Request a ban: 
        </Typography>
        

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
        <Input 
            name="claimants_telegram"
            placeholder="Your telegram" 
            sx={{width:"100%"}} 
            value={formData.claimants_telegram} 
            onChange={handleInputChange} 
        />
        <Input 
            name="respondents_telegram"
            placeholder="Respondent's telegram (if available)" 
            sx={{width:"100%"}} 
            value={formData.respondents_telegram} 
            onChange={handleInputChange} 
        />
        <Input 
            name="other_info"
            placeholder="Other info for contacting respondent" 
            sx={{width:"100%"}} 
            value={formData.other_info} 
            onChange={handleInputChange} 
        />
        <Divider />

        <div className="buttons">
          <Button variant="outlined" sx={{width:"100%"}} onClick={() =>setView("relief")}>Previous</Button>
          <Button variant="solid" sx={{width:"100%"}} onClick={() =>setView("evidence")}>Next</Button>
        </div>
        <LinearProgress determinate value={60} thickness={5} sx={{width:"100%"}} />

        </>
        : view == "evidence" ?
        <>
        <Typography level="title-lg" sx={{width:"100%"}}>
          Upload proof
        </Typography>
        <Textarea 
              placeholder="Evidence description"
              sx={{width:"100%"}}
              minRows={3} 
              onChange={handleInputChange} 
              value={formData?.evidenceDescription}
              name="evidenceDescription"

        />
        <FileUpload setFormData={setFormData} formData={formData} setView={setView}/>
        <LinearProgress determinate value={75} thickness={5} sx={{width:"100%"}} />

        </>
        : view == "payment" ?
        <>
        <Typography level="title-lg" sx={{width:"100%"}}>
          Summary and payment
        </Typography>
        <div className="claimcards">
          {formData.claims.map((claim, index) => (
            <Sheet className="sheet" sx={{padding:"10px", fontSize:"12px", borderRadius:"10px"}} variant="outlined">
              <b>{claim.claimtype}</b>
              <br/>{claim.fine ? claim.fine + " EOS fine" : "No fine."}
              <br/>{claim.relief ? claim.relief + " EOS relief" : "No relief."}
              <br/>{claim.suspension ? claim.suspension + " days suspension" : "No suspension"} 
            </Sheet>
          ))}
        </div>
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Deposit for you (minimum {drpappconfig?.min_deposit})</Typography>
        <Input 
            type="number"
            placeholder="Deposit amount"
            startDecorator={'USDT'}
            sx={{width:"100%"}}
            name="depositamount"
            onChange={(e) => setFormData({ ...formData, depositamount: e.target.value })}
            value={formData.depositamount}
        />
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Deposit for respondent (minimum {drpappconfig?.min_deposit})</Typography>
        <Input 
            type="number"
            placeholder="Deposit for respondent"
            startDecorator={'USDT'}
            sx={{width:"100%"}}
            name="deposit_for_respondent"
            onChange={(e) => setFormData({ ...formData, deposit_for_respondent: e.target.value })}
            value={formData.deposit_for_respondent}
        />
        <Typography component="label" sx={{width:"100%"}} endDecorator={<Switch checked={formData?.terms} name="terms" sx={{ ml: 1 }} onChange={(e) => setFormData(prevState => ({ ...prevState, terms: !formData.terms }))}/>}>
          I agree to terms and conditions:
        </Typography>
        <div className="buttons">
          <Button variant="outlined" sx={{width:"100%"}} onClick={() =>setView("evidence")}>Previous</Button>
          <Button variant="solid" sx={{width:"100%"}} onClick={() =>createCase()}>Submit case</Button>
        </div>
        <LinearProgress determinate value={90} thickness={5} sx={{width:"100%"}} />
        </>
        :
        <></>
    }
    </Card>
    </div>
    </>
  );
}
export default JoinClaim;
