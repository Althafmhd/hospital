import { Box,Card,CardContent, Grid, Typography ,TextField ,Toolbar} from '@mui/material'
import React ,{ useState }from 'react'

import MainMeterReading from './MeterReading/MainMeterReading'
import ReadingValue from './MeterReading/ReadingValue'
import SubMeterReading from './MeterReading/SubMeterReading'

const MeterReading=()=>{
    const[date,setDate]=useState('');
    const[derror,setDError]=useState('');
    

    return (
        <Box style={{ backgroundSize: "cover", padding:2 ,marginTop: '80px'}}>
            <Toolbar>
                <Box display="flex" 
                    alignItems="center" 
                    justifyContent="center" 
                    style={{ flexGrow: 1 }}> {/* Set to match Toolbar height */}
                    
                    <Typography  variant='h4' style={{ color: 'lightblue' }}>
                        LAKSHMI HOSPITALS
                    </Typography>
                </Box>
            </Toolbar>
            <Typography  variant='h4' align="center" gutterBottom> Meter Reading </Typography><br />
            <Grid container  rowSpacing={1} columnSpacing={{ xs: 40, sm: 60, md: 50 }} >   
                <Grid item xs={12} sm={5} md={3}>
                    <Card sx={{background :'transparent', display: 'flex',alignItems: 'left',justifyContent: 'left' ,width :'200px' ,height:'120px'}}>
                        <CardContent>
                            <TextField 
                                type="date"
                                value={date}
                                onChange={(e)=>{
                                    setDate(e.target.value)
                                    setDError('')
                                }}
                                error={!!derror}
                                helperText={derror}
                                fullWidth
                                sx={{ marginBottom: 2 }}
                            /> <br /><br />      
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item  >
                    <MainMeterReading 
                        date={date}
                        setDate={setDate}
                        derror={derror}
                        dsetError={setDError}
                    /><br />
                </Grid>
            </Grid>
            <ReadingValue 
                date={date}
                derror={derror}
                dsetError={setDError}
            /> 
            <SubMeterReading 
            date={date}
            derror={derror}
            dsetError={setDError}
            />           
        </Box>
    )
}

export default MeterReading