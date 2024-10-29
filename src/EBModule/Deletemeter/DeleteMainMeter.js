import React from 'react'
import { Deletemetername, listdata , Deletesubblockmetername} from '../services/OPBlockService';
import { Typography,Button,MenuItem ,TextField,InputLabel, Card, CardContent} from '@mui/material'
import {useState,useEffect} from 'react'
import DeleteSubMeterM from './DeleteSubMeterM';
const DeleteMainMeter=()=>{
    const [meters,setMeters]=useState([])
    const [mainmetername,setMainMeterName]=useState('')
    const [meterError,setMeterError]=useState('')
    const [modalOpen, setModalOpen] = useState(false);

    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchMeters = async () => {
            try {
                const response = await listdata();
                setMeters(response.data);
                // Set default to the first meter name if available
               
            } catch (error) {
                console.error(error);
            }
        };

        fetchMeters();
    });

    

    const handleDeleteMeter=async (event)=>{
        event.preventDefault()
        setSuccessMessage('')
        if(!mainmetername){
            setMeterError('Meter name must be selected ') 
            return;
        }
        setModalOpen(true);
    };

    const handleConfirmDelete =async() =>{
        try{
            await Deletemetername(mainmetername)
            await Deletesubblockmetername(mainmetername)
            setSuccessMessage("Main Meter deleted successfully!");
            setMainMeterName('');
            setMeterError('');
        }
        catch(error){
            setMeterError('Failed to delete meter. Please try again.');
            alert("There was an error deleting the sub meter. Please try again.");
        }
        finally {
            setModalOpen(false); // Close the modal
        }
    }


    return(
       <Card sx={{background :'transparent',  display: 'flex', width :"550px",height:220,  alignItems: 'Right', justifyContent: 'center'}}>
            <CardContent>
                <form id="DMM" onSubmit={handleDeleteMeter}>
                    <InputLabel>Delete Main Meter</InputLabel> <br />
                    <TextField 
                        select 
                        id="MeterName" 
                        sx={{ width:400 }} 
                        label='MainMeterName' 
                        value={mainmetername} 
                        onChange={(e)=>{
                            setMainMeterName(e.target.value)
                            setMeterError('')
                        }}
                        error={!!meterError}
                        helperText={meterError}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                            {
                                meters.map((meter)=>(
                                    <MenuItem  key={meter.id} value={meter.mainmetername}>{meter.mainmetername}</MenuItem>
                                ))
                            }
                    </TextField><br /><br />
                    <Button type="submit" sx={{width : 400}} variant="contained" color="primary">Delete</Button>
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
export default DeleteMainMeter