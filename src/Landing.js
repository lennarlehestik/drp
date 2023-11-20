import './Landing.css';
import { DataContext } from './DataContext';
import { useContext } from 'react';
import Button from '@mui/joy/Button';

function Cases() {
  const { showModal} = useContext(DataContext);

  return (
    <div className="landing">
        <div className="links">
            <div className="navHeading">DisputeResolution</div>
            <div className="navItem">Upscale</div>
            <div className="navItem">Telegram</div>
            <div className="navItem">Become arbitrator</div>
            <button className="loginButton navbarLoginButton" onClick={()=>showModal()}><img src="/eosfilledlogowhite.png" width="24px" style={{marginRight:"7px"}}/><span>Login</span></button>
        </div>
        <div className="leftSide">
            <div className="sponsor">
                <div className="sponsorLogo">
                    <img src="/eosfilledlogo.png" style={{opacity:0.7}} width="32px"></img>
                </div>
                <div className="sponsorName">
                    <div className="broughtBy">Built by</div>
                    <div className="upscale">Upscale on Antelope</div>
                </div>
            </div>
            <div className="heading">Dispute Resolution Process</div>
            <div className="explainer">DRP is a governance tool to resolve disputes amongst members of <span className="textHighlight">any community on Antelope network</span>.</div>
            <button className="loginButton" onClick={()=>showModal()}><span>Open app</span></button>
            </div>
        <div className="rightSide">
        <iframe className="demo" src="https://www.youtube.com/embed/eEzD-Y97ges" title="Placeholder Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
    </div>
  );
}
export default Cases;
