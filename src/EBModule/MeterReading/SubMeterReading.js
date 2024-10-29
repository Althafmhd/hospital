import { Box, Card, CardContent, MenuItem, TableContainer,Table, TableHead, TextField, Typography, TableRow, TableCell, TableBody, Button } from '@mui/material'
import React from 'react'
import { useState ,useEffect} from 'react'
import { listdata ,getlistdata , getSubMeter ,getSubMeterLastReading, subMeterReading , subMeterReset,getSubMeterReading} from '../services/OPBlockService'
const SubMeterReading=({  date, derror,dsetError})=>{
    const [meters, setMeters]=useState([])
    const [mainmetername ,setMainMeterName]=useState('')
    const [filterSubBlockMeterName,setFilterSubBlockMeterName]=useState([])
    const [subblockmetername, setSubBlockMeterName]=useState('')
    const [filterSubMeterName,setFilterSubMeterName]=useState([])
    const [submetername,setSubMeterName]=useState('')
    const [readings,setReadings]=useState({})
    const[yesterdayReadingUnits,setYesterdayReadingUnits]=useState(0);
    const[todayunits,setTodayUnits]=useState('')

    const [readingTable,setReadingTable]=useState({})

    const [dublicateError,setDublicateError]=useState('')

    const [readingsError, setReadingsError]=useState('')

    const [isEnableSubMeterTable ,setIsEnableSubMeterTable]=useState(false)

    
    useEffect(()=>{
        const fetchMeter=async ()=>{
            try{
                const response = await listdata();
                setMeters(response.data)
            }
            catch(error){
                console.log(error)
            }
        }
        fetchMeter();
    })

    const handleMainMeterName=async (e)=>{
        const selectedMainMeterName=e.target.value;
        setMainMeterName(selectedMainMeterName);
        setSubBlockMeterName(''); 
        setReadings({});
        setFilterSubMeterName([]);
        try{
            const response= await getlistdata();
            const filltered= response.data.filter((meter)=> (meter.mainmetername.trim() === selectedMainMeterName.trim()));
            setFilterSubBlockMeterName(filltered)
        }
        catch(error){
            console.log(error)
        }
    };

    const handleSubBlockMeteNameChange= async (e) =>{
        const selectedSubBlockMeterName= e.target.value;
        setSubBlockMeterName(selectedSubBlockMeterName);
        setReadings({}); 

        try{
            const response =await getSubMeter()
            const filltered =response.data.filter((meter)=>(meter.subblockmetername.trim() === selectedSubBlockMeterName.trim()))
            setFilterSubMeterName(filltered);
            setIsEnableSubMeterTable(true);
        }
        catch(error){
            console.log(error);
        }
    };


    const handleReadingChange =async (index,value) =>{
        const readingUnits= value === '' ? '' : Number(value)
        setReadings((prevReadings) =>({...prevReadings, [index]: readingUnits,}))
        setReadingsError((prevErrors)=>({...prevErrors ,[index]:''}))
    };

    const ValidateInputs=(index,numericReadingUnits)=>{
        const today=new Date();
        today.setHours(12, 0, 0, 0);
        const selectedDate = new Date(date);
        //console.log(today);
        if (numericReadingUnits === undefined || numericReadingUnits === '' ||  isNaN(numericReadingUnits)) {
            setReadingsError((prevErrors) => ({
                ...prevErrors,
                [index]: 'Reading cannot be empty.',
            }));
            return false;
        }
        
        if(date === ''){
            dsetError('date cannot be empty')
            return false;
        }
        if(selectedDate > today){
            dsetError('date is invalid  Cannot select a future date.')
            return false;
        }
        return true;
        
    };

    const handleAddReading=async (index) =>{
        const subMeterName= filterSubMeterName[index].submetername;
        setSubMeterName(subMeterName)
        
        const numericReadingUnits= parseFloat(readings[index]);

        if(!ValidateInputs(index,numericReadingUnits)) return;


        try{
           const response = await getSubMeterLastReading(subMeterName)
           const lastReading=response.data?.readingunits || 0;
           setYesterdayReadingUnits(lastReading)

           if(numericReadingUnits < lastReading){
            setReadingsError((prevErrors) =>({
                ...prevErrors,
                [index]:'Reading value is not valid It Cannot be less than the previous day reading value'
            }));
            return;
           }

           const newTodayReading =lastReading === 0 ? numericReadingUnits : numericReadingUnits - lastReading;
           setTodayUnits(newTodayReading)

           const subReading = await getSubMeterReading();
           const isDuplicate = subReading.data.some(reading => reading.submetername === subMeterName && reading.date === date);

           if(isDuplicate){
               setDublicateError(prevErrors => {
                   const newErrors = [...prevErrors];
                   newErrors[index] = 'This meter today reading units already exist';
                   return newErrors;
               });
               return;
           }else {
               setDublicateError(prevErrors => {
                   const newErrors = [...prevErrors];
                   newErrors[index] = ''; // Clear error if no duplicate
                   return newErrors;
               });
           }

           const  readingData ={date, mainmetername ,subblockmetername,submetername:subMeterName,readingunits:numericReadingUnits, todayunits:newTodayReading}
           await subMeterReading( readingData)

           

           await subMeterReset({date,mainmetername ,subblockmetername,submetername:subMeterName,readingunits:numericReadingUnits})

           setReadingTable((prev)=> ({
                ...prev,
                [index]:{
                    readingunits : numericReadingUnits,
                    yesterdayReadingUnits : lastReading,
                    todayunits : newTodayReading
                },
           }))

           setReadings((prevReadings) => ({
            ...prevReadings,
            [index]:''
           }));

           setReadingsError((prevErrors) =>({ ... prevErrors, [index]: ''}))
        }
        catch(error){
            console.log(error)
        }
    };

    return (
        <Box>
            <Card sx={{ background :"transparent",display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
                <CardContent>
                    <Typography variant='h4'>Sub Meter Reading </Typography><br />
                    <TextField 
                    select
                    sx={{width :400}}
                    label="Main Meter Name"
                    value={mainmetername}
                    onChange={handleMainMeterName}>
                        {
                            meters.map((meter)=>(
                                <MenuItem key={meter.id} value ={meter.mainmetername}>{meter.mainmetername}</MenuItem>
                            ))
                        }

                    </TextField><br /><br />
                    <TextField
                    select
                    sx={{width :400}}
                    label="Sub Block Meter Name"
                    value={subblockmetername}
                    onChange={handleSubBlockMeteNameChange}
                    >
                        {
                            filterSubBlockMeterName.map((meter)=>(
                                <MenuItem key ={meter.id} value={meter.subblockmetername}>{meter.subblockmetername}</MenuItem>
                            ))
                        }

                    </TextField>
                </CardContent>
            </Card>
            { isEnableSubMeterTable && (<TableContainer>
                <Table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
                    <TableHead> 
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell  sx={{ fontWeight: 'bold' }} style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center'>Sub Meter</TableCell>
                            <TableCell  sx={{ fontWeight: 'bold' }} style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center'>Today Reading Units </TableCell>
                            <TableCell  sx={{ fontWeight: 'bold' }} style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center'>Action</TableCell>
                            <TableCell  sx={{ fontWeight: 'bold' }} style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center'>Today Reading Units</TableCell>
                            <TableCell  sx={{ fontWeight: 'bold' }}style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center'>Yesterday Reading Units</TableCell>
                            <TableCell  sx={{ fontWeight: 'bold' }}style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center'>Today Units</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { filterSubMeterName && filterSubMeterName.length >0 ? (
                            filterSubMeterName.map((meter,index)=>(
                                <TableRow key={index}>
                                    <TableCell style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center'>{meter.submetername}</TableCell>
                                    <TableCell style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center'>
                                        <TextField 
                                            type="number"
                                            value={readings[index] !==undefined ? readings[index] : ''}
                                            onChange={(e) =>{
                                                handleReadingChange(index,e.target.value)
                                            }}
                                            variant ="outlined"
                                            error ={!!readingsError[index]}
                                            helperText={readingsError[index]}
                                        >

                                        </TextField>
                                    </TableCell>
                                    <TableCell style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center'>
                                        <Button onClick={()=> handleAddReading(index)} variant="contained" color="primary" >ADD</Button>
                                        {dublicateError[index] && <Typography style={{color :'red'}} >{dublicateError[index]}</Typography>}
                                    </TableCell>
                                    <TableCell style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center'>{readingTable[index]?.readingunits || 0}</TableCell>
                                    <TableCell style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center'>{readingTable[index]?.yesterdayReadingUnits || 0}</TableCell>
                                    <TableCell style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center'>{readingTable[index]?.todayunits || 0}</TableCell>
                                </TableRow>
                            ))
                        ):(
                            <TableRow>
                                <TableCell colSpan={6} align="center" style={{ border: '1px solid black', borderCollapse: 'collapse' }}>No Sub Meters Available</TableCell>
                            </TableRow>
                        )
                            
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            )}
        </Box>
    )
}
export default SubMeterReading;