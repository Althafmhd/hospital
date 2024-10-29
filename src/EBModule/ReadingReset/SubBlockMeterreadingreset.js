import { Card,CardContent, Typography ,TextField ,Button ,MenuItem} from '@mui/material'
import React from 'react'
import { useState ,useEffect } from 'react'
import { listdata , getlistdata ,subBlockMeterReadingReset } from '../services/OPBlockService'

const SubBlockMeterreadingreset=({date,setDate,dError, setDerror})=>{
    const [meter,setMeter]=useState([])
    const [mainmetername,setMainMeterName]=useState('')
    const [filterMeters,setFilterMeters]=useState([])
    const [subblockmetername,setSubBlockMeterName]=useState('')
    const [readingunits, setReadingUnits]=useState('')

    const [Emeter,setMread]=useState('');
    const [Smeter,setSmeter]=useState('');
    const [Rmeter,setRmeter]=useState('');

    const [successMessage, setSuccessMessage] = useState('');

    useEffect(()=>{ 
       const fetchMeter=async()=>{
            try{
                const response = await listdata();
                setMeter(response.data)
            }
            catch(error){
                console.error(error)
            }
       }
       fetchMeter();
    })

    const handMainMeterChange= async (event)=>{
        
        const selectedMmeterName = event.target.value;
        setMainMeterName(selectedMmeterName)
        console.log(selectedMmeterName)
       

        try{
            const response = await getlistdata();
           
            const filtered= response.data.filter(item => item.mainmetername.trim() === selectedMmeterName.trim());
            setFilterMeters(filtered)
        }
        catch(error){
            console.log(error)
        }
        setMread('')
       
    }

    const validateData=()=>{
        const today = new Date();
        today.setHours(12, 0, 0, 0); // Set to midnight to ignore time
        const selectedDate = new Date(date);
        if(mainmetername === '' && subblockmetername ==='' && readingunits === '' && date ===''){
            setMread("metername cannot be empty")
            setSmeter("submetername cannot be empty")
            setRmeter("reading cannot be empty")
            setDerror('date cannot be empty')
            return false;
        }
        else if(mainmetername === ''){
            setMread("metername cannot be empty")
            return false;
        }
        else if(subblockmetername ===''){
            setSmeter("submetername cannot be empty")
            return false;
        }
        else if(readingunits ===''){
            setMread("reading cannot be empty")
            return false;
        }
        else if(date === ''){
            setDerror("date cannot be empty")
            return false;
        }
        else if (selectedDate > today) {
            setDerror('date is invalid. Cannot select a future date.');
            return false;
        }
        return true;
    }

    const handResetValue=async (e)=>{
        e.preventDefault();
        setSuccessMessage('')
        if(!validateData()){
            return ;
        }
    
        const resetval={date,mainmetername,subblockmetername,readingunits}
        await subBlockMeterReadingReset(resetval)
        setSuccessMessage("Sub Block Meter Reading has been succesfully reset !")
        setMainMeterName('')
        setSubBlockMeterName('')
        setReadingUnits('')
    }

    return (
        <Card sx={{display: 'flex',justifyContent: 'center',alignItems: 'center'}} >
            <CardContent>
                 
                <Typography>Sub Block Meter Reset Reading</Typography><br />

                <TextField 
                    select 
                    sx={{width:400}}
                    label="MeterName"
                    value={mainmetername}
                    onChange={handMainMeterChange}
                    error={!!Emeter}
                    helperText={Emeter}
                >
                    {
                        meter.map((meters)=>(
                            <MenuItem key={meters.id} value={meters.mainmetername}>{meters.mainmetername}</MenuItem>
                        ))
                    }
                </TextField><br /><br />

                <TextField 
                    select 
                    sx={{width:400}} 
                    label="SubMeterName"
                    value={subblockmetername}
                    onChange={(e)=>{
                        setSubBlockMeterName(e.target.value)
                        setSmeter('')
                    }}
                    error={!!Smeter}
                    helperText={Smeter}
                >
                    {
                        filterMeters.map((meters)=>(
                            <MenuItem key={meters.id} value={meters.subblockmetername}>{meters.subblockmetername}</MenuItem>
                        ))
                    }
                </TextField><br /><br />

                <TextField 
                    sx={{width:400}}  
                    label="ReadingResetValue" 
                    value={readingunits} 
                    onChange={(e)=>{
                        setReadingUnits(e.target.value)
                        setRmeter('')
                    }}
                    error={!!Rmeter}
                    helperText={Rmeter}
                >
                </TextField><br /><br />

                <Button sx={{width:400}} onClick={handResetValue}  variant="contained" color="primary">RESET</Button>
                {successMessage && <Typography color="green" sx={{ marginTop: 2 }}>{successMessage}</Typography>}
            </CardContent>
        </Card>
    )
}
export default SubBlockMeterreadingreset