import logo from './logo.svg';
import './App.css';
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import { DataContext } from './DataContext';
import { useContext, useState } from 'react';
import Table from '@mui/joy/Table';
import Button from '@mui/joy/Button';
import {caseStages} from './stages';
import Input from '@mui/joy/Input';
import Textarea from '@mui/joy/Textarea';
import Divider from '@mui/joy/Divider';
import sweetalert from './alert';
import sweetalertbig from './alertbig';
import Swal from "sweetalert2";

function AddCommunity() {
  const { cases, caseView, accountName, setPage, activeUser, community, setRefresh} = useContext(DataContext);
  const [formData, setFormData] = useState({
    communityContract: "",
    communityName: "",
    communityDescription: "",
    rec_num_of_arb_and_claim_type: [{"key": "", "value": ""}],
    min_arb_per_case: "",
    max_arb_per_case: "",
    min_deposit: "",
    lead_arb_cut: "",
    time_for_arb_to_accept_the_case: "",
    time_for_respondent_to_acknowledge_the_case: "",
    time_for_respondent_to_respond_the_case: ""
  });

  const handleInputChange = (event) => {
      const { name, value } = event.target;
      setFormData(prevState => ({
          ...prevState,
          [name]: value
      }));
  };

  const handleKeyValueChange = (index, type, value) => {
    const updatedKeyValues = [...formData.rec_num_of_arb_and_claim_type];
    updatedKeyValues[index][type] = value;
    setFormData(prevState => ({ ...prevState, rec_num_of_arb_and_claim_type: updatedKeyValues }));
  };

  const addNewKeyValue = () => {
    setFormData(prevState => ({
        ...prevState,
        rec_num_of_arb_and_claim_type: [...prevState.rec_num_of_arb_and_claim_type, { key: "", value: 0 }]
    }));
  };
  
  const createCommunity = async () =>{

    console.log({
      community: formData?.communityContract,
      community_name: formData?.communityName,
      community_description: formData?.communityDescription,
      rec_num_of_arb_and_claim_type: formData?.rec_num_of_arb_and_claim_type,
      min_arb_per_case: Number(formData?.min_arb_per_case),
      max_arb_per_case: Number(formData?.max_arb_per_case),
      min_deposit: Number(formData?.min_deposit).toFixed(4) + " USDT",
      lead_arb_cut: Number(formData?.lead_arb_cut),
      time_for_arb_to_accept_the_case: Number(formData?.time_for_arb_to_accept_the_case),
      time_for_respondent_to_acknowledge_the_case: Number(formData?.time_for_respondent_to_acknowledge_the_case),
      time_for_respondent_to_respond_the_case: Number(formData?.time_for_respondent_to_respond_the_case)
    })
    if (activeUser) {
      try {
        const transaction = {
          actions: [
            {
              account: "drpappdrpapp",
              name: "addcomm",
              authorization: [
                {
                  actor: accountName, // use account that was logged in
                  permission: "active",
                },
              ],
              data:
              {
                community: formData?.communityContract,
                community_name: formData?.communityName,
                community_description: formData?.communityDescription,
                rec_num_of_arb_and_claim_type: formData?.rec_num_of_arb_and_claim_type,
                min_arb_per_case: 1,
                max_arb_per_case: 1,
                min_deposit: "1.0000 USDT",
                lead_arb_cut: 1,
                time_for_arb_to_accept_the_case: 1,
                time_for_respondent_to_acknowledge_the_case: 1,
                time_for_respondent_to_respond_the_case: 1,
                drpapp_cut: 1,
                time_for_arbitrators_to_give_verdict: 1
              },
            },
          ],
        };
        await activeUser.signTransaction(transaction, {
          expireSeconds: 300,
          blocksBehind: 3,
          broadcast: true,
        });
        let message = formData?.communityContract + " community has been created."
        Swal.fire({
          title: "Community created!",
          text: message,
          showConfirmButton: false,
          footer: `<a target="_blank" href="https://daodrp.com/community/${formData?.communityContract}">https://daodrp.com/community/${formData?.communityContract}</a>`
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

  return (
    <div className="contentCard">
      <Card>
        <Typography level="h4">Add new community</Typography>
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Community contract</Typography>
          <Input 
              name="communityContract"
              placeholder="Community contract" 
              sx={{width:"100%"}} 
              value={formData.communityContract}
              onChange={handleInputChange}
          />
          <Typography sx={{marginBottom:"-8px"}} level="title-sm">Community name</Typography>
          <Input 
              name="communityName"
              placeholder="Community name" 
              sx={{width:"100%"}} 
              value={formData.communityName}
              onChange={handleInputChange}
          />
          <Typography sx={{marginBottom:"-8px"}} level="title-sm">Community description</Typography>
          <Textarea
            name="communityDescription" 
            placeholder="Community description." 
            minRows={5} 
            sx={{width:"100%"}}
            value={formData.communityDescription}
            onChange={handleInputChange}
          />
          <Card>
            <Typography sx={{marginBottom:"-8px"}} level="title-sm">Claim types and recommended number of arbitrators</Typography>
            {formData.rec_num_of_arb_and_claim_type.map((pair, index) => (
                <div key={index} class="addClaimType">
                    <Input 
                        placeholder="Claim type" 
                        value={pair.key} 
                        onChange={(e) => handleKeyValueChange(index, 'key', e.target.value)}
                        sx={{width:"100%"}}
                    />
                    <Input 
                        placeholder="Number of recommended arbitrators" 
                        type="number"
                        value={pair.value} 
                        onChange={(e) => handleKeyValueChange(index, 'value', e.target.value)}
                        sx={{width:"100%"}}
                    />
                </div>
            ))}
          <Button onClick={addNewKeyValue} sx={{width:"200px"}}>Add claim type</Button>
          </Card>
          {/*
          <Typography sx={{marginBottom:"-8px"}} level="title-sm">Minimum arbitrators per case</Typography>
          <Input
              type="number"
              name="min_arb_per_case"
              placeholder="Minimum arbitrators per case" 
              sx={{width:"100%"}} 
              value={formData.min_arb_per_case}
              onChange={handleInputChange}
          />
          <Typography sx={{marginBottom:"-8px"}} level="title-sm">Maximum arbitrators per case</Typography>
          <Input
              type="number"
              name="max_arb_per_case"
              placeholder="Maximum arbitrators per case" 
              sx={{width:"100%"}} 
              value={formData.max_arb_per_case}
              onChange={handleInputChange}
          />
          <Typography sx={{marginBottom:"-8px"}} level="title-sm">Minimum deposit</Typography>
          <Input
              type="number"
              name="min_deposit"
              startDecorator={'USDT'}
              placeholder="Minimum deposit" 
              sx={{width:"100%"}} 
              value={formData.min_deposit}
              onChange={handleInputChange}
          />
          <Typography sx={{marginBottom:"-8px"}} level="title-sm">Lead arbitrator cut</Typography>
          <Input
              type="number"
              name="lead_arb_cut"
              placeholder="Lead arbitrator cut" 
              sx={{width:"100%"}} 
              value={formData.lead_arb_cut}
              onChange={handleInputChange}
          />
          <Typography sx={{marginBottom:"-8px"}} level="title-sm">Time for arbitrator to accept the case</Typography>
          <Input
              type="number"
              name="time_for_arb_to_accept_the_case"
              placeholder="Days for arbitrator to accept the case" 
              sx={{width:"100%"}} 
              value={formData.time_for_arb_to_accept_the_case}
              onChange={handleInputChange}
          />
          <Typography sx={{marginBottom:"-8px"}} level="title-sm">Time for respondent to acknowledge the case</Typography>
          <Input
              type="number"
              name="time_for_respondent_to_acknowledge_the_case"
              placeholder="Days for respondent to acknowledge the case" 
              sx={{width:"100%"}} 
              value={formData.time_for_respondent_to_acknowledge_the_case}
              onChange={handleInputChange}
          />
          <Typography sx={{marginBottom:"-8px"}} level="title-sm">Time for respondent to respond the case</Typography>
          <Input
              type="number"
              name="time_for_respondent_to_respond_the_case"
              placeholder="Days for respondent to respond the case" 
              sx={{width:"100%"}} 
              value={formData.time_for_respondent_to_respond_the_case}
              onChange={handleInputChange}
          />*/}

          <Divider />
          <Button onClick={()=>createCommunity()}>Create community</Button>
       
      </Card>
    </div>
  );
}
export default AddCommunity;
