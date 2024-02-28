import React from 'react';
import GroupForm from './GroupForm';

const GroupList = ({ groups }) => {
  const groupElementList = groups.map(group => (
    <div key={group.id}>
      <h3>{group.name}</h3>
      <h4>Users:</h4>
      <ul>
        {group.users.map(user => (
          user.user_groups.map(userGroup => {
            if (userGroup.group.id === group.id) {
              return <li key={user.id}>{user.username}</li>;
            }
            return null;
          })
        ))}
      </ul>
    </div>
  ));

  return (
    <div>
      {groupElementList}
      <GroupForm />
    </div>
  );
};

export default GroupList;
