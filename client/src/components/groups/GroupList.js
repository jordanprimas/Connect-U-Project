import React from 'react';
import GroupCard from './GroupCard';

const GroupList = ({ groups }) => {
  const groupElementList = groups.map(group => (
    <div key={group.id}>
      <h3>{group.name}</h3>
      <h4>Users:</h4>
      <ul>
        {group.users.map(user => console.log(user.username)
        )}
      </ul>
    </div>
  ));

  return (
    <div>
      {groupElementList}
    </div>
  );
};

export default GroupList;
