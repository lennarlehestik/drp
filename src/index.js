import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UALProvider } from 'ual-reactjs-renderer'
import { Anchor } from 'ual-anchor'

const appName = "DRP";

const chain = {
  chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
  rpcEndpoints: [
    {
      protocol: "https",
      host: "eos.eosusa.io",
      port: "",
    },
  ],
};

const anchor = new Anchor([chain], {
  appName,
});

const supportedChains = [chain];
const supportedAuthenticators = [
  anchor
];


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UALProvider
      chains={supportedChains}
      authenticators={supportedAuthenticators}
      appName={appName}
    >
      <App />
    </UALProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
