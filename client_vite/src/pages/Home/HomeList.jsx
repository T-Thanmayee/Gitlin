import React from 'react'
import RecipeReviewCard from './HomeCard'

function HomeList() {
    let arr=[1,2,3]
  return (
    <div>
        {arr.map((card)=>
        <RecipeReviewCard key={card}/>)}
    </div>
  )
}

export default HomeList