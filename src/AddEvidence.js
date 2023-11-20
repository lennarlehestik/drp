import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import CircularProgress from '@mui/joy/CircularProgress';
import ChipDelete from '@mui/joy/ChipDelete';
import Tooltip from '@mui/joy/Tooltip';
import Textarea from '@mui/joy/Textarea';
import Card from '@mui/joy/Card';
import { useEffect } from 'react';
import { DataContext } from './DataContext';
import { useContext } from 'react';
import sweetalert from './alert';
import Swal from 'sweetalert2';

const FileUpload = () => {
  const { cases, caseView, accountName, setPage, activeUser, community, setRefresh} = useContext(DataContext);

  const [logo, setLogo] = useState(null);
  const [ipfsLinks, setIpfsLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ipfsProof: caseView?.claimants_ipfs_cids,
    description: caseView?.claimants_evidence_description
  });



  const addEvidence = async () =>{
    if (activeUser) {
      try {
        const transaction = {
          actions: [
            {
              account: "drpappdrpapp",
              name: "addevidence",
              authorization: [
                {
                  actor: accountName, // use account that was logged in
                  permission: "active",
                },
              ],
              data: {
                case_id: caseView?.case_id,
                community: community,
                claimant: accountName,
                claimants_evidence_desc:formData?.description,
                claimants_ipfs_cids: formData?.ipfsProof
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
          title: "Evidence added!",
          text: "You have added evidence to the case.",
          showConfirmButton: false,
        });
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

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles[0]) {
      setLogo(acceptedFiles[0]);
      handleUpload(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = async (logo) => {
    // Create a new FormData object
    const formData = new FormData();
    formData.append('file', logo); // 'file' is the field name you want to use on the server side
    setLoading(true)

    try {
      const response = await fetch('https://agile-sierra-38696-5c44791b86b1.herokuapp.com/upload', {
        method: 'POST',
        body: formData, // Send the FormData object as the request body
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setLoading(false)
      console.log(data)
      setIpfsLinks(links => [...links, data?.IpfsHash])
      setFormData(prevState => ({ ...prevState, ipfsProof: [...prevState.ipfsProof, data?.IpfsHash] }));

      // You might want to use the response data, for example:
      // setLogourl(data.url);
    } catch (error) {
      console.log(error);
    }
  };

  const removeLink = (index) => {
    setIpfsLinks(links => links.filter((value, i) => i !== index));
    
    setFormData(prevState => ({
        ...prevState,
        ipfsProof: prevState.ipfsProof.filter((value, i) => i !== index)
    }));
};

const handleInputChange = (event) => {
  const { name, value } = event.target;
  setFormData(prevState => ({
      ...prevState,
      [name]: value
  }));
};


  return (
    <div className="contentCard">
    <Card>
        <Typography level="title-lg" sx={{width:"100%"}}>
          Add evidence to case
        </Typography>
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Evidence description</Typography>
        <Textarea 
            name="description"
            placeholder="Provide background, describe events, explain reasoning, and outline claim details..." 
            minRows={5} 
            sx={{width:"100%"}} 
            value={formData.description} 
            onChange={handleInputChange} 
        />
        <Typography sx={{marginBottom:"-8px"}} level="title-sm">Evidence</Typography>
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'drag-active' : ''}`}>
        <input {...getInputProps()} />
        {loading ? <CircularProgress /> :
        <>
        {isDragActive ? (
          <p>Drop the file here...</p>
        ) : logo ? (
          <p>Drag here or click to upload!</p>
        ) : (
          <p>Drag 'n' drop a file here, or click to select a file</p>
        )}
        </>}
      </div>
      <div style={{display:"flex", gap:"10px", width:"100%"}}>
      {formData?.ipfsProof?.map((value, index) => {
        return (
          <Tooltip title={"IPFS CID: " + value} variant="outlined" sx={{fontSize:"13px"}}>
          <Chip variant="outlined"   endDecorator={<ChipDelete onDelete={()=>removeLink(index)}/>}>
            <a href={`https://gateway.pinata.cloud/ipfs/${value}`} style={{textDecoration:"none"}} target="_blank">
              Proof link {index + 1}
            </a>
          </Chip>
          </Tooltip>
        );
      })
      }
      </div>
      <Button sx={{width:"100%"}} onClick={() =>addEvidence()}>Add Evidence</Button>

      </Card>
      </div>
  );
};

export default FileUpload;
