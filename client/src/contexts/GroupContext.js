import React, { useState, useEffect } from 'react'

const GroupContext = React.createContext()

const GroupProvider = ({ children }) => {
    const [groups, setGroups] = useState([])

    useEffect(() => {
        fetchGroups()
      }, [])


    const fetchGroups = () => {
        fetch('/api/groups')
        .then(res => res.json())
        .then(data => setGroups(data))
      }

    return(
        <GroupContext.Provider value={[groups, setGroups]}>{children}</GroupContext.Provider>
    )
}

export { GroupContext, GroupProvider }