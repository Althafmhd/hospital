import axios from 'axios'

const api='http://localhost:8080/EB/api/'

const Rest_api=api+'Meter'

export const listdata= () => axios.get(Rest_api)

export const Addmetername=(meter)=> axios.post(Rest_api,meter)

export const Deletemetername=(meter)=> axios.delete(Rest_api+'/'+meter) 

const Rest_subapi=api+'Subblockmeter'

export const getlistdata =  ()=>  axios.get(Rest_subapi)

export const addSubBlockMeterName=(submeter)=>axios.post(Rest_subapi,submeter)

export const Deletesubmetername=(submeter)=>axios.delete(Rest_subapi+'/deleteSubBlockMeter/'+submeter)

export const Deletesubblockmetername=(mainmeter)=>axios.delete(Rest_subapi+'/deleteMainMeter/'+mainmeter)

const Rest_Mapi=api+'MeterReading';

export const AddMreadingvalue=(mreading)=> axios.post(Rest_Mapi, mreading);

export const getMeterReading=()=>axios.get(Rest_Mapi);

export const getMonth=(readmonth)=> axios.get(Rest_Mapi+'/month/'+readmonth);

export const getYear=(readyear)=>axios.get(Rest_Mapi+'/year/'+readyear);

export const getDate=(readdate)=>axios.get(Rest_Mapi+'/date/' +  readdate);

export const getDateRange=(startdate,enddate) =>axios.get(Rest_Mapi+'/dateRange/'+startdate+'/'+enddate)

export const getLastentryReading=(reading) => axios.get(Rest_Mapi+'/lastentry/'+reading)

const Rest_Sapi=api+'Subblockmeterreading';

export const AddSubBlockMeterReadingValue=(sreading)=> axios.post(Rest_Sapi, sreading)

export const getSubBlockReading=()=> axios.get( Rest_Sapi)

export const getLastEntrySubMeterReading=(reading) => axios.get(Rest_Sapi+'/lastentry/' +reading)

export const getSubMonth=(readMonth) => axios.get(Rest_Sapi+'/month/'+readMonth)

export const getSubDate=(readDate) => axios.get(Rest_Sapi+'/date/'+readDate)

export const getSubYear=(readYear) => axios.get(Rest_Sapi+'/year/'+readYear)

export const getSubDateRange=(startdate,enddate) =>axios.get(Rest_Sapi+'/dateRange/'+startdate+'/'+enddate)

const  Rest_Rapi=api+'MeterReadingReset';

export const resetReading=(resetval)=> axios.post(Rest_Rapi, resetval)

export const getReading=(reading) =>axios.get(Rest_Rapi+'/lastentry/'+reading);

const Rest_SRapi=api+'SubBlockMeterReadingReset';

export const subBlockMeterReadingReset=(resetval) => axios.post(Rest_SRapi , resetval)

export const getSReading=(reading) =>axios.get(Rest_SRapi+'/'+reading)

export const getLastEntryResetSubBlockMeterReading=(reading) =>axios.get(Rest_SRapi+'/lastentry/'+reading)

const Rest_SubRapi=api+'SubMeter';

export const subMeterAdd=(submeter)=> axios.post(Rest_SubRapi , submeter)

export const getSubMeter=() => axios.get(Rest_SubRapi)

export const deleteSubBlockMeter=(metername)=> axios.delete(Rest_SubRapi+'/deleteSubblockMeter/'+metername);

export const deleteSubMeter=(metername) => axios.delete(Rest_SubRapi+'/deleteSubMeter/'+metername);

const Rest_SubReadapi=api+'Submeterreading';

export const subMeterReading=(submeterreading)=>axios.post(Rest_SubReadapi,submeterreading)

export const getSubMeterReading=()=>axios.get(Rest_SubReadapi);

export const getByDateSubMeterReading=(readDate)=>axios.get(Rest_SubReadapi+'/date/'+readDate)

export const getByDateRangeSubMeterReading=(readStartDate,readEndDate)=>axios.get(Rest_SubReadapi+'/dateRange/'+readStartDate+'/'+readEndDate);

export const getByMonthSubMeterReading=(readMonth)=>axios.get(Rest_SubReadapi+'/month/'+readMonth);

export const getByYearSubMeterReading=(readYear)=>axios.get(Rest_SubReadapi+'/year/'+readYear);

const Rest_SubResetapi=api+'Submeterreadingreset';

export const subMeterReset=(submeterreset)=> axios.post(Rest_SubResetapi , submeterreset)

export const getSubMeterLastReading=(submetername)=>axios.get(Rest_SubResetapi+'/lastentry/'+submetername)

 