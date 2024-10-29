import React from 'react'
import { Typography,  TextField,Button,MenuItem, Card, CardContent} from '@mui/material'

import { useState, useEffect} from 'react';
import {  listdata ,addSubBlockMeterName, subBlockMeterReadingReset,getlistdata} from '../services/OPBlockService';

const AddSubBlockMeter=({date,setDate,dError, setDerror})=>{
    const [meterNames, setMeterNames]=useState([])
    const [mainmetername,addmainMeter]=useState('');
    const [subblockmetername ,addsubMeter]=useState('');
    const [readingunits ,setReading]=useState('')

    //validationCheckState
    const [mmeterError,setmMetererror]=useState('');
    const [smeterError,setsMetererror]=useState('');
    const [rError,setRerror]=useState('')
    const [dublicateError,setDublicateError]=useState('');
    const [successMessage, setSuccessMessage] = useState('');


    useEffect(() => {
        const fetchMeterNames = async () => {
          try {
            const response = await listdata();
            setMeterNames(response.data);
            //console.log(response.data)
          } catch (error) {
            console.error(error);
          }
        };
    
        fetchMeterNames();
      });


    const handleAddSubMeter=async (event)=>{
        event.preventDefault();
        setSuccessMessage('');
        const today = new Date();
        today.setHours(12, 0, 0, 0); // Set to midnight to ignore time
        const selectedDate = new Date(date);
        if(mainmetername === '' && subblockmetername=== '' && date === '' && readingunits=== ''){
            setmMetererror('meter name must be select')
            setsMetererror('Submetername cannot be empty');
            setDerror('date cannot be empty');
            setRerror('reading setvalue cannot be empty');
            return;
        }
        else if(mainmetername === ''){
            setmMetererror('meter name must be select')
            return;
        }
        else if(subblockmetername=== ''){
            setsMetererror('Submetername cannot be empty');
            return;
        }
        else if(date === ''){
            setDerror('date cannot be empty');
            return;
        }
        else if(readingunits=== ''){
            setRerror('reading setvalue cannot be empty');
            return;
        }
        else if (selectedDate > today) {
            setDerror('date is invalid. Cannot select a future date.');
            return ;
        }
        else{

            const dublicateChecking= await getlistdata();
            const isDublicate= dublicateChecking.data.some(meter => meter.mainmetername === mainmetername && meter.subblockmetername === subblockmetername);

            if(isDublicate){
                setDublicateError('Meter Name is already exist ');
                return;
            }
            const subBlockMeterData={mainmetername,subblockmetername,date}

            const subBlockMeterReset={date,mainmetername,subblockmetername,readingunits}
            
            try {
                await addSubBlockMeterName(subBlockMeterData);
                
                await subBlockMeterReadingReset(subBlockMeterReset);

                setSuccessMessage("Sub Block Meter has been Succesfully add")
            } catch (error) {
                console.error(error);
            }
        
            addmainMeter('')
            addsubMeter('')
            setDate('')
            setReading('')
            setDerror('')
        }
        
    }
        return(
            <Card sx={{background :'transparent',  display: 'flex',
                width :"550px",height:430,  alignItems: 'Right',
                justifyContent: 'center'}}>
                <CardContent><br></br>
                    <form id="ASM">
                        <Typography sx={{ alignContent:'center'}}>Add Sub Block Meter</Typography><br></br>
                        
                        <TextField
                        select
                        sx={{width : 400}}
                        label='MeterName'
                        value={mainmetername}
                        onChange={(e)=>{
                            addmainMeter(e.target.value)
                            setmMetererror('')
                        }}
                        error={!!mmeterError}
                        helperText={mmeterError}
                        >   
                        {
                            meterNames.map(meter=>(
                                <MenuItem 
                                key={meter.id} 
                                value={meter.mainmetername}
                                >{meter.mainmetername}</MenuItem>
                            ) )
                        }  
                        </TextField><br></br><br></br>

                        <TextField 
                            required
                            autoFocus
                            input='text' 
                            label='SubMeterName'
                            sx={{width : 400}}
                            value={subblockmetername}
                            onChange={(event)=>{
                                addsubMeter(event.target.value)
                                setsMetererror('');
                            }}
                            error={!!smeterError}
                            helperText={smeterError}
                           
                            
                        /> <br /><br />

                        <TextField
                            type='number'
                            sx={{width : 400}}
                            label="ReadingSet"
                            value={readingunits}
                            onChange={(e)=>{setReading(e.target.value)
                                setRerror('')
                            }}
                            error={!!rError}
                            helperText={rError}
                        >

                        </TextField> <br /><br />

                        <Button onClick={handleAddSubMeter}  sx={{width : 400}} variant="contained" color="primary">  Add </Button>
                        {dublicateError && <Typography color="red" sx={{ marginTop: 2 }}>{dublicateError}</Typography>} 
                        {successMessage && <Typography color="green" sx={{ marginTop: 2 }}>{successMessage}</Typography>} 
                    </form>
                </CardContent>
            </Card>
        
    )
}

export default AddSubBlockMeter