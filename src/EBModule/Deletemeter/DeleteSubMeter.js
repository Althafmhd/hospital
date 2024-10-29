import { Card, CardContent, TextField, Typography ,Button,MenuItem} from '@mui/material'
import React from 'react'
import { useState , useEffect  } from 'react'
import { listdata,getlistdata,getSubMeter,deleteSubMeter } from '../services/OPBlockService'
import DeleteSubMeterM from './DeleteSubMeterM'
const DeleteSubMeter=()=>{
    const [meters ,setMeters]=useState([]);
    const [mainmetername, setMainMeterName]=useState('')
    const [filterSubBlockMeterName,setFilterSubBlockMeterName]=useState([]);
    const [subblockmetername,setSubBlockMeterName]=useState('')
    const [filterSubMeterName,setFilterSubMeterName]=useState([])
    const [submetername,setSubMeterName]=useState('')

    const [modalOpen, setModalOpen] = useState(false);

    const[mainMeterError,setMainMeterError]=useState('');
    const[subblockMeterError,setSubBlockMeterError]=useState('');
    const[subMeterError,setSubMeterError]=useState('');

    const [successMessage, setSuccessMessage] = useState('');

    useEffect(()=>{
        const fetchMeters= async ()=>{
            try {
                const response = await listdata(); 
                //console.log(response.data);
                setMeters(response.data)
            } catch (error) {
                console.error("Error fetching meters:", error);
            }
           
        }
        fetchMeters();
    })

    const handleMainMeterChange= async (e)=>{
        const selectedMainMeterName=e.target.value;
        setMainMeterName(selectedMainMeterName);

        try{
            const response =await getlistdata();
            const filtered=response.data.filter(item => item.mainmetername.trim() === selectedMainMeterName.trim() )
            setFilterSubBlockMeterName(filtered)
            console.log(filtered)
        }
        catch(error){
            console.error(error);
        }
    }

    const handleSubBlockMeterChange= async (e) =>{
        const selectedSubBlock=e.target.value;
        setSubBlockMeterName(selectedSubBlock) 

        try{
            const response =await getSubMeter();
            const filtered=response.data.filter(item => item.subblockmetername.trim() === selectedSubBlock.trim() )
            setFilterSubMeterName(filtered)
            console.log(filtered)
        }
        catch(error){
            console.log(error)
        }
    }
    const validateData=()=>{
        if(mainmetername === '' && subblockmetername === '' && submetername === ''){
            setMainMeterError("main meter name cannot be empty")
            setSubBlockMeterError("sub block  meter cannot be empty");
            setSubMeterError('sub meter cannot be empty ')
            return false
        }
        else if(mainmetername === ''){
            setMainMeterError("main meter name cannot be empty")
            return false;
        }
        else if(subblockmetername === ''){
            setSubBlockMeterError("sub block  meter cannot be empty");
            return false;
        }
        else if(submetername === ''){
            setSubMeterError('sub meter cannot be empty ')
            return false;
        }
        return true;
    }
    const handleDeleteSubMeter= async (event) =>{
        event.preventDefault();
        setSuccessMessage('');
        if(!validateData()){
            return;
        }
        setModalOpen(true);
    }

    const handleConfirmDelete = async () => {
        try {
            await deleteSubMeter(submetername);
            setSuccessMessage("Sub Meter deleted successfully!");
            setMainMeterName('');
            setSubBlockMeterName('');
            setSubMeterName('');
        } catch (error) {
            console.error("Error deleting sub meter:", error);
            alert("There was an error deleting the sub meter. Please try again.");
        } finally {
            setModalOpen(false); // Close the modal
        }
    };
    return(
        <Card sx={{background :'transparent',  display: 'flex',width :"550px",height:430,  alignItems: 'center',justifyContent: 'center'}}>
            <CardContent>
                <Typography>Delete Sub Meter</Typography><br />
                <form id="DSM" onSubmit={handleDeleteSubMeter}>
                    <TextField
                        select
                        sx={{width :400 }}
                        label="Main Meter Name"
                        value={mainmetername}
                        onChange={handleMainMeterChange}
                        error={!!mainMeterError}
                        helperText={mainMeterError}
                    >
                      {
                        meters.map(meter =>(
                            <MenuItem key={meter.id} value={meter.mainmetername}>{meter.mainmetername}</MenuItem>
                        ))
                      }  
                        

                    </TextField><br /><br />
                    <TextField
                        select
                        label="Sub Block Meter Name"
                        sx={{width :400}}
                        value={subblockmetername}
                        onChange={handleSubBlockMeterChange}
                        error={!!subblockMeterError}
                        helperText={subblockMeterError}
                    >
                        {
                            filterSubBlockMeterName.map(meter => (
                                <MenuItem key={meter.id} value={meter.subblockmetername}>{meter.subblockmetername}</MenuItem>
                            ))
                        }
                      
                    </TextField><br /><br />
                    <TextField
                        select
                        label="Sub Meter Name"
                        sx={{width : 400}}
                        value={submetername}
                        onChange={(e)=>{setSubMeterName(e.target.value)}}
                        error={!!subMeterError}
                        helperText={subMeterError}
                    >
                        {
                            filterSubMeterName.map(meter =>(
                                <MenuItem key={meter.id} value={meter.submetername}>{meter.submetername}</MenuItem>
                            ))
                        }
                    </TextField><br /><br />
                    <Button sx={{width : 400}} type="submit"  variant="contained" color="primary">DELETE</Button>
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
export default DeleteSubMeter;