import { useState, useEffect, useContext } from "react";
import { useFormik } from "formik"
import { UserContext } from "../../contexts/UserContext"
import * as yup from "yup"
import { GroupContext } from "../../contexts/GroupContext";

const GroupForm = ({ groupId, updateGroup, userGroups, deleteUserGroup }) => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [joinGroup, setJoinGroup] = useState(false)
  const [user, setUser] = useContext(UserContext)
  const [groups, setGroups] = useContext(GroupContext)

  const userJoinedGroup = userGroups.find(userGroup => userGroup.user_id === user.id)
  const userGroupId = userJoinedGroup ? userJoinedGroup.id : null

  // console.log(userJoinedGroup)


  useEffect(() => {
    if (userJoinedGroup) {
      setJoinGroup(true)
    } else {
      setJoinGroup(false)
    }
  }, [userGroups, user.id])

  const handleClick = () => {
    if (!joinGroup) {
      setJoinGroup(true)
      fetch("/api/user_groups", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          message: formik.values.message,
          group_id: groupId,
        }),
      })
      .then((res) => {
        if (res.ok) {
          res.json().then(data => {
            updateGroup(data)
            formik.resetForm()
          })
        } else {
          res.json()
          .then(res => setErrorMessage(res.error))  
        }
      })
    } else {
      setJoinGroup(false)
      if (userGroupId) {
        
        fetch(`/api/user_groups/${userGroupId}`, {
          method: "DELETE",
        })
        .then(res => {
          if (res.ok) {
            return res.json()
          } else {
            throw Error("Failed to leave group")
          }
        })
        .then(deleteUserGroup(userJoinedGroup))
      } else {
        throw Error("No user group id found")
      }
    }
  }

  const formSchema = yup.object().shape({
    message: yup.string().max(10, "message must be no longer than 10 characters.")
  })

  const formik = useFormik({
    initialValues:{
      message:""
    },
    validationSchema: formSchema
  })

  return (
    <div>
      {errorMessage && <p style={{ color:"red" }}>{errorMessage}</p>}
      {formik.errors && Object.values(formik.errors).map(error => <p style={{ color:"red" }}>{error}</p>)}
      <button onClick={handleClick}>{joinGroup ? "Leave Group" : "Join Group"}</button>
      <div>
        <input
          type="text"
          name="message"
          className="group-form-input"
          value={formik.values.message}
          placeholder="Enter message"
          onChange={formik.handleChange}
        />
      </div>
    </div>
  )
}

export default GroupForm;
