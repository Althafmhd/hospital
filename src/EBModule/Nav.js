import { AppBar,Toolbar,Button ,Container} from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom';
const Nav=()=>{
    return (
        <AppBar position="fixed">
      <Toolbar>
        <Container>
          
          <Button color="inherit" component={Link} to="/">EB</Button> &nbsp; &nbsp;
          <Button color="inherit" component={Link} to="/MeterReading">MeterReading</Button> &nbsp; &nbsp;

          <Button color="inherit" component={Link} to="/AddDeleteMeter">AddDeleteMeter</Button> &nbsp; &nbsp;
          <Button color="inherit" component={Link} to="/ViewMeterValue">ViewMeterReading</Button> &nbsp; &nbsp;
        </Container>
      </Toolbar>
    </AppBar>
    );
}

export default Nav;