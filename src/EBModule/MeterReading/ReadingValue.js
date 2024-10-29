import React ,{ useState,useEffect } from 'react'
import {
    Table,
    TableCell, 
    TableContainer, 
    Box,
    TableHead, 
    TableRow ,
    Card, 
    TableBody, 
    TextField,
    Button, 
    MenuItem,
    Typography,
 
} from '@mui/material'

import { 
    listdata,
    getlistdata,
    AddSubBlockMeterReadingValue , 
   
    subBlockMeterReadingReset,
    getLastEntryResetSubBlockMeterReading,
    getSubBlockReading

} from '../services/OPBlockService'

const ReadingValue=({  date, derror,dsetError}) => {
    
    const [meter,setMeter]=useState([])
    const [mainmetername,setMmetername]=useState('')
    const [smeter,setSubmeter]=useState([])
    const [subblockmetername,setSubBlockMeterName]=useState('')
    const [reading,setReadings]=useState({})
    const [yReading,setYreading]=useState(0)
    const [todayunits,setTrsvalue]=useState('')
    const [dublicateError, setDublicateError]=useState('');
    const [readingTable,setReadingTable]=useState({})
    
    const [isEnableSubBlockMeterTable ,setIsEnableSubBlockmeterTable]=useState(false);

    const [rserror,setRserror]=useState({})

    useEffect(()=>{
        const fetchData = async () => {
            try {
                const meterResponse = await listdata();
                setMeter(meterResponse.data);
               // console.log(meterResponse.data)
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    } ,[])

    const meterNameChange= async (e) =>{
        const selectedMeterName=e.target.value
        setMmetername(selectedMeterName)
        
        try {
            const response = await getlistdata();
            const filtered = response.data.filter((item) => (item.mainmetername.trim() === selectedMeterName.trim()));
            setSubmeter(filtered);
            setIsEnableSubBlockmeterTable(true)
        } catch (error) {
            console.error(error);
        }
        
    };



    const handleInputChange = async(index, value) => {
        const numericValue = value === '' ? '' : Number(value);
        setReadings((prevReadings) => ({ ...prevReadings, [index]: numericValue, }));
        
        setRserror((prevErrors) => ({ ...prevErrors, [index]: '' }));
    };

    const validateInputs =(index ,numericRValue) =>{
        const today = new Date();
        today.setHours(12, 0, 0, 0); // Set to the start of today for accurate comparison

        const selectedDate = new Date(date); 
        //console.log(selectedDate)
        //console.log(today);
        if (numericRValue === undefined || numericRValue === '' ||  isNaN(numericRValue)) {
            setRserror((prevErrors) => ({
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
            dsetError('date cannot invalid');
            return false;
        }
        return true;
    }

    const handleAddReading = async (index) => {
        const subBlockMeterName= smeter[index].subblockmetername;
        setSubBlockMeterName(subBlockMeterName)
   
        const numericRValue = parseFloat(reading[index]);

        if(!validateInputs(index ,numericRValue)) return ;
       

        try{
            const responseRead=await getLastEntryResetSubBlockMeterReading(subBlockMeterName)
            //console.log(responseRead.data)
            const lastReading = responseRead.data?.readingunits || 0;
            //console.log(lastReading)
            setYreading(lastReading);
          
 
           
          
            if (numericRValue < lastReading){
                setRserror((prevErrors) => ({
                    ...prevErrors,
                    [index]: 'Reading value is not valid. It cannot be less than the previous day reading value.'
                }));
                return;
            }

            const newTodayReading = lastReading === 0 ? numericRValue : numericRValue - lastReading;
            setTrsvalue(newTodayReading);

            const subBlockMeterReading= await getSubBlockReading();
            const isDuplicate = subBlockMeterReading.data.some(reading => reading.subblockmetername === subBlockMeterName && reading.date === date);

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

        
            const readingsData = { subblockmetername:subBlockMeterName, readingunits:numericRValue, mainmetername, date, todayunits:newTodayReading};
            //console.log(readingsData);

            const readingsResponse=await AddSubBlockMeterReadingValue(readingsData)
           // console.log(readingsResponse.data)
            await subBlockMeterReadingReset({date,mainmetername,subblockmetername:subBlockMeterName,readingunits:numericRValue})
           
            setReadingTable((prev) =>({
                ...prev,
                [index]:{
                    readingunits:numericRValue,
                    yReading:lastReading,
                    todayunits:newTodayReading,
                },
            }))
        
           

            setReadings((prevReadings) => ({
                ...prevReadings,
                [index]: '', // Reset the reading for this index
            }));

            setRserror((prevErrors) => ({ ...prevErrors, [index]: '' }));
            dsetError('');
        }
        catch(error){
            console.error(error)
        }
       
    };
     
    return (
        <Box>
       
        <Card sx={{
            background :"transparent",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',      
        }}> <br />
            <form>
                <Typography variant='h4'>Sub Block Meter Reading</Typography><br /> 
                <TextField 
                id="main-meter-name"
                name="mainMeterName"
                label="Main Meter Name" 
                select 
                sx={{width : 500}}
                value={mainmetername} 
                onChange={meterNameChange}
                
                >
                    {
                        meter.map((meter)=>(
                            <MenuItem key={meter.id} value={meter.mainmetername}>{meter.mainmetername}</MenuItem>
                        ))
                    }
                </TextField><br /><br />
              
            </form><br />
           
        </Card>
        {isEnableSubBlockMeterTable && (<TableContainer>
            <Table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                       
                        <TableCell  sx={{ fontWeight: 'bold' }} style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center'>Sub Block Meter Name</TableCell>
                        <TableCell  sx={{ fontWeight: 'bold' }} style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center'>Today Reading Units</TableCell>
                        <TableCell  sx={{ fontWeight: 'bold' }} style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center'>Action</TableCell>
                        <TableCell  sx={{ fontWeight: 'bold' }} style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center'>Today Reading Units</TableCell>
                        <TableCell  sx={{ fontWeight: 'bold' }} style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center'>Yesterday Reading Units</TableCell>
                        <TableCell  sx={{ fontWeight: 'bold' }} style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center'>Today Units</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody> 
                    {   smeter && smeter.length >0 ? (
                        smeter.map((meter,index)=>(
                            <TableRow key={index}>
                               
                                <TableCell style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center'>{meter.subblockmetername}</TableCell>
                                <TableCell style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center'>
                                    <TextField 
                                       type='number'
                                       value={reading[index] !== undefined ? reading[index] : ''}
                                       onChange={(e) => { 
                                        handleInputChange(index, e.target.value)
                                        setRserror('')}}
                                       variant="outlined"
                                       error={!!rserror[index]} 
                                       helperText={rserror[index]}
                                    />
                                
                                </TableCell>
                                <TableCell style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center'>
                                    <Button onClick={() => handleAddReading(index)} variant="contained" color="primary">Add</Button>
                                    {dublicateError[index] && <Typography style={{color :'red'}} >{dublicateError[index]}</Typography>}
                                </TableCell>
                                <TableCell style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center'>{readingTable[index]?.readingunits || 0}</TableCell>
                                <TableCell style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center'>{readingTable[index]?.yReading || 0}</TableCell>
                                <TableCell style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center'>{readingTable[index]?.todayunits || 0}</TableCell>
                            </TableRow>
                        )) 
                    ) :(
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
export default ReadingValue