import logo from './logo.svg';
import './App.css';
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import { DataContext } from './DataContext';
import { useContext } from 'react';
import Table from '@mui/joy/Table';
import Button from '@mui/joy/Button';
import {caseStages} from './stages';
import {useEffect} from 'react';
import sweetalert from './alert';

function CaseView() {
  const { cases, caseView, accountName, activeUser, setPage, community, setAssistantState} = useContext(DataContext);
  useEffect(()=>{
    setAssistantState("ARBITRATE")
  })
  const signVerdict = async () =>{
    console.log(             {
      community: community,
      case_id: caseView?.case_id,
      arbitrator: accountName
    })
    if (activeUser) {
      try {
        const transaction = {
          actions: [
            {
              account: "drpappdrpapp",
              name: "signverdict",
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
                arbitrator: accountName
              },
            },
          ],
        };
        await activeUser.signTransaction(transaction, {
          expireSeconds: 300,
          blocksBehind: 3,
          broadcast: true,
        });
        sweetalert("Verdict signed.")
       } catch (error) {
        sweetalert(error.message)
      }
    } else {
      sweetalert("Please log in.")
    }
  }

  return (
    <>
      <Card sx={{width:"50vw"}}>
        <Typography level="title-lg">Arbitrate Case: {caseView?.case_id}</Typography>
        <Typography level="body-sm">Case from {caseView?.claimant_name} against {caseView?.respondents_account}.</Typography>
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Case status</Typography>
        <Typography level="body-sm">{caseStages[caseView?.stage]}</Typography>
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Claimant's deposit</Typography>
        <Typography level="body-sm">{caseView?.claimants_deposit}</Typography>
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Respondent's deposit</Typography>
        <Typography level="body-sm">{caseView?.respondent_deposit}</Typography>
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Claimant's case description</Typography>
        <Typography level="body-sm">{caseView?.case_description}</Typography>
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Respondent's response</Typography>
        <Typography level="body-sm">{caseView?.respondents_response}</Typography>
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Claimant's evidence</Typography>
        <Typography level="body-sm">{caseView?.claimants_evidence_description}</Typography>
        {caseView?.claimants_ipfs_cids?.map((value, index)=>{
          return(<Typography level="body-sm"><a href={`https://gateway.pinata.cloud/ipfs/${value}`} target="_blank">IPFS Link {index + 1}</a></Typography>)
        })}
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Assigned arbitrators</Typography>
        <Typography level="body-sm">{caseView?.arbitrators?.map((value, index)=>{
          return(<div>{value?.key} {value?.value == 1 ? " (accepted)" : " (rejected)"}</div>)
        })}</Typography>
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Claims</Typography>
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
        <Typography level="body-sm" sx={{lineHeight:"12px"}}>{caseView?.ban == 0 ? "No ban requested" : "Ban requested"}</Typography>

        {caseView?.arbitrators?.find((value, index)=> value?.key == accountName && value?.value == 1) && caseView?.stage == 4? <Button onClick={()=>setPage("GIVE_VERDICT")}>Give verdict</Button> : null}
        {caseView?.arbitrators?.find((value, index)=> value?.key == accountName) && caseView?.stage == 5? <Button onClick={()=>signVerdict()}>Sign Verdict</Button> : null}

        {caseView?.arbitrators?.find((value, index)=> value?.key == accountName && value?.value == 0) ? <Button>Accept to arbitrate</Button> : null}
        {caseView?.arbitrators?.find((value, index)=> value?.key == accountName && value?.value == 0) ? <Button>Reject to arbitrate</Button> : null}

        {(caseView?.respondents_account == accountName && caseView?.stage == 2) ? <Button>Accept</Button> : null}
        {(caseView?.respondents_account == accountName && caseView?.stage == 2) ? <Button>Accept</Button> : null}
        </Card>
    </>
  );
}
export default CaseView;
