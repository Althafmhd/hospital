import { Card,CardContent, Typography , TextField,Button, MenuItem } from '@mui/material'
import React from 'react'
import {useEffect ,useState} from 'react'
import { listdata , getlistdata,subMeterAdd,subMeterReset,getSubMeter} from '../services/OPBlockService'
const AddSubMeter=({date,setDate,dError, setDerror})=>{
    const [meterName,setMeterName]=useState([])
    const [mainmetername,setMainMeterName]=useState('')
    const [subMeter,setSubBlMeterName]=useState([])
    const [subblockmetername,setSubBlockMeterName]=useState('')
    const [submetername,setSubMeterName]=useState('')
    const [readingunits, setReadingUnits]=useState('')

    const [subBlockMeterError,setSubBlockMeterError]=useState('')
    const [mainMeterError,setMainMeterError]=useState('')
    const [subMeterError,setSubMeterError]=useState('')
    const [readingError,setReadingError]=useState('')
    const [dublicateError,setDublicateError]=useState('')
    const [successMessage, setSuccessMessage] = useState(''); 


    useEffect(() => {
        const fetchMeterNames = async () => {
          try {
            const response = await listdata();
            setMeterName(response.data);
            //console.log(response.data)
          } catch (error) {
            console.error(error);
          }
        };
    
        fetchMeterNames();
    });

    const subMeterNameChange= async (e)=>{
        const selectValue=e.target.value;
        setMainMeterName(selectValue)
        setMainMeterError('')
        try{
            const response = await getlistdata() 
            const filter=response.data.filter(item => item.mainmetername.trim() === selectValue.trim())
            //console.log(filter);
            setSubBlMeterName(filter)
        }catch(error){
            console.error(error)
        }
        
    }
    
    const validatingDate=()=>{
        const today = new Date();
        today.setHours(12, 0, 0, 0); // Set to midnight to ignore time
        const selectedDate = new Date(date);
        if(date === ''  && mainmetername === '' && subblockmetername === '' && submetername ==='' && readingunits === ''){
            setDerror('Date cannot be empty') 
            setMainMeterError('main meter name cannot be empty');
            setSubBlockMeterError('Sub Block meter name cannot be empty')
            setSubMeterError('sub meter name cannot be empty')
            setReadingError('Reading units cannot be empty')
            return false;
        }

        else if(date === ''){
            setDerror('Date cannot be empty')
            return false;
        }

        else if(mainmetername === ''){
            setMainMeterError('main meter name cannot be empty');
            return false;
        }

        else if(subblockmetername === ''){
            setSubBlockMeterError('Sub Block meter name cannot be empty')
            return false;
        }
        else if(submetername === ''){
            setSubMeterError('sub meter name cannot be empty')
            return false;
        }
        else if(readingunits === ''){
            setReadingError('Reading units cannot be empty')
            return false;
        }
        else if (selectedDate > today) {
            setDerror('date is invalid. Cannot select a future date.');
            return false;
        }
        return true;
    }

    const handsAddmeter= async(event)=>{
        event.preventDefault();
        
        setSuccessMessage('')

        if(!validatingDate()){
            return;
        }

        const subMeterData = {
            date,
            mainmetername,
            subblockmetername,
            submetername,
            readingunits
        };
        //console.log(subMeterData)
       
  
        try{
            
            const dublicateChecking= await getSubMeter();
            const isDublicate = dublicateChecking.data.some(meter => meter.mainmetername === mainmetername && meter.subblockmetername === subblockmetername && meter.submetername === submetername)
            if(isDublicate){
                setDublicateError('Meter Name is already exist ');
                return;
            }
            const reponseSubMeter=await subMeterAdd(subMeterData)
            //console.log(reponseSubMeter.data)

            const submeterresetdata= {
                date,
                mainmetername,
                subblockmetername,
                submetername,
                readingunits
            };
            //console.log(submeterresetdata)
            const reponseSubMeterReset=await subMeterReset(submeterresetdata)
           // console.log(reponseSubMeterReset.data)

            setSuccessMessage('Sub Meter has been Successfully add')
            setDate('')
            setMainMeterName('')
            setSubBlockMeterName('')
            setSubMeterName('')
            setReadingUnits('')
        }
        catch(error){
            console.error(error)
        }
    }
    return(
        <Card sx={{background :'transparent',  display: 'flex',
            width :"550px",height:540,  alignItems: 'Right',
            justifyContent: 'center'}}><br /><br /><br /><br />
            <CardContent><br />
                <Typography>Add Sub Meter</Typography><br />
                <TextField 
                select
                sx={{width:400}} 
                label="Main Meter Name"
                value={mainmetername}
                onChange={subMeterNameChange}
                error={!!mainMeterError}
                helperText={mainMeterError}>
                    {
                        meterName.map((meters)=>(

                            <MenuItem key={meters.id} value={meters.mainmetername}>{meters.mainmetername}</MenuItem>
                        ))
                    }
                </TextField><br /><br />
                <TextField 
                select
                label="Sub Block Meter Name"
                value={subblockmetername}
                onChange={(e)=>{
                    setSubBlockMeterName(e.target.value)
                    setSubBlockMeterError('')
                }}
                error={!!subBlockMeterError}
                helperText={subBlockMeterError}
                sx={{width:400}}> 
                    {
                        subMeter.map((meter)=>(
                            <MenuItem key={meter.id} value={meter.subblockmetername}>{meter.subblockmetername}</MenuItem>
                        ))
                    }
                
                </TextField><br /><br />
                <TextField 
                sx={{width:400}}
                label="Sub Meter Name"
                value={submetername}
                onChange={(e)=>{
                  setSubMeterName(e.target.value)
                  setSubMeterError('')
                 }} 
                error={!!subMeterError}  
                helperText={subMeterError}
                >
               
                </TextField><br /><br />
                <TextField 
                value={readingunits}
                label="Reading Units"
                onChange={(e)=>{
                    setReadingUnits(e.target.value)
                    setReadingError('')
                }}
                error={!!readingError}
                helperText={readingError}
                sx={{width:400}}
                >
                
                </TextField><br /><br />
                <Button sx={{width:400}} onClick={handsAddmeter} variant="contained" color="primary">ADD</Button>
                {dublicateError && <Typography color="red" sx={{ marginTop: 2 }}>{dublicateError}</Typography>}
                {successMessage && <Typography color="green" sx={{ marginTop: 2 }}>{successMessage}</Typography>}
            </CardContent>
        </Card>
    )
}
export default AddSubMeter