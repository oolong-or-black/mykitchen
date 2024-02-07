import { Button, Checkbox, Divider, Modal } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import RecipeView from './displays/RecipeView';

const CheckboxGroup = Checkbox.Group;
export default function MenuPicker(props) {
  const [categoryList, setCategoryList]=useState([])
  const [checkedList, setCheckedList]=useState([])
  const [count, setCount] = useState(0)
  const [intervalId, setIntervalId] = useState(0)
  const [recipeRange, setRecipeRange]=useState([])
  const [randomMenus, setRandomMenus] = useState([])
  const [selectedMenu, setSelectedMenu] = useState([])
  const [isOpen, setIsOpen]=useState(false)
  const [recipeId, setRecipeId]=useState()
  
  // Once this component has been mounted, fetch the categoryList from database.
  useEffect(()=>{
    axios.get('/categories').then(res=>{
      setCategoryList(res.data.map(item=>item.title))
    })
  },[])

  // Once this component has been mounted, clear all the data at once.
  useEffect(()=>{
    setCheckedList([])
    setRandomMenus([])
    setSelectedMenu([])
  },[props])

  // All about the part 1 of category selection...
      // const indeterminate = checkedList.length > 0 && checkedList.length < categoryList.length
  const checkAll = categoryList.length === checkedList.length
  const onChange = (list)=>{
    setCheckedList(list) 
  }
  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? categoryList : []);
  };  
  //.....

  //All about the automatic randomly display of recipes 
  useEffect(()=>{
    if(count===10){
      clearInterval(intervalId)
      setCount(0)
    } 
  },[count,intervalId])

  // first step to get the range of recipes according to the categories selected
  const getCategoryList = ()=>{
    var list = []
    setRandomMenus([]) 
    return new Promise((resolve,reject)=>{
      if(checkedList.length === categoryList.length){
        axios.get('/recipes').then(res=>{
          return resolve(res.data)
        })
    } else {
        checkedList.forEach(item=>{  
          axios.get(`/recipes?category=${item}`).then(res=>{                    
            list.push.apply(list, res.data)  //append array B(list) to array A(res.data)         
          })
        })       
        return resolve(list)
      }
    })  
  }

  // step 2 each time randomly display up to ten recipes within the defined range and cut the already-displayed ones off the range
  const rangeSet = (props)=>{
    let num = 0
    let menu = []
    const newInterval = setInterval(()=>{
      let length = props.length
      if(length === 0){
        setCount(10)
      } else{
        let n = Math.floor(Math.random()*length)
        menu.push(props[n])
        props.splice(n,1)
        num += 1
        setCount(num<10? num:10)
      }
    },500)
    setIntervalId(newInterval)
    setRandomMenus(menu)   
    setRecipeRange(props)
  }

  const getMenus = async ()=>{
    var recipeList = await getCategoryList()    
    rangeSet(recipeList)
  }

  const handleNext =  ()=>{
    rangeSet(recipeRange)
  }

  const handlePick = (list)=>{
    setSelectedMenu(list)
  }
  
  return (
    // select the desired category
    <div id='category-checkboxGroup'>
      <h4>First, select the specific category as desired</h4>
      <Checkbox onChange={onCheckAllChange}  checked={checkAll}>
        Check all
      </Checkbox>
      <Divider></Divider>

      <div >
        <CheckboxGroup options={categoryList} value={checkedList} onChange={onChange} />  
      </div>  
      <Divider></Divider>  

      {/* confirm the category selection and prepare the recipes for the coming display */}
      <Button onClick={getMenus}  shape='round' danger>Confirm the categories then display the random recipes</Button>
      <Divider></Divider>

      {/* display up to ten recipes each time within the defined range */}
      <div style={{display: randomMenus.length? '':'none'}}>
        <div>
          <span style={{margin:'0 5px'}}>Display up to ten recipes each time</span>
          <Button onClick={handleNext} disabled={recipeRange.length? false:true}>Next</Button>
        </div>
        <ul className='menuPicker'>
          <Checkbox.Group onChange={handlePick}>
          {randomMenus && 
            randomMenus.map(item =>
            <li key={item.id} style={{width:'18%', textAlign:'center', marginRight:15}}>
              <div>
                <img 
                  onClick={()=>{ 
                    setIsOpen(true)
                    setRecipeId(item.id)
                  }}                  
                  style={{borderRadius:'50%', width:120, height:120, cursor:'pointer'}} 
                  src={item.mainImage? item.mainImage:'https://firebasestorage.googleapis.com/v0/b/react-mykitchen-5ed64.appspot.com/o/Images%2Fdownload.png?alt=media&token=4b4a8ba2-3bbd-49a3-8ba2-8e22dcac34fd'} alt={item.title}/>
              </div>
              <div>
                <Checkbox onChange={handlePick} value={item}>
                    <h6 style={{textAlign:'center', width:'100%', fontSize:14, marginTop:15}}>{item.title}</h6>
                </Checkbox>
              </div>
            </li>
          )}
          </Checkbox.Group>
        </ul>

        {/* check the recipes you desired and confirm the selection */}
        <Button type='primary' 
          onClick={()=>props.handleConfirm(selectedMenu.map(item=>item.title))}>
          Click to confirm your selection of recipes
        </Button>
      </div>   

      {/* to view any specific recipe in details */}
      <Modal 
        className='menuView-modal'
        open={isOpen} 
        onOk={()=>setIsOpen(false)}
        onCancel={()=>setIsOpen(false)}
      >
       <RecipeView id={recipeId} onBack={()=>setIsOpen(false)}/>    
      </Modal>   
    </div>
  )
}
