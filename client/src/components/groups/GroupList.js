import GroupForm from './GroupForm';

const GroupList = ({ groups, updateGroup, deleteUserGroup }) => {
  const userGroupList = Array.isArray(groups) ? (
    groups.map(group => (
        <div key={group.id}>
          <h2>{group.name}</h2>
          <GroupForm
            className="join-group-button"
            groupId={group.id}
            updateGroup={updateGroup}
            deleteUserGroup={deleteUserGroup}
            userGroups={group.user_groups}
          />
          <h4>Members:</h4>
          <ul>
            {group.user_groups && group.user_groups.length > 0 ? (
              group.user_groups.map(userGroup => (
                <div key={userGroup.id}>
                  <li>{userGroup.user.username}</li>
                  <p>{userGroup.message}</p>
                </div>
              ))
            ) : (
              <div>No members yet</div>
            )}
          </ul>
        </div>
    ))
  ) : (
    <div>No groups available</div>
  );

  return (
    <div>
      {userGroupList}
    </div>
  );
};

export default GroupList;
