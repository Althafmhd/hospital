import React from 'react'
import { Card, CardContent, Grid,  Typography ,Box ,Toolbar} from '@mui/material';
import { useState,useEffect } from 'react';
import { getDate} from './services/OPBlockService';

const EB=()=>{
    const[date ,setDate]=useState('')
    const[read,setRead]=useState([])
    const[error,setError]=useState('')

    useEffect(() => {
        const formattedDate = formatDate(new Date()) // Format the date as needed
        setDate(formattedDate);
        //console.log(formattedDate)
        
    }, []);
    
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
   

    
    useEffect(() => {
        if (date) { // Ensure date is not empty
            const fetchData = async () => {
                try {
                    const response = await getDate(date); // Assuming getDate accepts a string date
                    setRead(response.data); // Adjust according to your response structure
                    //console.log(response.data);
                } catch (error) {
                    setError('Error fetching data:', error)
                }
            };
            fetchData();
        }
    }, [date]);
    
  
    return(
        <Box style={{ backgroundSize: "cover", padding:2 ,marginTop: '80px'  }}>
             <Toolbar >
                <Box  display="flex" alignItems="center" justifyContent="center"  style={{ flexGrow: 1 }}> {/* Set to match Toolbar height */}
               
                    <Typography  variant='h4' style={{ color: 'lightblue' }}>
                        LAKSHMI HOSPITALS
                    </Typography>
                </Box>
            </Toolbar>
           
            <Typography variant='h4' align='center'>EB Reading</Typography>   
            
            <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '80vh' }} columnSpacing={{  md: 7 }}>
                <Grid item >
                    <Card sx={{height : 300 ,width:400}} >
                        <CardContent>
                            <Typography variant='h4' align='center'>Main Meter Units</Typography>
                            <Typography variant ='h6'>Today Units</Typography>
                            {error && <Typography color="error">{error}</Typography>}
                            {read.map((reading) =>(
                                <div key={reading.id}>
                                    <Typography>{reading.mainmetername} : {reading.readingunits}</Typography>
                                        
                                </div>
                            ))} 

                        </CardContent>
                    </Card>
                </Grid>
            
            </Grid>
        </Box>
       
    )
}

export default EB;