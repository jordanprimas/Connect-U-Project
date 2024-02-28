import React from 'react'

const GroupCard = ({ group }) => {

  return (
    <div className="card" key={group.id}>
        <h3>{group.name}</h3>
  </div>
  )
}

export default GroupCard