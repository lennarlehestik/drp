import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react';
import { DataContext } from './DataContext';
import { useContext } from 'react';
import Button from '@mui/joy/Button';

import Cases from './Cases';
import DrawerFilters from './Drawer';

import AddClaim from './AddClaim';
import AllCases from './AllCases';
import Assistant from './Assistant';
import CaseView from './CaseView';
import PickCommunity from './PickCommunity';
import ArbitrateView from './ArbitrateView';
import RespondCaseView from './RespondCaseView';
import AddCommunity from './AddCommunity';
import GiveVerdict from './GiveVerdict';
import AcceptCaseView from './AcceptCaseView';
import Landing from './Landing';
import { withUAL } from "ual-reactjs-renderer";
import JoinClaim from './JoinClaim';
import sweetalert from './alert';
import BecomeArbitrator from './BecomeArbitrator';
import sweetalertbig from './alertbig';
import AcknowledgeCaseView from './AcknowledgeCaseView';
import AddEvidence from './AddEvidence';

function App(props) {
  const {
    ual: { activeUser, showModal, logout }
  } = props;


  const extractCommunityFromUrl = () => {
    const pathMatch = window.location.pathname.match(/\/community\/([^\/]+)/); // Adjusted to stop at the next slash
    return pathMatch ? pathMatch[1] : "consortiumlv";
  };

  // Set the initial state based on the URL
  const [community, setCommunity] = useState(extractCommunityFromUrl());

  const [page, setPage] = useState("ALL_CASES")
  const [cases, setCases] = useState([])
  const [communities, setCommunities] = useState()
  const [drpappconfig, setDrpappconfig] = useState()
  const [depositData, setDepositData] = useState()
  const [communityconfig, setCommunityconfig] = useState()
  const [isAuthLoading, setIsAuthLoading] = useState(true); // Add this state
  const [arbitrators, setArbitrators] = useState()
  const [refresh, setRefresh] = useState(0)

  const [caseView, setCaseView] = useState("") //for tracking what to show in case view
  const [accountName, setAccountName] = useState("");
  const [assistantState, setAssistantState] = useState("ALL_CASES")

  const endpoint = "https://eos.eosusa.io"

  useEffect(() => {
    // Add a delay to wait for activeUser to be resolved.
    const timeoutId = setTimeout(() => {
      setIsAuthLoading(false);
    }, 1000); // Adjust the delay as needed
  
    if (activeUser) {
      console.log(activeUser)
      activeUser.getAccountName().then((result) => {
        console.log(result)
        setAccountName(result);
        clearTimeout(timeoutId); // Clear the timeout if activeUser is found
        setIsAuthLoading(false);
      });
    }
  
    // Cleanup timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, [activeUser]);

  const logoutUser = async () => {
    try {
      await logout();
      setAccountName(""); // Clear the account name after logout
      } catch (error) {
      console.error("Logout error", error.message);
    }
  };

  useEffect(() => {
    console.log("USEEFECT TRIGGERED!")
      const fetchData = async () => {
        console.log(community)
        try {
          // URL to EOSIO node
          const url = `${endpoint}/v1/chain/get_table_rows`;
          // Fetch data from EOSIO node
          const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
              json: true,
              code: "drpappdrpapp",
              table: "casestbbb",
              scope: community,
              limit:1000
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          // If response is not ok, throw an error
          if (!response.ok) {
            throw Error('Network response was not ok' + response.statusText);
          }

          function appendRelatedCaseIds(cases) {
            // First, group all case_ids by their number
            const casesByNumber = cases.reduce((acc, currentCase) => {
              const { number, case_id } = currentCase;
              if (!acc[number]) {
                acc[number] = [];
              }
              acc[number].push(case_id);
              return acc;
            }, {});
          
            // Then, append the related case_ids to each case
            return cases.map((caseItem) => {
              const related = casesByNumber[caseItem.number].filter(id => id !== caseItem.case_id);
              return {
                ...caseItem,
                related_cases: related.length > 0 ? related : null,
              };
            });
          }
          
  
          // Parse JSON data
          const data = await response.json();
          console.log(data)
          const updatedCasesData = appendRelatedCaseIds(data?.rows);

          setCases([...updatedCasesData])
          if(caseView){
            setCaseView(updatedCasesData.find((item) => item.case_id == caseView.case_id))
          }
        }
        catch(error){
          console.log(error)
        }

        try {
          // URL to EOSIO node
          const url = `${endpoint}/v1/chain/get_table_rows`;
          // Fetch data from EOSIO node
          const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
              json: true,
              code: "drpappdrpapp",
              table: "arbitrators",
              scope: "drpappdrpapp",
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
          console.log(data)
          setArbitrators(data?.rows)
        }
        catch(error){
          console.log(error)
        }

        try {
          // URL to EOSIO node
          const url = `${endpoint}/v1/chain/get_table_rows`;
          // Fetch data from EOSIO node
          const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
              json: true,
              code: "drpappdrpapp",
              table: "configtbb",
              scope: "drpappdrpapp",
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
          console.log(data)
          let drpappdata = data?.rows?.find((item) => item.community  == "drpappdrpapp")
          setDrpappconfig(drpappdata)
        }
        catch(error){
          console.log(error)
        }

        try {
          // URL to EOSIO node
          const url = `${endpoint}/v1/chain/get_table_rows`;
          // Fetch data from EOSIO node
          const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
              json: true,
              code: "drpappdrpapp",
              table: "deposit",
              scope: community,
              limit:1000
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
          console.log(data)
          setDepositData([...data?.rows])
        }
        catch(error){
          console.log(error)
        }

        
        try {
          // URL to EOSIO node
          const url = `${endpoint}/v1/chain/get_table_rows`;
          // Fetch data from EOSIO node
          const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
              json: true,
              code: "drpappdrpapp",
              table: "configtbb",
              scope: "drpappdrpapp",
              lower_bound: community,
              upper_bound: community
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
          console.log(data)
          setCommunityconfig(data?.rows[0])
        }
        catch(error){
          console.log(error)
        }
      }
      fetchData()
  },[community, refresh])


  useEffect(() => {
    const fetchData = async () => {
      try {
        // URL to EOSIO node
        const url = `${endpoint}/v1/chain/get_table_rows`;
        // Fetch data from EOSIO node
        const response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({
            json: true,
            code: "drpappdrpapp",
            table: "commstb",
            scope: "drpappdrpapp",
            limit:1000
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
        console.log(data)
        setCommunities([...data?.rows])
      }
      catch(error){
        console.log(error)
      }
    }
    fetchData()
},[])

  return (
    <>
  <DataContext.Provider value={{ cases, setCases, page, setPage, caseView, setCaseView, accountName, activeUser, logoutUser, community, setCommunity, assistantState, setAssistantState, communities, showModal, drpappconfig, communityconfig, arbitrators, setRefresh, sweetalertbig, depositData, endpoint}}>
  {isAuthLoading ? (
        <div className="App">
          <span class="loader"></span>

        </div> // Show a loader or keep it blank
      ) : accountName ? (
      <div className="App">
      <Assistant />
      <div className = "navigation">
      <Button color="neutral" className="allCases" variant="outlined" onClick={() => setPage("ALL_CASES")}>All Cases</Button>
      <PickCommunity />
      <Cases />
      <DrawerFilters/>
      </div>
      {page =="ALL_CASES" ?
        <AllCases/>
      : page =="ADD_CLAIM" ?
        <AddClaim />
      : page =="CASE_VIEW" ?
        <CaseView />
      :
      page =="ARBITRATE" ?
        <ArbitrateView />
      :
      page =="RESPOND_CASE" ?
      <RespondCaseView />
      :
      page =="ADD_COMMUNITY" ?
      <AddCommunity />
      :
      page =="GIVE_VERDICT" ?
      <GiveVerdict />
      :
      page =="ACCEPT_CASE" ?
      <AcceptCaseView />
      :
      page =="ACKNOWLEDGE_CASE" ?
      <AcknowledgeCaseView />
      :
      page =="ADD_EVIDENCE" ?
      <AddEvidence />
      :
      page =="JOIN_CLAIM" ?
      <JoinClaim />
      :
      page =="BECOME_ARBITRATOR" ?
      <BecomeArbitrator />
      :
        <></>
      }
      </div>
      )
    :
    <div className="App">
      <Landing />
    </div>
  }
  
      </DataContext.Provider>
  </>
  
  );
}
export default withUAL(App);
