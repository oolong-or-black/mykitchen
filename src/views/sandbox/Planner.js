import React, { useState, useRef, useEffect } from 'react'
import { Calendar, theme, Checkbox, Space, Input, Button, Form, Modal} from 'antd';
import axios from 'axios';
import MenuPicker from '../../components/MenuPicker';
import DateCellRender from '../../components/DateCellRender';
import { useSelector } from 'react-redux';

export default function Planner() {
  const [selectedDate, setSelectedDate] = useState()
  const [inputDisable, setInputDisable] = useState({Breakfast:false, Lunch:false,Dinner:false})
  const [allEvents, setAllEvents]=useState([])
  const [inputValues, setInputValues]=useState({Breakfast:[], Lunch:[], Dinner:[]})
  const [isPickerOpen, setIsPickerOpen]=useState(false)
  const { loggedUser } = useSelector(state=>state.logOnStatus)

  useEffect(()=>{
    if(loggedUser){
      axios.get(`/mealPlans/${loggedUser.username}`).then(res=>{
        setAllEvents(res.data.allEvents)
      })
    } 
  },[loggedUser])
  
  // **** all about Calendar...............
  const { token } = theme.useToken();
  const wrapperStyle = {
    width: 1200,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
    display:'inline-block'
  }
  
  // select a date to set meals plan, it might be to set up a new plan or edit a existed plan 
  const onSelect = (value)=>{
    setSelectedDate(value.format('YYYY-MM-DD'))
    let oldEvent = allEvents.filter(item=>item.Date === value.format('YYYY-MM-DD')) 
    // if the selected date already has an existed plan...
    if(oldEvent.length){
      mealPlan.current.setFieldsValue({
        Date:value.format('YYYY-MM-DD'),
        Breakfast: oldEvent[0].Breakfast,
        Lunch: oldEvent[0].Lunch,
        Dinner: oldEvent[0].Dinner
      })
    } else { // if the selected date has not had any existed plan...
      mealPlan.current.setFieldsValue({
        Date:value.format('YYYY-MM-DD'),
        Breakfast: null,
        Lunch: null,
        Dinner: null 
      })  
    }
  }
  // ...............


  // **** all about the Form ...............
  const mealPlan = useRef()
  const[ mealtime,setMealtime ] = useState()
  
  // open the modal to be going to select a random meal from database
  const handleSelect = (mealtime)=>{
    setMealtime(mealtime)
    setIsPickerOpen(true)
  }
 
  // when all the meals plan for a specific date is all done
  const onFinish = ()=>{  
    mealPlan.current.validateFields().then(res=>{
      let events = allEvents.filter(item=>item.Date!==selectedDate)
      let newEvent = {
        Date: selectedDate,
        Breakfast: typeof(res.Breakfast) === 'string' ? res.Breakfast.split(','):res.Breakfast,
        Lunch: typeof(res.Lunch) === 'string' ? res.Lunch.split(','):res.Lunch,
        Dinner: typeof(res.Dinner) === 'string' ? res.Dinner.split(','):res.Dinner
      }
      axios.patch(`/mealPlans/${loggedUser.username}`,{     
        allEvents: [
        ...events,
        newEvent
        ]      
      }).then(res=>setAllEvents(res.data.allEvents))
      mealPlan.current.resetFields()
      setInputDisable({Breakfast:false, Lunch:false,Dinner:false})
      setInputValues({Breakfast:[], Lunch:[], Dinner:[]})
  })}
 // ...............

 //  ****** all about the modal --MenuPicker ...............
  // on finish of the selection of random meals in the modal
  const handleConfirm = (title)=>{
    // defined as the value of Breakfast or Lunch or Dinner
    let value = inputValues[`${mealtime}`] 
    let Array = [...value, ...title]
    let newArray = Array.filter(item=>item!=='' & item !== ' ')
    mealPlan.current.setFieldValue(mealtime, newArray)
    setIsPickerOpen(false)
  }  


 // ...............
  return (
    <>
      <div style={{display: loggedUser? 'none':'', font:'24px bold'}}>
        Please log on or sign up first to access the function of meals planning !
      </div>

      <section style={{display:loggedUser? '':'none'}}>
        {/* display calendar */}
        <div style={wrapperStyle} id='calendar'>
          <Calendar 
            fullscreen={false} 
            dateCellRender={value => <DateCellRender value={value} dataSource={allEvents} />} 
            onSelect={onSelect}
          />       
        </div>

      {/* plan the menu on the selected date */}
        <div style={{marginTop:20}}>
          <Form onFinish={onFinish} ref={mealPlan}>
          {/* step 1 - select the specific date */}
            <h4 style={{color:'grey'}}> Step 1:  &nbsp; select the date you want to plan your meals;</h4>          
            <Space>
              <span>Date: </span>   
              <Form.Item name='Date'>
                  <Input style={{width:150}} value={selectedDate}/>
              </Form.Item> 
              <span style={{marginLeft:20, color:'grey'}}>Select the date from the above calendar </span>
            </Space> 

          {/* step 2 - decide/select the menus for Breakfast/Lunch/Dinner of the specific date */}
            <h4 style={{color:'grey'}}> Step 2:  &nbsp; click the checkbox &nbsp; <Checkbox></Checkbox> &nbsp; to decide which meal you want to plan;</h4>
            <h4 style={{color:'grey'}}> 
              Step 3: <p>&nbsp;&nbsp; click the <b style={{color:'blue'}}>Select</b> button to choose a course from the database;</p>
              <p>&nbsp;&nbsp; or, just <b style={{color:'blue'}}>type</b> the courses' name you decide into the Input area. Always use <strong style={{color:'red'}}>","</strong> to separate different courses;</p>
              <p>&nbsp;&nbsp; or, you could <i style={{color:'blue'}}>both</i> type and select.</p>
            </h4>
            <ul id='meals-ul'>
              <li>
                <Checkbox  value='Breakfast' checked={inputDisable.Breakfast}
                  onChange={(e)=>setInputDisable({...inputDisable, Breakfast:e.target.checked})} >Breakfast</Checkbox>
                <Button type='primary' disabled={!inputDisable.Breakfast} onClick={()=>handleSelect('Breakfast')}>Select</Button>
                <Form.Item name='Breakfast'>
                  <Input 
                    disabled={!inputDisable.Breakfast} value={inputValues.Breakfast} 
                    onChange={(e)=>setInputValues({...inputValues, Breakfast:e.target.value.split(',')})}
                  />           
                </Form.Item>
              </li>
              <li>
                <Checkbox  value='Lunch' checked={inputDisable.Lunch}
                  onChange={(e)=>setInputDisable({...inputDisable, Lunch:e.target.checked})} >Lunch</Checkbox>
                <Button type='primary' disabled={!inputDisable.Lunch} onClick={()=>handleSelect('Lunch')}>Select</Button>
                <Form.Item name='Lunch'>
                    <Input 
                      disabled={!inputDisable.Lunch} value={inputValues.Lunch} 
                      onChange={(e)=>setInputValues({...inputValues, Lunch:e.target.value})}
                    /> 
                </Form.Item>
              </li>            
              <li>
                <Checkbox  value='Dinner' checked={inputDisable.Dinner}
                  onChange={(e)=>setInputDisable({...inputDisable, Dinner:e.target.checked})} >Dinner</Checkbox>
                <Button type='primary' disabled={!inputDisable.Dinner} onClick={()=>handleSelect('Dinner')}>Select</Button>
                <Form.Item name='Dinner'>
                  <Input 
                    disabled={!inputDisable.Dinner} value={inputValues.Dinner} 
                    onChange={(e)=>setInputValues({...inputValues, Dinner:e.target.value})}
                  /> 
                </Form.Item>
              </li>
            </ul>

          {/* confirm the plan */}
            <Form.Item>
              <Button className='confirmButton' type="primary" htmlType="submit" >
                Confirm your meals plan
              </Button>
            </Form.Item> 
          </Form>
        </div> 

      </section>

      {/* when decide to choose a/some recipes from database */}
      <Modal
        open={isPickerOpen}
        onCancel={()=>setIsPickerOpen(false)}
        footer={
          <Button onClick={()=>setIsPickerOpen(false)}> Cancel</Button>
        }
      >
        <MenuPicker handleConfirm={handleConfirm}/>
      </Modal>
    </>
  )
}
