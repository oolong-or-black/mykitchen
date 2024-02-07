import React, { useEffect, useState } from 'react'

export default function DateCellRender(props) {
    const [content, setContent] = useState()

    useEffect(()=>{
        let listData = props.dataSource.filter(item=>item.Date===props.value.format('YYYY-MM-DD'))[0]
        let component = listData && <div className='dateCellRender'> 
            {listData.Breakfast && <div><p>Breakfast: </p> <ul>{listData.Breakfast.map(item=><li key={item}>{item}</li>)}</ul></div>}
            {listData.Lunch && <div><p>Lunch:</p>  <ul>{listData.Lunch.map(item=><li key={item}>{item}</li>)}</ul></div>}
            {listData.Dinner && <div><p>Dinner:</p>  <ul>{listData.Dinner.map(item=><li key={item}>{item}</li>)}</ul></div>}
            </div> 
        setContent(component)  

    },[props])

    return <>
        {content}
    </>
}
