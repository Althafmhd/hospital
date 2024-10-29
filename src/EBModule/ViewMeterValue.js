import { Table, TableBody, TableContainer, TableHead, TableRow ,TextField, Card , Button, Typography, MenuItem ,Grid, Box, CardContent} from '@mui/material';
import React, { useEffect } from 'react'


import TableCell from '@mui/material/TableCell';
import { useState } from 'react';
import { getDate, getMonth,getYear,getDateRange,listdata,getSubDateRange,getSubMonth,getSubDate ,getlistdata,getSubMeter,getByDateRangeSubMeterReading, getByMonthSubMeterReading,getSubYear,getByYearSubMeterReading,getByDateSubMeterReading} from './services/OPBlockService'

  
const ViewMeterValue=()=>{

    const [meters,setMeter]=useState([]) // meter name 
    const [mainmetername,setMainMeterName]=useState('')//select meter name
    const [subBlockMeterName,setSubBlockName]=useState([])
    const [subMeterName,setSubMeterName]=useState([])
    const [month ,setMonth]=useState('')
    const [years,setYears]=useState('')
    const [monthMainMeter,setMonthMainMeter]=useState([]);
    const [monthSubBlockMeter,setMonthSubBlockMeter]=useState([]);
    const [monthSubMeter,setMonthSubMeter]=useState([])
    const [year,setYear]=useState('');
    const [yearMainMeter,setYearMainMeter]=useState([]);
    const [yearSubBlockMeter,setYearSubBlockMeter]=useState([]);
    const [yearSubMeter,setYearSubMeter]=useState([])
    const [date,setDate]=useState('')
    const [dateMainMeter,setDateMainMeter]=useState([]);
    const [dateSubBlockMeter,setDateSubBlockMeter]=useState([])
    const [dateSubMeter,setDateSubMeter]=useState([])
    const [startdate,setStartDate]=useState('');
    const [enddate,setEndDate]=useState('');
    const [dateRangeMainMeter,setDateRangeMainMeter]=useState([])
    const [dateRangeSubBlock,setDateRangeSubBlock]=useState([])
    const [dateRangeSubMeter,setDateRangeSubMeter]=useState([])


    const [totalMainMeter,setTotalMainMeter]=useState(0);
    const [totalSubBlockMeterTodayUnitsPerDay,setTotalSubBlockMeterTodayUnitsPerDay]=useState([])
    const [totalSubBlockMeterTodayUnits,setTotalSubBlockMeterTodayUnits]=useState([])
    const [totalSameSubBlockMeterTodayUnits,setTotalSameSubBlockMeterTodayUnits]=useState([])
    const [totalSameSubMeterTodayUnits,setTotalSameSubMeterTodayUnits]=useState([])
    const [monthIsennable ,setMonthIsennable]=useState(false);
    const [dateIsennable,setDateIsennable]=useState(false);
    const [yearIsennable,setYearIsennable]=useState(false);
    const [dateragIsennable,setDateragIsennable]=useState(false);

    const [mainMeterNameError,setMainMeterNameError]=useState('')
    const [viewError,setViewError]=useState('')

    const metername=mainmetername;
  
    //mainmeter
    useEffect(()=>{
        const fetchMeterName=async()=>{
            try{
                const meterNameResponse=await listdata()
                setMeter(meterNameResponse.data)
            }
            catch(error){
                console.error(error)
            }
        };
        fetchMeterName()
    },[]);
    

    //meter name get in database
    const handleMeterChange= async (e)=>{
        const selectedMeterName=e.target.value;
        setMainMeterName(selectedMeterName); 
        setMainMeterNameError('');
        try{
            // get subblockmetername 
            const responseSubBlockMeter= await getlistdata();
            const filteredMeter=responseSubBlockMeter.data.filter((meter)=>(meter.mainmetername.trim() === selectedMeterName.trim()))
            setSubBlockName(filteredMeter)


            //get submetername
            const responseSubMeter =await  getSubMeter();
            const filterSubMeter=responseSubMeter.data.filter((meter)=>(meter.mainmetername.trim() === selectedMeterName.trim()))
            setSubMeterName(filterSubMeter)
            console.log(filterSubMeter)
        }
        catch(error){

        }
    } 


    //validate function 
    const validateData=()=>{
        
        setViewError('')
        if(mainmetername === ''){
            setMainMeterNameError('main metertname cannot be empty');
            return false;
        }
        if (!date && !month  && !year && !(startdate && enddate)) {
            setViewError('At least one of the following must be provided: date, month, year, or both start date & end date.');
            return false;
        }
        return true;
    }

    

    const viewByMonthMeterReading= async ()=>{

        //main meter reading units
        const monthMainMeterResponse= await getMonth(month,years)
        const filterMainMeterResponse = monthMainMeterResponse.data.filter((item) =>item.mainmetername.trim() === mainmetername )
        //console.log(filterMainMeterResponse);
        setMonthMainMeter(filterMainMeterResponse);
        
        //subblockmeter reading units
        const monthSubBlockMeterResponse= await getSubMonth(month,years)
        const filterSubBlockMeterResponse=monthSubBlockMeterResponse.data.filter((item) => item.mainmetername.trim()=== mainmetername)
        setMonthSubBlockMeter(filterSubBlockMeterResponse)
        //console.log(filterSubBlockMeterResponse)

        //submeter reading units
        const monthSubMeterResponse =await getByMonthSubMeterReading(month,years)
        const filterSubMeterResponse=monthSubMeterResponse.data.filter((read)=>(read.mainmetername.trim() === mainmetername))
        setMonthSubMeter(filterSubMeterResponse);

        setMonthIsennable(true);

        //Main Meter Total Units
        const calculateTotalMainMeterTodayReading = (data) => {
            return data.reduce((acc, item) => acc + (parseFloat(item.todayunits) || 0), 0);
        };
        const val=calculateTotalMainMeterTodayReading(filterMainMeterResponse)
        setTotalMainMeter(val) 
        //console.log(val)


        //Sub Block one day units caluculation
        const todayUnitsSubBlockMeterSum = filterSubBlockMeterResponse.reduce((acc, week) => {
            // Accumulate the sum of todayunits for each day
            if (!acc[week.date]) {
                acc[week.date] = 0; // Initialize it if it doesn't
            }
            // Accumulate the sum of todayunits for each day
            acc[week.date] += (week.todayunits || 0);
            return acc;
        }, {});

        console.log(todayUnitsSubBlockMeterSum)
        setTotalSubBlockMeterTodayUnitsPerDay(todayUnitsSubBlockMeterSum)

        
        //Total Sub Block Reading value 
        const totalSubBlockTodayUnits = Object.values(todayUnitsSubBlockMeterSum).reduce((total, num) => total + num ,0);
        setTotalSubBlockMeterTodayUnits(totalSubBlockTodayUnits)
        console.log(totalSubBlockTodayUnits);
        


        //Per Sub Block Meter total units 
        const sameSubBlockMeterName= filterSubBlockMeterResponse.reduce((acc,meter) =>{
            const meterName=meter.subblockmetername;
            acc[meterName]=(acc[meterName] || 0) + (meter.todayunits || 0);
            return acc;
        } , {});
        console.log(sameSubBlockMeterName)
        setTotalSameSubBlockMeterTodayUnits(sameSubBlockMeterName)


        //Per Sub Meter total Units 
        const sameSubMeter= filterSubMeterResponse.reduce((acc,meter) =>{
            const meterName=meter.submetername;
            acc[meterName]=(acc[meterName] || 0) + (meter.todayunits || 0);
            return acc;
        } ,{})
        console.log(sameSubMeter)
        setTotalSameSubMeterTodayUnits(sameSubMeter)
      
    }

    //value get by year 
    const viewByYearMeterReading= async ()=>{

        //value get by year in database meter 
        const yearresponse=await getYear(year)
        const filterresponse = yearresponse.data.filter((item) => item.mainmetername.trim() === mainmetername) 
        setYearMainMeter(filterresponse);
        console.log(filterresponse)

        //value get by year in database subblockmeter
        const yearSubBlockMeterReponse =await getSubYear(year);
        const filterSubBlockMeterResponse=yearSubBlockMeterReponse.data.filter((read) =>(read.mainmetername.trim() === mainmetername.trim()))
        setYearSubBlockMeter(filterSubBlockMeterResponse)

        //value get by year in database submeter
        const yearSubMeterResponse= await getByYearSubMeterReading(year)
        const filterSubMeterResponse=yearSubMeterResponse.data.filter((meter) =>(meter.mainmetername.trim() === mainmetername))
        setYearSubMeter(filterSubMeterResponse)
        setYearIsennable(true);

        //Main Meter Total Units
        const calculateTotalMainMeterTodayReading = (data) => {
            return data.reduce((acc, item) => acc + (parseFloat(item.todayunits) || 0), 0);
        };
        const val=calculateTotalMainMeterTodayReading(filterresponse)
        setTotalMainMeter(val) 
        console.log(val)


        //Sub Block one day units caluculation
        const todayUnitsSubBlockMeterSum = filterSubBlockMeterResponse.reduce((acc, week) => {
            // Accumulate the sum of todayunits for each day
            if (!acc[week.date]) {
                acc[week.date] = 0; // Initialize it if it doesn't
            }
            // Accumulate the sum of todayunits for each day
            acc[week.date] += (week.todayunits || 0);
            return acc;
        }, {});

        console.log(todayUnitsSubBlockMeterSum)
        setTotalSubBlockMeterTodayUnitsPerDay(todayUnitsSubBlockMeterSum)

        
        //Total Sub Block Reading value 
        const totalSubBlockTodayUnits = Object.values(todayUnitsSubBlockMeterSum).reduce((total, num) => total + num ,0);
        setTotalSubBlockMeterTodayUnits(totalSubBlockTodayUnits)
        console.log(totalSubBlockTodayUnits);
        


        //Per Sub Block Meter total units 
        const sameSubBlockMeterName= filterSubBlockMeterResponse.reduce((acc,meter) =>{
            const meterName=meter.subblockmetername;
            acc[meterName]=(acc[meterName] || 0) + (meter.todayunits || 0);
            return acc;
        } , {});
        console.log(sameSubBlockMeterName)
        setTotalSameSubBlockMeterTodayUnits(sameSubBlockMeterName)


        //Per Sub Meter total Units 
        const sameSubMeter= filterSubMeterResponse.reduce((acc,meter) =>{
            const meterName=meter.submetername;
            acc[meterName]=(acc[meterName] || 0) + (meter.todayunits || 0);
            return acc;
        } ,{})
        console.log(sameSubMeter)
        setTotalSameSubMeterTodayUnits(sameSubMeter)
    }

    //value get by value in database using date
    const viewByDateMeterReading=async()=>{

        // value get by database using mainmetername
        const datereponse=await getDate(date)
        const filterResponse=datereponse.data.filter((item) => item.mainmetername === mainmetername)
        //console.log(filterResponse)
        setDateMainMeter(filterResponse); 

        // value get by database using subBlockmetername
        const dateResponse=await getSubDate(date)
        const filterresponse =dateResponse.data.filter((meter)=>(meter.mainmetername === mainmetername))
        setDateSubBlockMeter(filterresponse);
        //console.log(filterresponse)

        // value get by database using submetername
        const dateSubMeterResponse = await getByDateSubMeterReading(date)
        const filterSubMeterResponse = dateSubMeterResponse.data.filter((meter)=>(meter.mainmetername.trim() === mainmetername.trim()))
        setDateSubMeter(filterSubMeterResponse)
        setDateIsennable(true);


        //main meter total units
        const calculateTotalMainMeterTodayReading = (data) => {
            return data.reduce((acc, item) => acc + (parseFloat(item.todayunits) || 0), 0);
        };
        const val=calculateTotalMainMeterTodayReading(filterResponse)
        setTotalMainMeter(val) 
        //console.log(val)

        //total subblockmeter units perday
        const todayUnitsSubBlockMeterSum = filterresponse.reduce((acc, week) => {
            // Accumulate the sum of todayunits for each day
            if (!acc[week.date]) {
                acc[week.date] = 0; // Initialize it if it doesn't
            }
            // Accumulate the sum of todayunits for each day
            acc[week.date] += (week.todayunits || 0);
            return acc;
        }, {});

        //console.log(todayUnitsSubBlockMeterSum)
        setTotalSubBlockMeterTodayUnitsPerDay(todayUnitsSubBlockMeterSum)


        //total subblockmeter units
        const totalSubBlockTodayUnits = Object.values(todayUnitsSubBlockMeterSum).reduce((total, num) => total + num ,0);
        setTotalSubBlockMeterTodayUnits(totalSubBlockTodayUnits)
        console.log(totalSubBlockTodayUnits);

        //Per Sub Block Meter total units 
         const sameSubBlockMeterName= filterresponse.reduce((acc,meter) =>{
            const meterName=meter.subblockmetername;
            acc[meterName]=(acc[meterName] || 0) + (meter.todayunits || 0);
            return acc;
        } , {});
        console.log(sameSubBlockMeterName)
        setTotalSameSubBlockMeterTodayUnits(sameSubBlockMeterName)


        //Per Sub Meter total Units 
        const sameSubMeter= filterSubMeterResponse.reduce((acc,meter) =>{
            const meterName=meter.submetername;
            acc[meterName]=(acc[meterName] || 0) + (meter.todayunits || 0);
            return acc;
        } ,{})
        console.log(sameSubMeter)
        setTotalSameSubMeterTodayUnits(sameSubMeter)
      

    }

    

    // value get by database using week
    const viewByDateRangeMeterReading=async()=>{

        //Main Meter Reading value
        const dateragresponse=await getDateRange(startdate,enddate)
        const filterresponse=dateragresponse.data.filter((item)=> item.mainmetername === mainmetername)
        setDateRangeMainMeter(filterresponse)
        console.log(filterresponse)

        //Sub Block Meter Reading Value
        const weekResponse =await getSubDateRange(startdate,enddate)
        const filterResponse =weekResponse.data.filter((item) => item.mainmetername === mainmetername)
        setDateRangeSubBlock(filterResponse)
        console.log(filterResponse)

        //Sub Meter Reading Value
        const weekResponseSubMeter=await getByDateRangeSubMeterReading(startdate,enddate);
        const filterResponseSubMeter=weekResponseSubMeter.data.filter((read) =>(read.mainmetername === mainmetername))
        console.log(filterResponseSubMeter)
        setDateRangeSubMeter(filterResponseSubMeter)

        setDateragIsennable(true); 

        //Calculation
        //Main Meter Total Units
        const calculateTotalMainMeterTodayReading = (data) => {
            return data.reduce((acc, item) => acc + (parseFloat(item.todayunits) || 0), 0);
        };
        const val=calculateTotalMainMeterTodayReading(filterresponse)
        setTotalMainMeter(val) 
        console.log(val)


        //Sub Block one day units caluculation
        const todayUnitsSubBlockMeterSum = filterResponse.reduce((acc, week) => {
            // Accumulate the sum of todayunits for each day
            if (!acc[week.date]) {
                acc[week.date] = 0; // Initialize it if it doesn't
            }
            // Accumulate the sum of todayunits for each day
            acc[week.date] += (week.todayunits || 0);
            return acc;
        }, {});

        //console.log(todayUnitsSubBlockMeterSum)
        setTotalSubBlockMeterTodayUnitsPerDay(todayUnitsSubBlockMeterSum)

        
        //Total Sub Block Reading value 
        const totalSubBlockTodayUnits = Object.values(todayUnitsSubBlockMeterSum).reduce((total, num) => total + num ,0);
        setTotalSubBlockMeterTodayUnits(totalSubBlockTodayUnits)
        console.log(totalSubBlockTodayUnits);
        


        //Per Sub Block Meter total units 
        const sameSubBlockMeterName= filterResponse.reduce((acc,meter) =>{
            const meterName=meter.subblockmetername;
            acc[meterName]=(acc[meterName] || 0) + (meter.todayunits || 0);
            return acc;
        } , {});
        console.log(sameSubBlockMeterName)
        setTotalSameSubBlockMeterTodayUnits(sameSubBlockMeterName)


        //Per Sub Meter total Units 
        const sameSubMeter= filterResponseSubMeter.reduce((acc,meter) =>{
            const meterName=meter.submetername;
            acc[meterName]=(acc[meterName] || 0) + (meter.todayunits || 0);
            return acc;
        } ,{})
        console.log(sameSubMeter)
        setTotalSameSubMeterTodayUnits(sameSubMeter)
    }

    //view function 
    const handChange= async (e)=>{
       e.preventDefault();

       
       setViewError('')
        if(!validateData()){
            return;
        }
        
       setDateIsennable(false);
       setYearIsennable(false);
       setDateragIsennable(false);
       setMonthIsennable(false); 
       
       
       if(month ){

        await viewByMonthMeterReading();
       }
       else if(year){ 
        await viewByYearMeterReading();
        
       }
       else if(date){
        await viewByDateMeterReading();
       }
       else if(startdate && enddate ){
        await viewByDateRangeMeterReading();
       
       }
       setMonth('')
       setDate('')
       setYear('')
       setStartDate('')
       setEndDate('')
     
       
    }
    return(
        <Box sx={{marginTop: '80px'}}>

            {/* Hospital Name */}
            <Box display="flex" 
                alignItems="center" 
                justifyContent="center" 
                style={{ flexGrow: 1 }} > {/* Set to match Toolbar height */}
               
                <Typography  variant='h4' style={{ color: 'lightblue' }}>
                    LAKSHMI HOSPITALS
                </Typography>
            </Box>
          
            <Typography align='center' variant='h4'>View Meter Reading</Typography><br />
            <Card>
               <CardContent>
                    {/* main meter name */}
                    <Card sx={{background :'transparent',  display: 'flex',  alignItems: 'Right',justifyContent: 'center'}}>
                        <CardContent >
                            <TextField
                                select 
                                sx={{width : 400}}
                                label="Main Meter Name"
                                value={mainmetername}
                                onChange={handleMeterChange}
                                error={!!mainMeterNameError}
                                helperText={mainMeterNameError}
                            >
                                {
                                    meters.map((meter)=>(
                                            <MenuItem key={meter.id} value={meter.mainmetername}>{meter.mainmetername}</MenuItem>
                                    ))
                                }
                            </TextField>
                        </CardContent>
                    </Card><br />
                    
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 20, sm: 20, md: 10 }}>

                        {/* view by date card */}
                        <Grid item>
                            <Card sx={{background :'transparent',  display: 'flex',width :"400px",height:250,  alignItems: 'Right',justifyContent: 'center'}}>
                                <CardContent>
                                    <Typography  variant='h5'>View By Date</Typography><br />
                                    <TextField
                                        type="date"
                                        sx={{width :300}}
                                        value ={date}
                                        onChange ={(e)=>{
                                            setDate(e.target.value) 
                                            setViewError('')
                                        }}
                                    /> <br /><br />  
                                </CardContent>
                
                            </Card> 
                        </Grid>

                         {/* view by week card */}
                        <Grid item>
                            <Card sx={{background :'transparent',  display: 'flex',width :"400px",height:250,  alignItems: 'Right',justifyContent: 'center'}}>
                                <CardContent>
                                    <Typography variant ='h5'>View By Week</Typography><br />
                                    <TextField
                                        type="date"
                                        sx={{width :300}}
                                        value={startdate}
                                        onChange={(e)=>{
                                            setStartDate(e.target.value)
                                            setViewError('')
                                        }}
                                    />  <br />
                                    <Typography align='center'>To</Typography>
                                    <TextField
                                        type="date"
                                        sx={{width :300}}
                                        value={enddate}
                                        onChange={(e)=>{
                                            setEndDate(e.target.value)
                                            setViewError('')
                                        }}
                                    />&nbsp; &nbsp;
                                </CardContent>
                            </Card>
                        </Grid>

                         {/* view by month card */}
                        <Grid item>
                            <Card sx={{background :'transparent',  display: 'flex',width :"400px",height:250,  alignItems: 'Right',justifyContent: 'center'}}>
                                <CardContent>
                                    <Typography variant='h5'>View By Month</Typography><br />
                                    <TextField 
                                        type="month"
                                        sx={{width :300}}
                                        value={month}
                                        onChange={(e)=>{
                                            setMonth(e.target.value)
                                            setViewError('')
                                        }}
                                    /><br /><br />

                                </CardContent>
                            </Card>
                        </Grid>

                         {/* view by month card */}
                        <Grid item>
                            <Card sx={{background :'transparent',  display: 'flex',width :"400px",height:250,  alignItems: 'Right',justifyContent: 'center'}}>
                                <CardContent>
                                    <Typography variant='h5'>View By Year</Typography><br />
                                    <TextField
                                        type="number"
                                        sx={{width :300}}
                                        value={year}
                                        onChange={(e)=>{
                                            setYear(e.target.value)
                                            setViewError('')
                                        }}
                                    /> &nbsp; &nbsp;
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid><br />
                    
                    <Card sx={{background :'transparent',  display: 'flex',  alignItems: 'center' , justifyContent: 'center'}}>
                        <CardContent>
                            <Button onClick={handChange} sx={{width : 400}}  variant="contained" color="primary">View</Button><br /><br /><br />
                            {viewError && <div style={{color :'red'}}>{viewError}</div>}
                        </CardContent>
                    </Card>
                </CardContent>

            </Card>

            {/* view by date table */}
            { dateIsennable && (
                <TableContainer>
                    <Table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                {/* main metername  */}
                                <TableCell colSpan={2} align='center'  sx={{ fontWeight: 'bold' }} style={{ border: '1px solid black', borderCollapse: 'collapse' ,width: '40px' }}>{metername} Main Meter Name</TableCell> 
                                <TableCell sx={{ fontWeight: 'bold' }} style={{ border: '1px solid black', borderCollapse: 'collapse' }}></TableCell>
                                <TableCell colSpan ={subBlockMeterName.length*2 + subMeterName.length *2} sx={{ fontWeight: 'bold' }} style={{ border: '1px solid black', borderCollapse: 'collapse' }} align='center'>{metername} Sub Block Name</TableCell>
                            </TableRow>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                {/* main meter name */}
                                <TableCell colSpan={2} align='center' sx={{ fontWeight: 'bold' }} style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{metername}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} style={{ border: '1px solid black', borderCollapse: 'collapse' }} align='center'>Total Sub</TableCell>
                                {/* subblock meter name */}
                                {subBlockMeterName.map((meter, index) => (
                                    <React.Fragment key={index}>
                                        <TableCell sx={{ fontWeight: 'bold' }}   align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{meter.subblockmetername}</TableCell>
                                    </React.Fragment>
                                ))}
                                {/* sub meter name */}
                                {subMeterName.map((meter,meterIndex) =>(
                                    <React.Fragment key={meterIndex}>
                                        <TableCell sx={{ fontWeight: 'bold' }} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{meter.submetername}</TableCell>
                                    </React.Fragment>
                                ))}
                            </TableRow>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell sx={{ fontWeight: 'bold' }} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Units</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Total Sub</TableCell>
                                {/* subblockmetername equally to colunm display unite */}
                                {subBlockMeterName.map((meter,index) => (
                                    <React.Fragment key={index}>
                                        <TableCell sx={{ fontWeight: 'bold' }} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Units</TableCell>
                                    </React.Fragment>
                                ))} 
                                {/* submetername equally to colunm display unite */}
                                {subMeterName.map((meter,meterIndex)=>(
                                    <React.Fragment key={meterIndex}>
                                        <TableCell sx={{ fontWeight: 'bold' }} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Units</TableCell>
                                    </React.Fragment>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dateMainMeter.map((date,index)=>(
                                <TableRow key={index}>
                                    <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{date.date}</TableCell>
                                    {/* main meter reading */}
                                    <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{date.todayunits}</TableCell>
                                    {/* sub block  meter total today reading units */}
                                    <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{totalSubBlockMeterTodayUnitsPerDay[date.date] || 0}</TableCell>
                                    {/* subblock meter reading */}
                                    {subBlockMeterName.map((meter, meterIndex) => {
                                        // Ensure the sub meter readings exist
                                        const matchingMeter= dateSubBlockMeter.find(m => m.date === date.date && m.subblockmetername === meter.subblockmetername )
                                        return (
                                            <React.Fragment key={meterIndex}>
                                            {/* Adjust the condition to check if the date matches */}
                                                {matchingMeter ? (
                                                    <>
                                                        <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{matchingMeter.todayunits}</TableCell>
                                                    </>
                                                ) : 
                                                    <>
                                                        <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>0</TableCell>
                                                    </>
                                                }
                                            </React.Fragment>
                                        );
                                    })}

                                    {/* sub meter reading */}
                                    {subMeterName.map((meter,meterIndex)=>{
                                        const MatchingMeter = dateSubMeter.find(m => m.date === date.date && m.submetername === meter.submetername)
                                        return(
                                            <React.Fragment key={meterIndex}>
                                                {MatchingMeter ?(
                                                    <>
                                                        <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{MatchingMeter.todayunits}</TableCell>
                                                    </>
                                                ) : 
                                                    <>
                                                        <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>0</TableCell>
                                                    </>
                                                }
                                            </React.Fragment>
                                        );
                                    })}
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }} colSpan={1} >Total Main Meter:</TableCell>
                                {/* total main meter reading */}
                                <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{totalMainMeter}</TableCell>
                                {/* total subblock meter units */}
                                <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{totalSubBlockMeterTodayUnits}</TableCell>
                                
                                {/* specific subblock meter  total units */}
                                {subBlockMeterName.map((subBlock)=> {
                                    const todayUnits = totalSameSubBlockMeterTodayUnits[subBlock.subblockmetername];
                                    return (
                                        <React.Fragment>
                                        { todayUnits   ?(
                                                <>
                                                    <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{todayUnits}</TableCell>
                                                </>
                                            
                                            ): 
                                            <>
                                                <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>0</TableCell>
                                            </>
                                        }
                                        </React.Fragment>
                                    )
                                    
                                    
                                })}

                                {/* specific sub meter  total units */}
                                {subMeterName.map((subBlock)=> {
                                    const todayUnits = totalSameSubMeterTodayUnits[subBlock.submetername];
                                    return (
                                        <React.Fragment>
                                            { todayUnits   ?(
                                                <>
                                                
                                                    <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{todayUnits}</TableCell>
                                                </>
                                                                    
                                            ): 
                                                <>
                                                    <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>0</TableCell>
                                                </>
                                            }
                                        </React.Fragment>
                                    )                  
                                })}
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            { dateragIsennable && (
                <TableContainer>
                    <Table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                {/*MainMeterName*/}
                                <TableCell sx={{ fontWeight: 'bold' }} colSpan={2}  align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{metername} Main Meter</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}  style={{ border: '1px solid black', borderCollapse: 'collapse' }}></TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} colSpan ={subBlockMeterName.length*2 + subMeterName.length *2} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{metername} Sub Block Meter</TableCell>
                            </TableRow>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                {/*MainMeterName*/}
                                <TableCell sx={{ fontWeight: 'bold' }}  colSpan={2}  align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{metername}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Total Sub</TableCell>
                                {/*subBlockMeterName*/}
                                {subBlockMeterName.map((meter, index) => (
                                    <React.Fragment key={index}>
                                        <TableCell sx={{ fontWeight: 'bold' }}  align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{meter.subblockmetername}</TableCell>
                                    </React.Fragment>
                                ))}
                                {/* subMeterName */}
                                {subMeterName.map((meter,meterIndex) =>(
                                    <React.Fragment key={meterIndex}>
                                        <TableCell sx={{ fontWeight: 'bold' }} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{meter.submetername}</TableCell>
                                    </React.Fragment>
                                ))}
                            </TableRow>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell sx={{ fontWeight: 'bold' }} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Units</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Total Sub</TableCell>
                                {/* subBlock Meter Name equal display colunm for units */}
                                {subBlockMeterName.map((meter, index) => (
                                    
                                    <React.Fragment key={index}>
                                        <TableCell sx={{ fontWeight: 'bold' }} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Units</TableCell>
                                    </React.Fragment>
                                ))} 
                                {/* subMeter name equal display colunm for units */}
                                {subMeterName.map((meter,meterIndex)=>(
                                    <React.Fragment key={meterIndex}>
                                        <TableCell sx={{ fontWeight: 'bold' }} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Units</TableCell>
                                    </React.Fragment>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                             
                            {dateRangeMainMeter.map((week,index)=>(
                                <TableRow key={index}>
                                    <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{week.date}</TableCell>
                                    {/* main meter units */}
                                    <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{week.todayunits}</TableCell>  
                                    {/* specific date total subblockmeter units */}    
                                    <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{totalSubBlockMeterTodayUnitsPerDay[week.date] || 0}</TableCell>
                                    {/*subBlockmeter units */}
                                    {subBlockMeterName.map((meter, meterIndex) => {
                                        // Ensure the sub meter readings exist
                                        const matchingMeter = dateRangeSubBlock.find(m => m.date === week.date && m.subblockmetername === meter.subblockmetername);
                                        return (
                                            <TableCell key={meterIndex} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
                                                {matchingMeter ? matchingMeter.todayunits : 0}
                                            </TableCell>
                                        );
                                    })}
                                    {/* sub meter units */}
                                    {subMeterName.map((meter,meterIndex)=>{
                                        const matchingMeter=dateRangeSubMeter.find(m => m.date === week.date && m.submetername === meter.submetername);
                                        return(
                                            <TableCell key={meterIndex} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
                                                {matchingMeter ? matchingMeter.todayunits : 0}
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan={1} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Total Main Meter :</TableCell>
                                {/* total main meter units */}
                                <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{totalMainMeter}</TableCell>
                                {/* total subBlock meter units */}
                                <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{totalSubBlockMeterTodayUnits}</TableCell>
                                {/* specific subBlock meter total units*/}
                                {subBlockMeterName.map((subBlock, subBlockIndex) => {
                                    const todayUnits = totalSameSubBlockMeterTodayUnits[subBlock.subblockmetername] || 0;
                                    return (
                                        <TableCell key={subBlockIndex} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{todayUnits}</TableCell>
                                    );
                                })}

                                {/* specific sub meter total units */}
                                {subMeterName.map((subBlock, subBlockIndex) => {
                                    const todayUnits = totalSameSubMeterTodayUnits[subBlock.submetername] || 0;
                                    return (
                                        <TableCell key={subBlockIndex} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{todayUnits}</TableCell>
                                    );
                                })}
                            </TableRow>
                        </TableBody> 
                    </Table>
                </TableContainer>

            )}

            {/* view by month table */}
            { monthIsennable && (
                <TableContainer>
                    <Table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                {/* mainMeterName */}
                                <TableCell sx={{ fontWeight: 'bold' }} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }} colSpan={2}>{metername} Main Meter Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}></TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} colSpan ={subBlockMeterName.length*2 + subMeterName.length *2} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{metername} SubBlockMeterName</TableCell>
                            </TableRow>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                {/* mainMeterName */}
                                <TableCell sx={{ fontWeight: 'bold' }} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }} colSpan={2}>{metername}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }} >Total Sub Block</TableCell>
                                {/*subBlockMeterName */}
                                {subBlockMeterName.map((meter, index) => (
                                    
                                    <TableCell sx={{ fontWeight: 'bold' }}  align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}key={index}>{meter.subblockmetername}</TableCell>
                                   
                                ))}
                                {/* subMeterName */}
                                {subMeterName.map((meter,meterIndex) =>(
                                    
                                    <TableCell sx={{ fontWeight: 'bold' }} key={meterIndex}  align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{meter.submetername}</TableCell>
                                    
                                ))}
                            </TableRow>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell sx={{ fontWeight: 'bold' }} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Units</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Total Sub Block</TableCell>
                                {/* subBlockMeterName equally display units colunm */}
                                {subBlockMeterName.map((meter, meterIndex) => (
                                    <React.Fragment key={meterIndex} >
                                        <TableCell sx={{ fontWeight: 'bold' }} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }} >Units</TableCell>
                                    </React.Fragment>
                                ))} 
                                {/* subMeterName equally display units colunm */}
                                {subMeterName.map((meter,meterIndex)=>(
                                    <React.Fragment key={meterIndex}>
                                        <TableCell sx={{ fontWeight: 'bold' }} key={`subBlockUnits-${meterIndex}`} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Units</TableCell>
                                    </React.Fragment>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {monthMainMeter.map((month,index)=>(
                                <TableRow key={index}>
                                    <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }} >{month.date}</TableCell>
                                    {/* specific date mainmeter name */}
                                    <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{month.todayunits}</TableCell>
                                    {/*  subBlock meter total  today units */}
                                    <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{totalSubBlockMeterTodayUnitsPerDay[month.date] || 0}</TableCell>
                                    {/* subblockmeter units */}
                                    {subBlockMeterName.map((meter, meterIndex) => {
                                        // Ensure the sub meter readings exist
                                        const matchingMeter=monthSubBlockMeter.find(m => m.date === month.date && m.subblockmetername === meter.subblockmetername )
                                        return (
                                            <React.Fragment key={meterIndex}>
                                                { matchingMeter ?(
                                                    <>
                                                        <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{matchingMeter.todayunits }</TableCell>    
                                                    </>  
                                                ):(
                                                    <>
                                                        <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>0</TableCell>    
                                                    </> 
                                                )}
                                                        
                                            </React.Fragment>
                                        );
                                    })}
                                    {/* submeter units */}
                                    {subMeterName.map((meter, meterIndex) => {
                                        // Ensure the sub meter readings exist
                                        const matchingMeter=monthSubMeter.find(m => m.date === month.date && m.submetername === meter.submetername )
                                        return (
                                            <React.Fragment key={meterIndex}>
                                                { matchingMeter ?(
                                                    <>
                                                        <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{matchingMeter.todayunits }</TableCell>    
                                                    </>  
                                                ):(
                                                    <>
                                                        <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>0</TableCell>    
                                                    </> 
                                                )}
                                                     
                                            </React.Fragment>
                                        );
                                                
                                          
                                    })}
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Total Main Meter Reading</TableCell>
                                {/* total mainmeter units */}
                                <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{totalMainMeter}</TableCell>
                                {/* toal subblock units */}
                                <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{totalSubBlockMeterTodayUnits}</TableCell>
                                {/* total specific subBlockMeterName units */}
                                {subBlockMeterName.map((subBlock)=> {
                                    const todayUnits = totalSameSubBlockMeterTodayUnits[subBlock.subblockmetername];
                                    return (
                                        <React.Fragment>
                                            { todayUnits   ?(
                                                    <>
                                                        <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{todayUnits}</TableCell>
                                                    </>
                                                
                                                ): 
                                                <>
                                                    <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>0</TableCell>
                                                </>
                                            }
                                        </React.Fragment>
                                    )
                                })}
                                {/* total specific subMeterName units */}
                                {subMeterName.map((subBlock)=> {
                                    const todayUnits = totalSameSubMeterTodayUnits[subBlock.submetername];
                                    return (
                                        <React.Fragment>
                                            { todayUnits   ?(
                                                <>
                                                    <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{todayUnits}</TableCell>
                                                </>
                                                                    
                                            ): 
                                                <>
                                                    <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>0</TableCell>
                                                </>
                                            }
                                        </React.Fragment>
                                    )                     
                                })}
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            )}


            {/* year units table */}
            {yearIsennable && (
                <TableContainer>
                <Table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            {/*main meter name */}
                            <TableCell sx={{ fontWeight: 'bold' }} colSpan={2} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{metername} Main Meter </TableCell> 
                            <TableCell sx={{ fontWeight: 'bold' }} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}></TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} colSpan ={subBlockMeterName.length*2 + subMeterName.length *2} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{metername} Sub Block Meter</TableCell>

                        </TableRow>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            {/* mainMeter Name */}
                            <TableCell sx={{ fontWeight: 'bold' }} colSpan={2} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{metername}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Total Sub Block</TableCell>
                            {/* subBlockMeterName */}
                            {subBlockMeterName.map((meter, index) => (
                                <React.Fragment key={index}>
                                    <TableCell sx={{ fontWeight: 'bold' }}  align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{meter.subblockmetername}</TableCell>
                                </React.Fragment>
                            ))}
                            {/*sub Meter Name */}
                            {subMeterName.map((meter,meterIndex) =>(
                                <React.Fragment key={meterIndex}>
                                    <TableCell sx={{ fontWeight: 'bold' }}  align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{meter.submetername}</TableCell>
                                </React.Fragment>
                            ))}
                        </TableRow>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell sx={{ fontWeight: 'bold' }} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Units</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Total Sub Block</TableCell>
                            {/* subBlockMeterName  equally colunm display for units */}
                            {subBlockMeterName.map((meter, index) => (
                                <React.Fragment key={index}>
                                    <TableCell sx={{ fontWeight: 'bold' }} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Units</TableCell>
                                </React.Fragment>
                            ))} 
                            {/* subMeterName equally colunm display for units */}
                            {subMeterName.map((meter,meterIndex)=>(
                                <React.Fragment key={meterIndex} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
                                    <TableCell sx={{ fontWeight: 'bold' }} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Units</TableCell>
                                </React.Fragment>
                             ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {yearMainMeter.map((year,index)=>(
                            <TableRow key={index}>
                                <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{year.date}</TableCell>
                                {/* main meter units */}
                                <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{year.todayunits}</TableCell>
                                {/* specific date subblockmeter total units  */}
                                <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{totalSubBlockMeterTodayUnitsPerDay[year.date] || 0}</TableCell>
                                {/* For yearSubBlockMeter units */}
                                {subBlockMeterName.map((meter, meterIndex) => {
                                    // Ensure the sub meter readings exist or not
                                    const matchingMeter=yearSubBlockMeter.find(m => m.date === year.date && m.subblockmetername === meter.subblockmetername )
                                    return (
                                        <React.Fragment key={meterIndex}>
                                            { matchingMeter ?(
                                                <>
                                                    <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{matchingMeter.todayunits }</TableCell>    
                                                </>  
                                            ):(
                                                <>
                                                    <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>0</TableCell>    
                                                </> 
                                            )}
                                        </React.Fragment>
                                    );
                                })}

                                {/* For yearSubMeter units */}
                                {subMeterName.map((meter, meterIndex) => {
                                    // Ensure the sub meter readings exist
                                    const matchingMeter=yearSubBlockMeter.find(m => m.date === year.date && m.subblockmetername === meter.subblockmetername )
                                    return (
                                        <React.Fragment key={meterIndex}>
                                            { matchingMeter ?(
                                                <>
                                                    <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{matchingMeter.todayunits }</TableCell>    
                                                </>  
                                            ):(
                                                <>
                                                    <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>0</TableCell>    
                                                </> 
                                            )}
 
                                        </React.Fragment>
                                    );
                                                
                                          
                                })}
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell colSpan={1} align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Total Main Meter Reading</TableCell>
                            {/* total today main meter units */}
                            <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{totalMainMeter}</TableCell>
                            {/* total subblock meter today units */}
                            <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{totalSubBlockMeterTodayUnits}</TableCell>
                            {/*  total sepcific subblock meter today units */}
                            {subBlockMeterName.map((subBlock)=> {
                                const todayUnits = totalSameSubBlockMeterTodayUnits[subBlock.subblockmetername];
                                return (
                                    <React.Fragment>
                                        { todayUnits   ?(
                                            <>
                                                <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{todayUnits}</TableCell>
                                            </>
                                                
                                        ): 
                                            <>
                                                <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>0</TableCell>
                                            </>
                                        }
                                    </React.Fragment>
                                )
                                    
                            
                            })}

                           {/*  sepcific sub meter total today units */}
                            {subMeterName.map((subBlock)=> {
                                const todayUnits = totalSameSubMeterTodayUnits[subBlock.submetername];
                                return (
                                    <React.Fragment>
                                        { todayUnits   ?(
                                            <>
                                                <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{todayUnits}</TableCell>
                                            </>
                                                                    
                                        ): 
                                            <>
                                                <TableCell align='center' style={{ border: '1px solid black', borderCollapse: 'collapse' }}>0</TableCell>
                                            </>
                                        }
                                    </React.Fragment>
                                )                    
                            })}
                        </TableRow>
                    </TableBody>
                </Table>
             </TableContainer>
            )}
        </Box>
        
    )
}

export default ViewMeterValue