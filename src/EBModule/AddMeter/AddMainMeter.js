import React, { useState } from 'react'
import { Typography, TextField,Button,Card, CardContent} from '@mui/material'
import { Addmetername,resetReading,listdata} from '../services/OPBlockService'

const AddMainMeter=({date,setDate, dError, setDerror})=>{
    
    const[mainmetername, SetAddMainMeter]=useState('')  //  main meter name 
    const[readingunits,setReading]=useState('') // Reading Units
    const[merrors,setMerrors]=useState('') // Main Meter Errors
    const[rerrors,setRerrors]=useState('') // Reading Units Errors
    
    const [successMessage, setSuccessMessage] = useState(''); // After Store in database message display state
    const [error ,setError]=useState('') // Any Error For store in database

    const [dublicateError ,setDuplicateError]=useState('') // Dublicate MeterName not entry
   

    //Validation Function 
    const validation=()=>{
        const today = new Date();
        today.setHours(12, 0, 0, 0); // Set time to midnight for comparison
    
        const selectedDate = new Date(date);
        if(mainmetername.trim() === '' || date === '' || readingunits === ''){
            if(mainmetername.trim() === ''){
                setMerrors('metername cannot be empty');
               
            }
            if(date === ''){
                setDerror('date cannot be empty');
                
            }
            if(readingunits === ''){
                setRerrors('reading reset value cannot be empty')
               
            }
            return false;
        }
       
        else if (selectedDate > today) {
            setDerror('Date is invalid. Cannot select a future date.');
            return false;
        }
        return true;
    }

    //Store in database function
    const Addmeter= async (event)=>{
        event.preventDefault();
        setSuccessMessage('')
       
        
        if(!validation()){
            return;
        }

            const meter={mainmetername,date}
            const resetval={date,mainmetername,readingunits}
            setSuccessMessage('Main Meter has been successfully add');

            try{
                const duplicateCheck= await listdata();
                const isDuplicate=duplicateCheck.data.some(meter => meter.mainmetername === mainmetername)
                if(isDuplicate){
                    setDuplicateError('Meter Name Already exist');
                    return;
                }
                const meterResponse= await Addmetername(meter)
                if(meterResponse.data){
                    setSuccessMessage('Main Meter has been successfully add'); 
                }
                //console.log(meterResponse.data)
                await resetReading(resetval)
                //console.log(resetResponse.data)
               
            }
            catch(error){
                setError(error)
            }
            SetAddMainMeter('')
            setDate('')
            setReading('')
            setDerror('')
            setSuccessMessage('');
            setDuplicateError('')

    }
    return(
            <Card sx={{background :'transparent',  display: 'flex',
                width :"550px",height:310,  alignItems: 'Right',
                justifyContent: 'center'}}>
                <CardContent>
                    <form onSubmit={Addmeter}>

                        <Typography >Add Main Meter</Typography><br></br>
                        
                        <TextField 
                            input ='text'
                            id="AddMainmeter"
                            label="AddMainmeter"
                            name="metername"
                            value={mainmetername}
                            onChange={(event)=>{ 
                                SetAddMainMeter(event.target.value)
                                setMerrors('');
                            }}
                            error={!!merrors}
                            helperText={merrors}
                            sx={{width : 400}}
                        /><br /><br />

                        <TextField 
                            type="number"
                            sx={{width : 400}}
                            label="Reading Units"
                            value={readingunits}
                            onChange={(e)=>{
                                setReading(e.target.value)
                                
                                setRerrors('')
                            }}
                            error={!!rerrors}
                            helperText={rerrors}
                        ></TextField><br /><br />

                        <Button type='submit' sx={{width : 400}} variant="contained" color="primary">Add</Button>
                        {dublicateError && <Typography color="red" sx={{ marginTop: 2 }}>{dublicateError}</Typography>}
                    </form>
                    {successMessage && <Typography color="green" sx={{ marginTop: 2 }}>{successMessage}</Typography>}
                    {error && <Typography color="green" sx={{ marginTop: 2 }}>{error}</Typography>}
                </CardContent>
            </Card>
               
     
    )
}

export default AddMainMeter