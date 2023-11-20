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

function BecomeArbitrator() {
  const { cases, caseView, accountName, setPage, activeUser, community} = useContext(DataContext);
  const [formData, setFormData] = useState({
    name: "",
    telegram: ""
  });

  const handleInputChange = (event) => {
      const { name, value } = event.target;
      setFormData(prevState => ({
          ...prevState,
          [name]: value
      }));
  };

  const createCommunity = async () =>{
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
                drpapp_cut: 1
              },
            },
          ],
        };
        await activeUser.signTransaction(transaction, {
          expireSeconds: 300,
          blocksBehind: 3,
          broadcast: true,
        });
        sweetalert("Community created.")
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
        <Typography level="h4">Become arbitrator</Typography>
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Name</Typography>
          <Input 
              disabled
              name="name"
              placeholder="Your full name" 
              sx={{width:"100%"}} 
              value={formData.name}
              onChange={handleInputChange}
          />
          <Typography sx={{marginBottom:"-8px"}} level="title-sm">Telegram</Typography>
          <Input 
              disabled
              name="telegram"
              placeholder="Telegram" 
              sx={{width:"100%"}} 
              value={formData.telegram}
              onChange={handleInputChange}
          />
          <Divider />
          <Button disabled onClick={()=>sweetalert("Write us on telegram for now.")}>Submit application</Button>
          <Typography sx={{width:"100%", textAlign:"center"}} level="title-lg">Please write us on <a target="_blank" href="https://t.me/MoZDS">Telegram</a> to apply.</Typography>
       
      </Card>
    </div>
  );
}
export default BecomeArbitrator;
