import React, { useEffect, useState } from 'react'
import RecipeView from './RecipeView'
import { Pagination } from 'antd'

export default function DisplayView(props) { 
  const [ id, setId ] = useState()
  const [ page, setPage ] = useState() 
  const [ length, setLength ] = useState()

  useEffect(()=>{
    const length = props.recipeList.length
    setPage(1)
    setLength(length)
  },[props])

  const showPage = (e)=>{
    setPage(e)   
  }

  return ( 
    <>   
    <div style={{display:'flex', flexWrap:'wrap', width:'100%', paddingTop:30}}>
      {
        props.recipeList.slice((page-1)*6, page*6).map(item=>
          <div style={{width:'15%', textAlign:'center', marginRight:15}} key={item.id}>
            <div>           
              <img 
                onClick={()=>{setId(item.id)}}
                style={{borderRadius:'50%', width:100, height:100, cursor:'pointer'}} 
                src={item.mainImage? item.mainImage:'https://firebasestorage.googleapis.com/v0/b/react-mykitchen-5ed64.appspot.com/o/Images%2Fdownload.png?alt=media&token=4b4a8ba2-3bbd-49a3-8ba2-8e22dcac34fd'} 
                alt={item.title}/>           
            </div>
            <div>
              <h6 style={{textAlign:'center', width:'100%', fontSize:14, marginTop:15}}>{item.title}</h6>
            </div>            
          </div> 
        )  
      } 
      </div> 

      <div style={{display:props.recipeList.length? '':'none'}}>        
        <Pagination defaultCurrent={1} total={length} defaultPageSize={6} onChange={showPage} />
      </div>  

      {
        id && <RecipeView id={id} onBack={()=>setId(null)}/>
      }    
    </> 
  )  
}
