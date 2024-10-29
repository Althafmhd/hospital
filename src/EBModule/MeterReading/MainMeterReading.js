import React, { useState ,useEffect, useRef} from 'react'
import { 
    TextField,
    Button,
    Card,
    MenuItem, 
    Box, 
    CardContent, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
    TableBody, 
    Table,
    Typography,  
} from '@mui/material'

import { listdata,AddMreadingvalue,getReading,resetReading,getLastentryReading,getMeterReading} from '../services/OPBlockService'

const LOAD_SIZE = 5; 
const MainMeterReading=({date,derror,dsetError})=>{
    const [meter,setMeter]=useState([])
    
    const [mainmetername,setMmtername]=useState('');
    const [readingunits,setrValue]=useState('');
    const [todayunits,setTodayReading]=useState('')
    const [yesterdayreadingunits,setYesterdayReading]=useState('')

    const [mainMeterReading, setMainMeterReading]=useState([]);


    const [reading,setReading]=useState(null)
    const [error, setError] = useState('');
    const [merror, setmError]= useState('');
    const [dublicateError,setDublicateError]=useState('');
    const[readingmeter,setReadingmeter]=useState([])

    const[showTable,setShowTable]=useState(false)

    const [loadedReadings, setLoadedReadings] = useState([]);
    
    const loadingRef= useRef(null)

    useEffect(() => {
        const fetchMeters = async () => {
            try {
                const response = await listdata();
                setMeter(response.data);
               
            } catch (error) {
                console.error(error);
            }
        };
        fetchMeters();
    }, []);

    
       
    
    
    useEffect(()=>{
        setLoadedReadings(readingmeter.slice(0,LOAD_SIZE))
    },[readingmeter])

    const handsMetername = async (e) => {
        const selectedValue = e.target.value; // Capture the input value
        setMmtername(selectedValue);
        setmError('');
    
        try {
            // Get the reading based on the selected value
            const rvalueresponse = await getReading(selectedValue);
            if (rvalueresponse.data && rvalueresponse.data.readingunits !== undefined) {
                //console.log("RValue:", rvalueresponse.data.readingunits);
                setReading(rvalueresponse.data.readingunits);

                const a=rvalueresponse.data.readingunits
                setYesterdayReading(a);
            } 
            else{
                setmError('Failed to fetch reading units')
            }
          
       
        } catch (error) {
            console.error("Error fetching readings:", error);
            setmError('An error occurred while fetching readings.');
        }
    };

    
    const submitValue=async (event)=>{
        event.preventDefault();
       // console.log(reading)
        const numericRValue = parseFloat(readingunits);

        const today = new Date();
        today.setHours(12, 0, 0, 0); // Set to the start of today for accurate comparison

        const selectedDate = new Date(date); 

        if(readingunits === ''  &&  mainmetername === '' && date === '' ){
            setError('Reading Value cannot be empty');
            setmError('Meter name must be selected');
            dsetError('date cannot be empty')
            return;
        }
        else if(reading !== null && numericRValue < reading){
            setError('Reading value is invalid' +reading)
        }
        else if(isNaN(readingunits) || readingunits === '' ){
            setError('Reading Value cannot be empty');
            return;
        }
        else if(mainmetername === ''){
            setmError('Meter name must be selected');
            return;
        }
       
        else if(date === ''){
            dsetError('date cannot be empty')
            return 
        }
       
        else if(selectedDate > today){
            dsetError('date cannot be invalid ');
            return
        }
       
        
        else{
           // console.log(readingunits)
            //console.log(date)
            //console.log(mainmetername)
         
            const newTodayReading = reading === null ? numericRValue : numericRValue - reading;
           // console.log(newTodayReading)
            setTodayReading(newTodayReading);

            try{
                const Reading = await  getMeterReading();
                const isDuplicate = Reading.data.some(reading => reading.mainmetername === mainmetername && reading.date === date);

                if(isDuplicate){
                    setDublicateError("This meter today reading units is already exist ")
                    return;
                }
            
            }
            catch(error){
                
            }

            const mreading={date,readingunits:numericRValue,mainmetername,todayunits:newTodayReading}
            const readingset={date,readingunits,mainmetername}
            const readingValue={readingunits:numericRValue,mainmetername,todayunits:newTodayReading,yesterdayreadingunits}
            try {
                // Add the reading value
                const readresponse = await AddMreadingvalue(mreading);
                //console.log(readresponse.data); // Check the response from the server
                
                const resetResponse= await resetReading(readingset);
                //console.log(resetResponse.data)
                // Update the state for displaying the readings
                setReadingmeter(prevState => [...prevState, readingValue]);
                setShowTable(true); // Show the table after successful submission
        
                // Reset form fields
                setMmtername('');
                setrValue('');
              
                dsetError('');
                setError('');
                setmError('');
                setDublicateError('')
                dsetError('');
            } catch (error) {
                console.error('Error adding reading value:', error);
            }
        }
       
        
    }
    const loadMoreReadings = () => {
        if (loadedReadings.length < readingmeter.length) {
            const newLoadedReadings = readingmeter.slice(0, loadedReadings.length + LOAD_SIZE);
            setLoadedReadings(newLoadedReadings);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadMoreReadings();
            }
        });
        if (loadingRef.current) {
            observer.observe(loadingRef.current);
        }
        return () => {
            if (loadingRef.current) {
                observer.unobserve(loadingRef.current);
            }
        };
    }, [loadingRef, loadedReadings, readingmeter]);
    
    return (
        <Box>
        <Card sx={{ background :'transparent', width:"800px" }}> <br />
            <CardContent sx={{display: 'flex', justifyContent:'center'}}> &nbsp;&nbsp;
                <form onSubmit= {submitValue}>
                    
                    <TextField
                        id="meter-name"
                        name="meterName"
                        select
                        label='Meter Name'
                        value={mainmetername}
                        onChange={handsMetername}
                        sx={{width : 200}}
                        error={!!merror}
                        helperText={merror}
                        
                    >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {
                        meter.map((meters)=>(
                            <MenuItem 
                            key={meters.id} 
                            value={meters.mainmetername}
                            >
                                {meters.mainmetername}
                            </MenuItem>
                        ))
                    }
                    </TextField> &nbsp;&nbsp;&nbsp;&nbsp;
                    <TextField 
                        id="reading-value"
                        name="readingValue"
                        label="Reading Value"
                        type="number" 
                        value={readingunits} 
                        onChange={(e)=>{
                            setrValue(e.target.value);
                            setError('');
                        }} 
                        sx={{width:200}} 
                        error={!!error} 
                        helperText={error}
                    >
                    </TextField> &nbsp;&nbsp;&nbsp;&nbsp;
            
                    <Button type="submit" sx={{width :100}} variant="contained" color="primary">ADD</Button>
                    {dublicateError && <Typography  style={{color :'red'}}>{dublicateError}</Typography>}
                </form><br />
                
            </CardContent>
        </Card> <br />
        { showTable && (
            <>
                <TableContainer>
                    <Table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell sx={{ fontWeight: 'bold' }} style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center'>Main Meter Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center'>Total Reading value</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center'>Yesterday Reading value</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center'>Today Reading value</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                            readingmeter.map((reading,index)=>(
                                <TableRow key={index}>
                                    <TableCell style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center'>{reading.mainmetername}</TableCell>
                                    <TableCell style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center'>{reading.readingunits}</TableCell>
                                    <TableCell style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center'>{reading.yesterdayreadingunits}</TableCell>
                                    <TableCell style={{ border: '1px solid black', borderCollapse: 'collapse' }} align ='center' >{reading.todayunits}</TableCell>
                                </TableRow>
                            ))}
                            
                        </TableBody>
                    </Table>
                </TableContainer>
                <div ref={loadingRef} style={{ height: '20px', margin: '20px 0' }} />
            </>
            
        )}
        </Box>   
    );
};
export default MainMeterReading