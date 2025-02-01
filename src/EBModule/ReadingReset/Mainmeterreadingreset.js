import React from 'react';
import { Typography, Card, CardContent, TextField,MenuItem,Button,Box} from '@mui/material';
import { useEffect , useState} from 'react';
import { listdata,resetReading } from '../services/OPBlockService';
const Mainmeterreadingreset=( {date ,setDate,dError, setDerror})=>{
    const [meter,setMeter]=useState([])
    const [mainmetername,setMainMeterName]=useState('')
    const [readingunits, setReading]=useState('')
    const [Emmetername,setEmmetername]=useState('')
    const [Ereading,setEreading]=useState('')

    const [successMessage, setSuccessMessage] = useState('');
    useEffect(()=>{
        listdata().then((respone)=>{
            setMeter(respone.data)
            
        } ).catch((error)=>{
            console.error(error)
        })
    })
    const validateData=()=>{
        const today = new Date();
        today.setHours(12, 0, 0, 0); // Set time to midnight for comparison
    
        const selectedDate = new Date(date);
        if(mainmetername === '' && readingunits === '' && date === '' ){
            setEmmetername("meter is don't be empty") 
            setEreading("Reading value is don't be empty") 
            setDerror('Date don not  empty')
            return false;
        }
        else if(mainmetername === ''){
            setEmmetername("meter is don't be empty")
            return false;
        }
        else if(readingunits === ''){
            setEreading("Reading value is don't be empty") 
            return false;
        }
        else if(date === ''){
            setDerror('Date don not  empty')
            return false;
        }
        else if (selectedDate > today) {
            setDerror('Date is invalid. Cannot select a future date.');
            return false;
        }
        return true;
    }

    const readingReset=async (e)=>{
        e.preventDefault();
       
        if(!validateData()){
            return;
        }
       
        try{
            const resetval={date,mainmetername,readingunits}
            await resetReading(resetval)
            setSuccessMessage('Main Meter Reading has been Successfully Reset!')
            setMainMeterName('')
            setReading('')
            setDate(''); 
        }
        catch(error){
            console.error(error)
        }
            
        
    }
    return(
        <Card sx={{display: 'flex' ,justifyContent: 'center',alignItems: 'center' ,height : 280}}   >
                <CardContent>
                    <Typography>Main Meter Reading Reset</Typography><br></br>
                    <TextField
                    select 
                    sx={{width:400}}
                    label='MeterName'
                    value={mainmetername}
                    onChange={(e)=>{
                        setMainMeterName(e.target.value)
                        setEmmetername('')
                    }}
                    error={!!Emmetername}
                    helperText={Emmetername}
                    >
                       {
                        meter.map((meters)=>(
                            <MenuItem key={meters.id} value={meters.mainmetername}>
                                {meters.mainmetername}
                            </MenuItem>
                        ))
                       }   
                        
                    </TextField>&nbsp; &nbsp;
                    <TextField 
                      sx={{width:400}}
                      label="ReadingResetValue" 
                      value={readingunits} 
                      onChange={(e)=>{
                        setReading(e.target.value) 
                        setEreading('')
                      }}
                      error={!!Ereading}
                      helperText={Ereading}></TextField><br /><br />
                      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                        <Button sx={{width:400}} onClick={readingReset}  variant="contained" color="primary">ReSet</Button>
                      </Box>
                    
                    {successMessage && <Typography color="green" sx={{ marginTop: 2 }}>{successMessage}</Typography>}
                </CardContent>
        </Card>
    )
}
export default Mainmeterreadingreset