import logo from './logo.svg';
import './App.css';
import { Routes,Route, Router} from "react-router-dom";
import Nav from './EBModule/Nav';

import AddDeleteMeter from "./EBModule/AddDeleteMeter";
import EB from "./EBModule/EB";
import ViewMeterValue from "./EBModule/ViewMeterValue";
import MeterReading from "./EBModule/MeterReading";

function App() {
  return (
    
    <div>
      <Nav />
      <Routes basename="/Hospital-1">
        
          <Route path="/" exact  element={<EB />} />
          <Route path="/MeterReading" element={<MeterReading />} />
        
          <Route path="/AddDeleteMeter" element={<AddDeleteMeter />}/>
          <Route path="/ViewMeterValue" element={<ViewMeterValue />}/>
      
      </Routes>
    </div>
  
      
    
    
  );
}

export default App;
