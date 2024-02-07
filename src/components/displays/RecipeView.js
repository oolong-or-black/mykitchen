import React, { useEffect,useState } from 'react'
import { PageHeader } from '@ant-design/pro-layout'
import { Descriptions, Input, Space, Rate } from 'antd'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { HeartOutlined, HeartFilled } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import Comments from '../Comments'

const {TextArea}=Input
export default function RecipeView(props) {
  const [recipeInfo, setRecipeInfo ] = useState()
  const {id} = useParams()
  const [isFavorite, setIsFavorite] = useState(false)
  const {loggedUser} = useSelector(state=>state.logOnStatus)
  const [rateValue, setRateValue] = useState()
  const [finalRate, setFinalRate] = useState()

  useEffect(()=>{  
    var path  
    if(JSON.stringify(props)==='{}'){
      path = `/recipes/${id}`
    } else {
      path = `/recipes/${props.id}`
    }  
    axios.get(path).then(res=>{
      setRecipeInfo(res.data)
      if(loggedUser && res.data.favoredBy.includes(loggedUser.username)){
        setIsFavorite(true)
      }
      if(res.data.rates >0) {
        let totalRates = res.data.rates.reduce((total,current)=>total+current) 
        setFinalRate((totalRates/(res.data.rates.length)).toFixed(1) )
      }
    })  
  },[props,id,loggedUser,isFavorite])  

  //to favorite or cancel favorite of this recipe
  const handleClick = ()=>{
    var favorites=recipeInfo.favoredBy
    if(!isFavorite){
      favorites.push(loggedUser.username)
      axios.patch(`/recipes/${recipeInfo.id}`,{
        "favoredBy":favorites
      })
    } else {
      axios.patch(`/recipes/${recipeInfo.id}`,{
        "favoredBy":favorites.filter(item=>item !==loggedUser.username)
      })
    }
    setIsFavorite(!isFavorite)
  }

  //to rate this recipe
  const handleRate = (e)=>{
    setRateValue(e)
    let rates = recipeInfo.rates
    rates.push(e)
    axios.patch(`/recipes/${recipeInfo.id}`,{
      "rates": rates
    })
    .then(res=>{
      let totalRates = res.data.rates.reduce((total,current)=>total+current)    
      setFinalRate((totalRates/(res.data.rates.length)).toFixed(1) )
    })
  }  

  return (
    recipeInfo && 
    <div>
      {/* the main details of this recipe*/}
      <PageHeader
        onBack={JSON.stringify(props)==='{}'? ()=>window.history.back():()=>props.onBack()}
        title={recipeInfo.title} >
        <Descriptions column={2}>
          <Descriptions.Item label='Author'>{recipeInfo.author}</Descriptions.Item>
          <Descriptions.Item label='Category'>{recipeInfo.category.title}</Descriptions.Item>
          <Descriptions.Item label='Group'>{recipeInfo.group}</Descriptions.Item>
          <Descriptions.Item label='Key Words'>{recipeInfo.keywords}</Descriptions.Item>
          <Descriptions.Item label='Ingredients'>
            <TextArea
              style={{border:'none', resize:'none'}} 
              autoSize={{minRows:3, maxRows:8}} 
              value={recipeInfo.ingredients}>
            </TextArea>
          </Descriptions.Item>
          <Descriptions.Item></Descriptions.Item>
          <Descriptions.Item label='Procedure'>
            <div  dangerouslySetInnerHTML={{ __html:recipeInfo.procedure}}></div>
          </Descriptions.Item>
          <Descriptions.Item label='Image'>{recipeInfo.mainImage? <img className='modal-image' src={recipeInfo.mainImage} alt='main'/> : <img src='https://firebasestorage.googleapis.com/v0/b/react-mykitchen-5ed64.appspot.com/o/Images%2Fdownload.png?alt=media&token=4b4a8ba2-3bbd-49a3-8ba2-8e22dcac34fd' alt='NotUploadYet' />}</Descriptions.Item>
        </Descriptions>
      </PageHeader>

     {/* the extra details, such as rating, favorite and comments of this recipe */}
      <section>
        <div style={{marginBottom:20}}>
          <i>Rating: <b style={{marginLeft:5, color:'red', fontSize:16}}>{finalRate}</b></i>
          { loggedUser && 
            <span onClick={handleClick} style={{cursor:'pointer', margin:'0 0 0 50px'}}>
            {isFavorite? <HeartFilled style={{color:'hotpink'}} />: <HeartOutlined style={{color:'hotpink'}}/>}
            &nbsp;&nbsp;<b style={{color:'hotpink'}} >Favorite</b>
            </span>
          }
        </div>
  
        { loggedUser && <Space >
              <Rate tooltips={[1,2,3,4,5]}  value={rateValue} onChange={e=>handleRate(e)} />
              {rateValue ? <span>{rateValue}</span> : ''}
          </Space>
        }

        <div style={{marginTop:20}}>
          <Comments id={recipeInfo.id}/>
        </div>
      </section>  
    </div>
  )
}
