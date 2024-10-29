import React, { useEffect } from 'react'
import {useState} from 'react'
import { Typography,MenuItem,Button, Card,CardContent, TextField } from '@mui/material'
import { listdata , getlistdata , Deletesubmetername ,deleteSubBlockMeter} from '../services/OPBlockService'
import DeleteSubMeterM from './DeleteSubMeterM'
const DeleteSubBlockMeter = () => {
    const [meters,setmeters]=useState([])
    const [mainmetername,setMainMeterName]=useState('');
    const [filtermeters,setFilterMeters]=useState([])
    const [subblockmetername,setSubBlockMeterName]=useState('')

    const [subMeterError,setSubMeterError]=useState('')
    const [mainMeterError,setMainMeterError]=useState('')

    const [modalOpen, setModalOpen] = useState(false);

    const [successMessage, setSuccessMessage] = useState('');
    useEffect(() => { 
        const fetchMeters= async ()=>{
            try{
                const response =await listdata()
                setmeters(response.data)
            }
            catch(error){
                console.error(error)
            }
        };
      
        fetchMeters()
    });
   

    const handChangeMainMeter= async (event)=>{
        
        const selectedMainMeterName = event.target.value;
        setMainMeterName(selectedMainMeterName)
        setMainMeterError('')

        try{
            const response =await getlistdata();
            const filtered=response.data.filter(item => item.mainmetername.trim() === selectedMainMeterName.trim() )
            setFilterMeters(filtered)
        }
        catch(error){
            console.error(error);
        }
    };
    
    const validateDate=()=>{
        if(!mainmetername  && !subblockmetername){
            setMainMeterError('metername must be seleced')
            setSubMeterError('metername must be seleced')
            return false;
        }
        else if(!mainmetername ){
            setMainMeterError('metername must be seleced')
            return false;
        }
        else if(!subblockmetername){
            setSubMeterError('metername must be seleced')
            return false;
        }
        return true;
    };
    
    const handleDeletSubBlockMeter= async (event)=>{
        event.preventDefault()
       // console.log(subblockmetername)
       setSuccessMessage('')
        if(!validateDate()){
            return;
        }
        setModalOpen(true);

    };
    const handleConfirmDelete =async()=>{
        try{
            await Deletesubmetername(subblockmetername);
            await deleteSubBlockMeter(subblockmetername);
            setSuccessMessage("Sub Block Meter deleted successfully!");
            setSubBlockMeterName('')
            setMainMeterName('')
            setFilterMeters([])
          }
         catch(error){
          console.error('Failed to delete sub meter:', error)
          alert("There was an error deleting the sub meter. Please try again.");
         }
         finally {
          setModalOpen(false); // Close the modal
          }
    }

    return(
        <Card sx={{background :'transparent',  display: 'flex',width :"550px",height:340,  alignItems: 'Right',justifyContent: 'center'}}>
           <CardContent>
                <form id="DSM" onSubmit={handleDeletSubBlockMeter}>
                    <Typography>Delete Sub Block Meter</Typography><br></br>
                    
                    <TextField 
                        select 
                        label="MainMeterName"
                        value={mainmetername}
                        onChange={handChangeMainMeter} 
                        sx={{width :400}}
                        error={!!mainMeterError}
                        helperText={mainMeterError}
                    >
                        
                        {
                            meters.map((meter)=>(
                                <MenuItem key={meter.id} value={meter.mainmetername}>
                                    {meter.mainmetername}
                                </MenuItem>
                            ))
                            
                        }
                    </TextField><br></br><br></br>
                    <TextField 
                        select 
                        label="SubMeterName" 
                        sx={{width : 400}} 
                        value={subblockmetername} 
                        onChange={(e)=> {
                            setSubBlockMeterName(e.target.value)
                            setSubMeterError('')
                        }}
                        error={!!subMeterError}
                        helperText={subMeterError}
                    >
                       {
                            filtermeters.map(meter =>(
                                <MenuItem  key={meter.id} value={meter.subblockmetername}>
                                    {meter.subblockmetername}
                                </MenuItem>
                            ) )
                            
                        }
                    </TextField><br /><br />
                    
                    
                    <Button type="submit" sx={{width:400}} variant="contained" color="primary">Delete</Button>  
                    <DeleteSubMeterM
                        open={modalOpen} 
                        handleClose={() => setModalOpen(false)} 
                        handleDelete={handleConfirmDelete} 
                    />
                </form>
                {successMessage && <Typography color="green" sx={{ marginTop: 2 }}>{successMessage}</Typography>}
           </CardContent>
        </Card>
        
    )
}
export default DeleteSubBlockMeter