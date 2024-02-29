import GroupForm from './GroupForm';

const GroupList = ({ userGroups, updateUserGroup }) => {

  const userGroupList = userGroups.map(userGroup => (
    <div key={userGroup.id}>
      <h2>{userGroup.group.name}</h2>
      <GroupForm
        className="join-group-button"
        updateUserGroup={updateUserGroup}
        groupId={userGroup.group.id}
      />
      <h4>Members:</h4>
      <ul>
        {userGroup.user ? (
          <div key={userGroup.user.id}>
            <li>{userGroup.user.username}</li>
            <p>{userGroup.message}</p>
          </div>
        ) : (
          <div>No members yet</div>
        )}
      </ul>
    </div>
  ));

  return (
    <div>
      {userGroupList}
    </div>
  );
};

export default GroupList;
