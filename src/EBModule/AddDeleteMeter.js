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
    
    return(
        <Box style={{ backgroundSize: "cover", padding:2 ,marginTop: '80px'}}>
            <Typography textAlign="center" variant='h4' style={{ color: 'lightblue' }}>
                LAKSHMI HOSPITALS 
            </Typography> <br />
            <Typography textAlign={'center'} variant='h3'> Meter</Typography><br />
            {/* Date card */}
            <Card ref={topRef} sx={{background :'transparent'}}>
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
        
            {/** Add meter card */}
            <Card  ref={addRef}>
                <CardContent>
                    <Typography textAlign="center" variant='h3'>Add Meter</Typography><br></br>

                    {/* ADD Main Meter file passe value*/}
                    <AddMainMeter 
                        date={date}
                        setDate={setDate}
                        dError={dError}
                        setDerror={setDerror}
                    /><br></br><br></br>

                    {/* ADD Subblock Meter file passe value*/}
                    <AddSubBlockMeter 
                        date={date}
                        setDate={setDate}
                        dError={dError}
                        setDerror={setDerror}
                    /><br /><br />

                    {/* ADD sub Meter file passe value*/}
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

                    <DeleteSubBlockMeter /><br />

                    <DeleteSubMeter /><br /><br />
                </CardContent>
            </Card> <br></br><br></br>
        </Box>
    )
}
export default AddDeleteMeter;