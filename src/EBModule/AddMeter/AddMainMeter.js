import React, { useState } from 'react'
import {Typography, TextField, Button, Card, CardContent,Box} from '@mui/material'
import {Addmetername, resetReading, listdata} from '../services/OPBlockService'

const AddMainMeter=({date,setDate,dError,setDerror})=>{
    
    const[mainmetername, setMainMeterName] = useState('')  //main meter name 
    const[readingunits,setReadingUnits] = useState('') //Reading Units

    //ErrorState
    const[mainMeterErrors,setMainMeterErrors] = useState('') //Main Meter Errors
    const[readingErrors,setReadingErrors] = useState('') //Reading Units Errors
    const[error ,setError] = useState('') //Any Error For store in database
    const[dublicateError ,setDuplicateError] = useState('') //Dublicate MeterName not entry error
   
    const [successMessage, setSuccessMessage] = useState(''); // After Store in database message display state
    
    //Validation Function 
    const validation=()=>{
        const today = new Date(); //current date
        today.setHours(12, 0, 0, 0); // Set time to midnight for comparison
        const selectedDate = new Date(date);

        if(mainmetername.trim() === '' || date === '' || readingunits === ''){

            if(mainmetername.trim() === ''){
                setMainMeterErrors('metername cannot be empty'); 
            }

            if(date === ''){
                setDerror('date cannot be empty'); 
            }

            if(readingunits === ''){
                setReadingErrors('reading reset value cannot be empty');
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
        setSuccessMessage('') //success message state is empty
       
        if(!validation()){
            return;
        }

        const meter={mainmetername,date}
        const resetval={date,mainmetername,readingunits}
        setSuccessMessage('Main Meter has been successfully add');

        try{

            const duplicateCheck= await listdata(); // meter name get in main meter name table

            //Meter name is already exist or not check in database
            const isDuplicate=duplicateCheck.data.some(meter => meter.mainmetername === mainmetername)
            if(isDuplicate){
                setDuplicateError('Meter Name Already exist');
                return;
            }

            const meterResponse=await Addmetername(meter) // main meter name is add in meter table
            if(meterResponse.data){
                setSuccessMessage('Main Meter has been successfully add'); 
            }

            //console.log(meterResponse.data)
            await resetReading(resetval) //main meter name is add and reading value is set zero  in Main meter Reading reset table
            //console.log(resetResponse.data)
               
        }
        catch(error){
            setError(error)
        }

        //all state set zero 
        setMainMeterName('')
        setDate('')
        setReadingUnits('')
        setDerror('')
        setSuccessMessage('')
        setDuplicateError('')

    }
    return(
        <Card sx={{background :'transparent',  display: 'flex',height:250, justifyContent: 'center', alignItems: 'Right' }}> {/**/}
            <CardContent>

                <form onSubmit={Addmeter}>

                    <Typography >Add Main Meter</Typography><br></br>
                        
                    <TextField 
                        input ="text"
                        id="Main Meter Name"
                        label="Main Meter Name"
                        name="Main Meter Name"
                        value={mainmetername}
                        onChange={(event)=>{ 
                            setMainMeterName(event.target.value);
                            setMainMeterErrors('');
                        }}
                        error={!!mainMeterErrors}
                        helperText={mainMeterErrors}
                        sx={{width : 400}}
                    />&nbsp; &nbsp; &nbsp; &nbsp;

                    {/* Dublicate Entry  Error Message  */}
                    {dublicateError && <Typography color="red" sx={{ marginTop: 2 }}>{dublicateError}</Typography>}
                        
                    <TextField 
                        type="number"
                        sx={{width : 400 }}
                        label="Reading Units"
                        value={readingunits}
                        onChange={(e)=>{
                            setReadingUnits(e.target.value)
                            setReadingErrors('')
                        }}
                        error={!!readingErrors}
                        helperText={readingErrors}
                    /><br /><br />

                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                        <Button type="submit" sx={{ width: 400 }} variant="contained" color="primary">
                            Add
                        </Button>
                    </Box>
                        
                </form>

                {/* Meter name  is added in table message in display */}
                {successMessage && <Typography color="green" sx={{ marginTop: 2 }}>{successMessage}</Typography>}
                    
                {/*Any error store in table message is display */}
                {error && <Typography color="red" sx={{ marginTop: 2 }}>{error}</Typography>}

            </CardContent>
        </Card>
               
     
    )
}

export default AddMainMeter