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
import FileUpload from './FileUpload';
import { DataContext } from './DataContext';
import { useContext } from 'react';
import sweetalert from './alert';
import Swal from 'sweetalert2';

function AcceptCaseView() {
  const { cases, caseView, accountName, setPage, activeUser, community, endpoint, depositData, refresh, setRefresh} = useContext(DataContext);
  const [formData, setFormData] = useState({
    paynow: false
  });

  const acknowledgeCase = async () =>{
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
          const transaction = {
            actions: [
              {
                account: "drpappdrpapp",
                name: "acknwdgcase",
                authorization: [
                  {
                    actor: accountName, // use account that was logged in
                    permission: "active",
                  },
                ],
                data: {
                  respondent: accountName,
                  case_id: caseView?.case_id,
                  community: community
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
            title: "Case acknowledged!",
            text: "Thank you for acknowledging the case. You have 7 days to submit a response. Response can be submitted from the case page.",
            showConfirmButton: false,
          });
          setTimeout(()=>{
            setRefresh((prevRefresh) => prevRefresh + 1)
          }, 5000)
          setPage("CASE_VIEW")
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
    <Typography level="title-lg" sx={{width:"100%"}}>Acknowledge the case</Typography>
    <Typography level="body-sm" sx={{width:"100%"}}>
      Once you acknowledge the case, you will have 7 days to submit a response.
    </Typography>
    <Button sx={{width:"100%"}} onClick={()=>acknowledgeCase()}>Acknowledge Case</Button>
    </Card>
    </>
  );
}
export default AcceptCaseView;
