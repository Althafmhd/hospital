import { Card,CardContent, Typography ,TextField, MenuItem , Button,Box} from '@mui/material'
import React from 'react'
import { useState, useEffect} from 'react'
import { listdata ,getlistdata ,getSubMeter, subMeterReset} from '../services/OPBlockService'
const SubMeterreadingreset=({date,setDate,dError, setDerror})=>{
    const [meters ,setMeters]=useState([])
    const [mainmetername,setMainMeterName]=useState('')
    const [filterSubBlockMeterName,setFilterSubBlokMeterName]=useState([])
    const [subblockmetername,setSubBlockMeterName]=useState('')
    const [filterSubMeterName,setFilterSubMeterName]=useState([])
    const [submetername,setSubMeterName]=useState('')
    const [readingunits,setReadingUnits]=useState('')


    const [mainMeterError,setMainMeterError]=useState('')
    const [subBlockMeterError,setSubBlockMeterError]=useState('')
    const [subMeterError,setSubMeterError]=useState('')
    const [readingUnitsError,setReadingUnitsError]=useState('')

    const [successMessage, setSuccessMessage] = useState('');

    useEffect(()=>{

        const fetchMeter= async()=>{
            try{
                const response =await listdata();
                setMeters(response.data)
            }
            catch(error){
                console.error(error)
            }
        }

        fetchMeter();
    })

    const handleMainMeterNameChange= async (event)=>{
        const selectedMainMeterName=event.target.value;
        setMainMeterName(selectedMainMeterName);
        setMainMeterError('')
        try{
            const response=await getlistdata()
            const filtered=response.data.filter((meter)=> (meter.mainmetername.trim() === selectedMainMeterName.trim()))
            setFilterSubBlokMeterName(filtered)
        }
        catch(error){
            console.log(error)
        }
    }

    const handleSubBlockMeterNameChange= async (event)=>{
        const selectedSubBlockMeterName=event.target.value;
        setSubBlockMeterName(selectedSubBlockMeterName);
        setSubBlockMeterError('')
        try{
            const reponse=await getSubMeter();
            const filltered=reponse.data.filter((meter)=>(meter.subblockmetername.trim() === selectedSubBlockMeterName.trim()))
            setFilterSubMeterName(filltered);
        }
        catch(error){
            console.error(error)
        }
    }
    
    const validateData=()=>{
        const today = new Date();
        today.setHours(12, 0, 0, 0); // Set to midnight to ignore time
        const selectedDate = new Date(date);
        if(date === ''  && mainmetername === '' && subblockmetername === '' && submetername === '' && readingunits === ''){
            setDerror("Date cannot be empty");
            setMainMeterError('main meter cannot be empty')
            setSubBlockMeterError('sub block meter name cannot be empty')
            setSubMeterError('sub meter name cannot be empty')
            setReadingUnitsError('reading cannot be empty ')
            return false;
        }
        else if(date === ''){
            setDerror("Date cannot be empty");
            return false;
        }
        else if(mainmetername === ''){
            setMainMeterError('main meter cannot be empty')
            return false;
        }
        else if(subblockmetername === ''){
            setSubBlockMeterError('sub block meter name cannot be empty')
            return false;
        }
        else if(submetername === ''){
            setSubMeterError("sub meter name cannot be empty")
            return false;
        }
        else if(readingunits === ''){
            setReadingUnitsError('reading cannot be empty ')
            return false;
        }
        else if (selectedDate > today) {
            setDerror('date is invalid. Cannot select a future date.');
            return false;
        }
        return true;
    }

    const handleSubMeterReadingReset= async (event)=>{
        event.preventDefault();
        setSuccessMessage('');
        if(!validateData()){
            return;
        }
        const readingReset={date,mainmetername,subblockmetername,submetername,readingunits }
        try{
            await subMeterReset(readingReset)
            setSuccessMessage('Sub meter reading has been successfully reset!');
            setDate('')
            setMainMeterName('')
            setReadingUnits('')
            setSubMeterName('')
        }
        catch(error){
            console.error(error)
        }
        
    }
    return (
        <Card sx={{height : 350, display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
            <CardContent>
                <Typography>Sub Meter Reset</Typography><br />
                <form onSubmit={handleSubMeterReadingReset}>
                    <TextField 
                        select
                        sx={{width :400}}
                        name="Main Meter Name"
                        label="Main Meter Name"
                        value={mainmetername}
                        onChange={handleMainMeterNameChange}
                        error={!!mainMeterError}
                        helperText={mainMeterError}>
                        {
                            meters.map((meters)=>(
                                <MenuItem key={meters.id} value={meters.mainmetername}>{meters.mainmetername}</MenuItem>
                            ))
                        }

                    </TextField>  &nbsp; &nbsp;
                    <TextField 
                       select 
                       sx={{width : 400}}
                       name="Sub Block Meter Name"
                       label="Sub Block Meter Name"
                       value={subblockmetername}
                       onChange={handleSubBlockMeterNameChange}
                       error={!!subBlockMeterError}
                       helperText={subBlockMeterError}>
                        {
                            filterSubBlockMeterName.map((meter)=>(
                                <MenuItem key={meter.id} value={meter.subblockmetername}>{meter.subblockmetername}</MenuItem>
                            ))
                        }

                    </TextField > <br /><br />
                    <TextField 
                        select
                        sx={{width :400}}
                        name="Sub Meter Name"
                        label="Sub Meter Name"
                        value={submetername}
                        onChange={(e)=>{
                            setSubMeterName(e.target.value)
                            setSubMeterError('')
                        }}
                        error={!!subMeterError}
                        helperText={subMeterError}>
                        {
                            filterSubMeterName.map((meter)=>(
                                <MenuItem key={meter.id} value={meter.submetername}>{meter.submetername}</MenuItem>
                            ))
                        }

                    </TextField> &nbsp; &nbsp;
                    <TextField
                      sx={{width :400}}
                      name ="Reading Units"
                      label="Reading Units"
                      value={readingunits}
                      onChange={(e)=>{
                        setReadingUnits(e.target.value)
                        setReadingUnitsError('')
                    }}
                      error={!!readingUnitsError}
                      helperText={readingUnitsError}
                    >

                    </TextField><br /><br />
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                        <Button 
                            sx={{width :400}}
                            variant="contained" 
                            color="primary"
                            type="submit"

                        >
                            RESET
                        </Button>
                    </Box>
                    
                </form>
                {successMessage && <Typography color="green" sx={{ marginTop: 2 }}>{successMessage}</Typography>}
            </CardContent>
        </Card>
    )
}
export default SubMeterreadingreset;