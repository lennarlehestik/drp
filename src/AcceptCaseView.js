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

function AcceptCaseView() {
  const { cases, caseView, accountName, setPage, activeUser, community, endpoint, depositData, setRefresh} = useContext(DataContext);

  const acceptCase = async () =>{
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
    if(haspaid){
      if (activeUser) {
        try {
          const transaction = {
            actions: [
              {
                account: "drpappdrpapp",
                name: "acceptaccu",
                authorization: [
                  {
                    actor: accountName,
                    permission: "active",
                  },
                ],
                data:
                {
                  community: community,
                  case_id: caseView?.case_id,
                  respondent_account: accountName,
                },
              },
            ],
          };
          await activeUser.signTransaction(transaction, {
            expireSeconds: 300,
            blocksBehind: 3,
            broadcast: true,
          });
          sweetalert("Accepted accusations.")
          setTimeout(()=>{
            setRefresh((prevRefresh) => prevRefresh + 1)
          }, 3000)
          setPage("CASE_VIEW")
         } catch (error) {
          sweetalert(error.message)
        }
      } else {
        sweetalert("Please log in.")
      }
    }
    else{
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
                  quantity: (Number(deposittopay) + 0.0020).toFixed(4) + " EOS",
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
                name: "acceptaccu",
                authorization: [
                  {
                    actor: accountName,
                    permission: "active",
                  },
                ],
                data:
                {
                  community: community,
                  case_id: caseView?.case_id,
                  respondent_account: accountName,
                },
              },
            ],
          };
          await activeUser.signTransaction(transaction, {
            expireSeconds: 300,
            blocksBehind: 3,
            broadcast: true,
          });
          sweetalert("Accepted accusations.")
          setTimeout(()=>{
            setRefresh((prevRefresh) => prevRefresh + 1)
          }, 3000)
          setPage("CASE_VIEW")
         } catch (error) {
          sweetalert(error.message)
        }
      } else {
        sweetalert("Please log in.")
      }
    }

  }

  return (
    <>
    <Card className="card">
    <Typography level="title-lg" sx={{width:"100%"}}>Accept the accusations</Typography>
    <Typography component="body-sm" sx={{width:"100%"}}>
      If you accept the accusations, the case will be closed and you agree to the claims made against you. If you haven't, then you will also pay the deposit of {caseView?.deposit_for_respondent}.
    </Typography>
    <Button sx={{width:"100%"}} onClick={()=>acceptCase()}>Accept accusations</Button>
    </Card>
    </>
  );
}
export default AcceptCaseView;
