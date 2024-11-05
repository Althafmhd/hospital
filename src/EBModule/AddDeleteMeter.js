import React, { useRef } from 'react'


import { Box,Card,CardContent,TextField,Typography,Button ,Toolbar} from '@mui/material'
import AddMainMeter from './AddMeter/AddMainMeter'
import AddSubBlockMeter from './AddMeter/AddSubBlockMeter'
import DeleteMainMeter from './Deletemeter/DeleteMainMeter'
import DeleteSubBlockMeter from './Deletemeter/DeleteSubBlockMeter'
import Mainmeterreadingreset from './ReadingReset/Mainmeterreadingreset'
import { useState } from 'react'
import SubBlockMeterreadingreset from './ReadingReset/SubBlockMeterreadingreset'
import AddSubMeter from './AddMeter/AddSubMeter'
import DeleteSubMeter from './Deletemeter/DeleteSubMeter'
import SubMeterreadingreset from './ReadingReset/SubMeterreadingreset'

const AddDeleteMeter=()=>{
    const [date,setDate]=useState('')
    const [dError,setDerror]=useState('')

    const addRef =useRef(null)
    const deleteRef=useRef(null)
    const resetRef=useRef(null)
    const topRef=useRef(null)

    const handleShowCard = () =>{
        if(addRef.current){
            addRef.current.scrollIntoView({behavior :'smooth' ,block:'start'});
        }
        
    };
    const handleShowDeleteCard=()=>{
        if(deleteRef.current){
            deleteRef.current.scrollIntoView({behavior :'smooth' ,block:'start'});
        }
    }

    const handleShowResetCard=()=>{
        if(resetRef.current){
            resetRef.current.scrollIntoView({behavior :'smooth' ,block:'start'});
        }
    }
    const handleShowTopCard=()=>{
        if(topRef.current){
            topRef.current.scrollIntoView({behavior :'smooth' ,block:'start'});
        }
    }
    return(
        <Box
       
        sx={{
       
        marginTop: '80px',
        display: 'flex',
        justifyContent: 'center',
        
        alignItems: 'center',                      
       
        
    }}> 
        
        <Box
                sx={{
                    position: 'fixed',
                    top: '65px',
                    left: '12%',
                    transform: 'translateX(-50%)',
                    zIndex: 1000,
                    backgroundColor: 'white',
                    padding: '10px',
                    borderRadius: '8px',
                    boxShadow: 2,
                }}
            >
            <Button onClick ={handleShowCard} variant="contained" color="primary">Add</Button> &nbsp; &nbsp;
            <Button onClick ={handleShowDeleteCard} variant="contained" color="primary">Delete</Button> &nbsp; &nbsp;
            <Button onClick ={handleShowResetCard} variant="contained" color="primary">Reset</Button> &nbsp; &nbsp;
            <Button onClick ={handleShowTopCard} variant="contained" color="primary">TOP</Button><br /><br />
        </Box>
        
        <Card sx={{ background :"transparent" , display: 'flex',
    width : 620,  alignItems: 'center',

    borderRadius : "17px"
    }}>
        <CardContent >
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
            <Card ref={topRef} sx={{background :'transparent',  display: 'flex',
                width :"550px",height:200,  alignItems: 'Right',
                justifyContent: 'Right'}}>
                    <CardContent>

                        <TextField 
                            type="Date" 
                            format="yyyy/MM/dd" 
                            value={date} 
                            onChange={(e)=>{setDate(e.target.value)
                                setDerror('')
                            }}
                            error={!!dError}
                            helperText={dError}
                        /><br></br><br></br>

                       
                    </CardContent>
                </Card><br></br>
                
              <Card  ref={addRef}>
                <CardContent>
                    <Typography textAlign="center" variant='h3'>Add Meter</Typography><br></br>
                    <AddMainMeter 
                        date={date}
                        setDate={setDate}
                        setDerror={setDerror}
                    /><br></br><br></br>

                    <AddSubBlockMeter 
                        date={date}
                        setDate={setDate}
                        dError={dError}
                        setDerror={setDerror}
                    /><br /><br />

                    <AddSubMeter 
                        date={date}
                        setDate={setDate}
                        dError={dError}
                        setDerror={setDerror}
                    /><br /><br />

                </CardContent>
              </Card><br></br><br></br>

               <Card ref={deleteRef}>
                  <CardContent>
                        <Typography textAlign="center" variant='h3'>DeleteMeter</Typography><br></br>

                        <DeleteMainMeter /><br /> <br />

                        <DeleteSubBlockMeter /><br /><br />

                        <DeleteSubMeter /><br /><br />
                  </CardContent>
               </Card> <br></br><br></br>

                <Card ref={resetRef}>
                    <CardContent>
                        <Typography textAlign="center" variant='h3'>ReadingReset</Typography><br></br>
                
                        <Mainmeterreadingreset 
                         date={date}
                         setDate={setDate}
                         dError={dError}
                         setDerror={setDerror}
                        /><br /><br />
                
                        <SubBlockMeterreadingreset 
                        date={date}
                        setDate={setDate}
                        dError={dError}
                        setDerror={setDerror}
                        /><br /><br />

                        <SubMeterreadingreset 
                        date={date}
                        setDate={setDate}
                        dError={dError}
                        setDerror={setDerror}
                        />
                       
                    </CardContent>
                </Card>
                

            </CardContent>
        </Card>
    </Box>
    ) 
    
}
export default AddDeleteMeter;