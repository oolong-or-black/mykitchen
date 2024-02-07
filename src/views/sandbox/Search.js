import DisplayView from '../../components/displays/DisplayView'
import { useSelector } from 'react-redux'

export default function Search(props) {
  const {recipeSearch, searchName} = useSelector(state=>state.recipeSearch)
  
  return (
    <div>
      <h4>The search result of ' <i>{searchName}</i> ' is ....</h4>
      <DisplayView recipeList={recipeSearch}/>
    </div>
  )
}
