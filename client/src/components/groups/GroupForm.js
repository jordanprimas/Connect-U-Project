import { useState } from "react";

const GroupForm = ({ groupId, updateUserGroup }) => {
  const [message, setMessage] = useState("");

  const handleClick = () => {
    fetch("/api/user_groups", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        group_id: groupId,
      }),
    })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Failed to join group");
      }
    })
    .then((updatedUserGroup) => {
      updateUserGroup(updatedUserGroup, groupId);
    })
    .catch((error) => {
      console.error("Failed to join group:", error);
    });
  };

  
  return (
    <div>
      <button onClick={handleClick}>Join Group</button>
      <div>
        <input
          type="text"
          className="group-form-input"
          value={message}
          placeholder="Enter message"
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
    </div>
  );
};

export default GroupForm;
