import React from 'react'
import { Card} from 'antd'
import { useNavigate} from 'react-router-dom'

const { Meta } = Card
export default function Home() {  
  const navigate = useNavigate()

  return (
    <div id='Home'>  
      <Card 
        hoverable
        bordered={false}
        onClick={()=>navigate('/groups/Fast Food')}
        cover={<img alt="Beefball&Mashedpatato" src="https://firebasestorage.googleapis.com/v0/b/react-mykitchen-5ed64.appspot.com/o/Images%2Fikeabeefballset.jpg?alt=media&token=135f5273-bff9-485a-b187-c9a3a326a984" />}
      >
        <Meta title="Fast Food" 
          description="Cooked with half-done foods or could be made within minutes" />
      </Card>     
      <Card
        hoverable
        bordered={false}
        onClick={()=>navigate('/groups/Fat Control')}
        cover={<img alt="Salad" src="https://firebasestorage.googleapis.com/v0/b/react-mykitchen-5ed64.appspot.com/o/Images%2Fsalad.jpg?alt=media&token=a9467df5-2190-430c-8309-afc6730b390c&_gl=1*12lp7xq*_ga*MTk1OTI3MjgxMy4xNjc5MzY0OTM1*_ga_CW55HF8NVT*MTY4NjYyMDQ2MS40MC4xLjE2ODY2MjA3MjQuMC4wLjA" />}
      >
        <Meta title="Fat Control"
          description="Very healthy food such as salad or veges bowls " />
      </Card>     
      <Card
        hoverable
        bordered={false}
        onClick={()=>navigate('/groups/Spicy Food')}
        cover={<img alt="Malatang" src="https://firebasestorage.googleapis.com/v0/b/react-mykitchen-5ed64.appspot.com/o/Images%2Fmalatang.jpg?alt=media&token=7449e607-edcd-4964-97d1-0bc129582ba1&_gl=1*11yfavb*_ga*MTk1OTI3MjgxMy4xNjc5MzY0OTM1*_ga_CW55HF8NVT*MTY4NjY0MTE1OS40MS4xLjE2ODY2NDE5ODcuMC4wLjA." />}
      >
        <Meta title="Spicy Food" 
          description="All kinds of spicy dishes" />
      </Card>     
      <Card
        hoverable
        bordered={false}
        onClick={()=>navigate('/groups/Noddles')}
        cover={<img alt="zhutifen" src="https://firebasestorage.googleapis.com/v0/b/react-mykitchen-5ed64.appspot.com/o/Images%2Fsuanluobozhutifen.jpg?alt=media&token=7c30a2db-fa81-4838-86ca-9b1c12a87c6b&_gl=1*hz68fh*_ga*MTk1OTI3MjgxMy4xNjc5MzY0OTM1*_ga_CW55HF8NVT*MTY4NjY0MTE1OS40MS4xLjE2ODY2NDI1NjMuMC4wLjA." />}
      >
        <Meta title="Noodles" 
          description="Rice noodles or wheat noodles whether stir fried or with soup" />
      </Card> 
      <Card
        hoverable
        bordered={false}
        onClick={()=>navigate('/groups/Grilled')}
        cover={<img alt="Grilled" src="https://firebasestorage.googleapis.com/v0/b/react-mykitchen-5ed64.appspot.com/o/Images%2Fsaltychicken.jpg?alt=media&token=96cde1ff-d03f-488d-b9b3-c307e96164d2" />}
      >
        <Meta title="The Grilled" 
          description="All kinds of grilled course" /> 
      </Card>     
      <Card
        hoverable
        bordered={false}
        onClick={()=>navigate('/groups/Sweeties')}
        cover={<img alt="zhutifen" src="https://firebasestorage.googleapis.com/v0/b/react-mykitchen-5ed64.appspot.com/o/Images%2Fruanoubao.jpg?alt=media&token=7d406348-e794-4be4-a5d9-f16562d4be93" />}
      >
        <Meta title="Sweeties" 
          description="Cakes, breads, cookies, drinks, all with happiness" />
      </Card>     
    </div>
  )
}


