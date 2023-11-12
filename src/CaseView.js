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
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/joy/Tooltip';
import Chip from '@mui/joy/Chip';
import Swal from 'sweetalert2';

function CaseView() {
  const { cases, caseView, accountName, setPage, activeUser, community, setAssistantState, setRefresh, depositData} = useContext(DataContext);
  useEffect(()=>{
    setAssistantState("CASE_VIEW")
  })

  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Calculate difference in days
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return `${diffDays} days ago (${year}/${month}/${day}, ${hours}:${minutes} UTC)`;
  }

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
        Swal.fire({
          title: "Verdict signed!",
          text: "Thank you for signing the verdict. Once all arbitrators have signed it, the case will be closed.",
          showConfirmButton: false,
        });
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


  const rejectToArbitrate = async () =>{
    if (activeUser) {
      try {
        const transaction = {
          actions: [
            {
              account: "drpappdrpapp",
              name: "rejectarbtrn",
              authorization: [
                {
                  actor: accountName, // use account that was logged in
                  permission: "active",
                },
              ],
              data: {
                arbitrator: accountName,
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
          title: "Arbitration rejected!",
          text: "You have rejected the arbitration. Thank you for considering the case.",
          showConfirmButton: false,
        });
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

  const acceptToArbitrate = async () =>{
    if (activeUser) {
      try {
        const transaction = {
          actions: [
            {
              account: "drpappdrpapp",
              name: "acceptarbtrn",
              authorization: [
                {
                  actor: accountName, // use account that was logged in
                  permission: "active",
                },
              ],
              data: {
                arbitrator: accountName,
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
          title: "Arbitration accepted!",
          text: "Thank you for accepting to arbitrate the case.",
          showConfirmButton: false,
        });
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
      <Card>
        <Typography level="title-lg">Case: #{caseView?.number} 
        {caseView?.related_cases && caseView?.related_cases.length > 0 
        ? ` - ${caseView?.case_id}` 
        : null}
        </Typography>
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Claimant and respondent</Typography>
        <Typography level="body-sm">Case from <a href={`https://t.me/${caseView?.claimants_socials?.find((value, index) => value?.key == "telegram")?.value}`} target="_blank">{caseView?.claimant_name}</a> against <a href={`https://t.me/${caseView?.respondents_socials?.find((value, index) => value?.key == "telegram")?.value}`} target="_blank">{caseView?.respondents_account}</a>.</Typography>

        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Case description by claimant</Typography>
        <Typography level="body-sm">{caseView?.case_description ? caseView?.case_description : "No info"}</Typography>
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Case description by respondent</Typography>
        <Typography level="body-sm">{caseView?.respondents_response ? caseView?.respondents_response : "No info"}</Typography>
        
        
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Claimant's deposit</Typography>
        <Typography level="body-sm">{depositData?.find((value, index) => value?.case_id == caseView?.case_id)?.claimants_payment}</Typography>
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Respondent's deposit</Typography>
        <Typography level="body-sm">Deposit paid: {depositData?.find((value, index) => value?.case_id == caseView?.case_id)?.respondents_payment}</Typography>


        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Current case status</Typography>
        <Typography level="body-sm">{caseStages[Number(caseView?.stage)]}</Typography>

        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Claims</Typography>

        <div class="claimCardWrapper">
        {
          caseView?.claims?.map((value, index)=>{
            return(
              <Card className="claimCard">
                <Typography level="title-sm">{value}</Typography>
                <Typography level="body-sm" sx={{lineHeight:"12px"}}>{caseView?.fine[index]} fine</Typography>
                <Typography level="body-sm" sx={{lineHeight:"12px"}}>{caseView?.relief[index]} relief</Typography>
                <Typography level="body-sm" sx={{lineHeight:"12px"}}>{caseView?.suspension[index]} day suspension</Typography>
              </Card>
            )
          })
        }
        </div>
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Ban</Typography>
        <Typography level="body-sm" sx={{lineHeight:"12px"}}>{caseView?.ban == 0 ? "No ban requested" : "Ban requested"}</Typography>


        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Claimant's evidence</Typography>
        {caseView?.claimants_ipfs_cids.length > 0 ? 
        caseView?.claimants_ipfs_cids?.map((value, index) => {
        return (
          <Tooltip title={"IPFS CID: " + value} variant="outlined" sx={{fontSize:"13px"}}>
          <Chip variant="outlined">
            <a href={`https://gateway.pinata.cloud/ipfs/${value}`} style={{textDecoration:"none"}} target="_blank">
              Proof link {index + 1}
            </a>
          </Chip>
          </Tooltip>
        );
      })
      :
      <Typography level="body-sm">No info</Typography>
      }
      <Typography sx={{marginBottom:"-8px"}} level="title-sm">Claimant's evidence description</Typography>
      <Typography sx={{marginBottom:"-8px"}} level="body-sm">{caseView?.claimants_evidence_description ? caseView?.claimants_evidence_description : "No info"}</Typography>

      <Typography sx={{marginBottom:"-8px"}} level="title-sm">Respondent's evidence</Typography>
      {caseView?.respondents_ipfs_cids.length > 0 ? 
        caseView?.respondents_ipfs_cids?.map((value, index) => {
        return (
          <Tooltip title={"IPFS CID: " + value} variant="outlined" sx={{fontSize:"13px"}}>
          <Chip variant="outlined">
            <a href={`https://gateway.pinata.cloud/ipfs/${value}`} style={{textDecoration:"none"}} target="_blank">
              Proof link {index + 1}
            </a>
          </Chip>
          </Tooltip>
        );
      })
      :
      <Typography level="body-sm">No info</Typography>
      }
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Respondent's evidence description</Typography>
        <Typography sx={{marginBottom:"-8px"}} level="body-sm">{caseView?.respondents_evidents_description ? caseView?.respondents_evidents_description : "No info"}</Typography>
        
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Case start time</Typography>
        <Typography sx={{marginBottom:"-8px"}} level="body-sm">{formatDate(caseView?.case_start_time)}</Typography>
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Assigned arbitrators</Typography>
        <Typography level="body-sm">
          {caseView?.arbitrators?.map((value, index) => {
            return (
              <div key={value?.key + value?.value}>
                <a href={`https://t.me/${"consortiumdac"}`} target="_blank" rel="noopener noreferrer">{value?.key}</a> 
                {value?.value === 1 ? " (accepted)" : " (waiting)"}
                {index === 0 ? <span> - lead arbitrator </span> : null}
              </div>
            );
          })}
        </Typography>

        {caseView?.stage == 5 || caseView?.stage == 6 ?
        <>
          <Typography sx={{marginBottom:"-8px"}} level="title-sm">Verdict {caseView?.stage == 6 ? " (signed)" : "(not signed yet)"}</Typography>
          <div class="claimCardWrapper">
          <Card className="claimCard">
                <Typography level="body-sm" sx={{lineHeight:"12px"}}>{caseView?.fine_verdict[0]} fine</Typography>
                <Typography level="body-sm" sx={{lineHeight:"12px"}}>{caseView?.relief_verdict[0]} relief</Typography>
                <Typography level="body-sm" sx={{lineHeight:"12px"}}>{caseView?.suspension_verdict[0]} day suspension</Typography>
          </Card>
          </div>
        </>
        :
        null
        }

        <Divider />
        {/*{caseView?.arbitrators?.find((value, index)=> value?.key == accountName && value?.value == 1) ? <Button onClick={()=>setPage("ARBITRATE")}>Arbitration</Button> : null}*/}
        {caseView?.arbitrators?.find((value, index)=> value?.key == accountName && value?.value == 0) && caseView?.stage == 1 ? <Button onClick={()=> acceptToArbitrate()}>Accept to arbitrate</Button> : null}
        {caseView?.arbitrators?.find((value, index)=> value?.key == accountName && value?.value == 0) && caseView?.stage == 1 ? <Button onClick={()=> rejectToArbitrate()}>Reject to arbitrate</Button> : null}
        {caseView?.arbitrators?.find((value, index)=> value?.key == accountName) && caseView?.stage == 5? <Button onClick={()=>signVerdict()}>Sign Verdict</Button> : null}

        {caseView?.arbitrators[0]?.key == accountName && caseView?.stage == 4 ? <Button key={Number(caseView?.stage) + 3} onClick={()=> setPage("GIVE_VERDICT")}>Give verdict</Button> : null}
       
        {(caseView?.claimant_name  == accountName && caseView?.stage !== 6) ? <Button onClick={()=>setPage("ADD_EVIDENCE")}>Add evidence</Button> : null}

        {(caseView?.respondents_account == accountName && caseView?.stage == 2) ? <Button key={caseView?.stage} onClick={()=>setPage("ACKNOWLEDGE_CASE")}>Acknowledge case</Button> : null}
        {(caseView?.respondents_account == accountName && caseView?.stage == 3) ? 
        <div className="buttons" key={Number(caseView?.stage) +1}>
          <Button sx={{width:"100%"}} onClick={()=>setPage("RESPOND_CASE")}>Respond</Button>
          <Button sx={{width:"100%"}} onClick={()=>setPage("ACCEPT_CASE")}>Accept accusations</Button>
        </div>
        : null}

        </Card>
    </div>
    </>
  );
}
export default CaseView;
