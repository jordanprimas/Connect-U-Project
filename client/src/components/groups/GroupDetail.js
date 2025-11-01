import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


const GroupDetail = () => {
    const [openGroupID, setOpenGroupID] = useState(null);
    const { id } = useParams();
    const [group, setGroup] = useState(null);

  useEffect(() => {
    fetch(`/api/groups/${id}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setGroup(data);
      });
  }, [id]);


    const toggleGroup = (id) => {
        setOpenGroupID(openGroupID === id ? null : id)
    }


   return (
    <div>
      {group ? (
        <>
          <h2>{group.name}</h2>
          <p>Discussion</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
);
};

export default GroupDetail;

 {/* Dropdown Toggle
            <button 
              onClick={() => toggleGroup(group.id)}
              className="flex items-center gap-2 text-sm text-[#3D7E9F] font-medium hover:text-[#86ABBD] transition"
            >
              {openGroupID === group.id ? (
                <>
                  Hide Members <ChevronUp size={16} />
                </>
              ) : (
                <>
                  View Members <ChevronDown size={16} />
                </>
              )}
            </button>

            Members List
            {openGroupID === group.id && (
              <div className="mt-4 bg-gray rounded-lg p-4 border border-gray-200 max-h-60 overflow-y-auto">
                {group.user_groups && group.user_groups.length > 0 ? (
                  <ul className="space-y-2">
                    {group.user_groups.map((userGroup) => (
                      <li
                        key={userGroup.id}
                        className="flex items-start gap-3 bg-white rounded-lg shadow-sm p-3"
                      >
                        - Avatar 
                        <div className="w-8 h-8 rounded-full bg-[#86ABBD] text-white flex items-center justify-center font-semibold">
                            {userGroup.user.username[0].toUpperCase()}
                        </div>

                        - Content
                        <div>
                          <span className="text-gray-800 font-medium">
                            {userGroup.user.username}
                          </span>
                        
                          - Optional message
                          {userGroup.message && (
                            <p className="text-sm text-gray-600">{userGroup.message}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No members yet</p>
                )}
              </div>


            )} */}