import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"
import GroupForm from './GroupForm';

const GroupList = ({ groups, updateGroup, deleteUserGroup, currentUser, user }) => {
  const [openGroupID, setOpenGroupID] = useState(null);
  const [inputSearch, setInputSearch] = useState("");
  const [sortOption, setSortOption] = useState("")
  const [showJoinedOnly, setShowJoinedOnly] = useState(false)


  const toggleGroup = (id) => {
    setOpenGroupID(openGroupID === id ? null : id)
  }

  const handleSearch = (e) => {
    setInputSearch(e.target.value);
  }

  let displayedGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(inputSearch.trim().toLowerCase())
  );

  if (showJoinedOnly) {
    displayedGroups = displayedGroups.filter(group =>
      group.user_groups.some(ug => ug.user_id === user.id)
    );
  }

  if (sortOption === "az") {
    displayedGroups.sort((a,b) => a.name.localeCompare(b.name));
  } else if (sortOption === "za") {
    displayedGroups.sort((a,b) => b.name.localeCompare(a.name));
  } else if (sortOption === "members") {
    displayedGroups.sort((a,b) => b.user_groups.length - a.user_groups.length);
  }  
   

  if (!Array.isArray(groups) || groups.length === 0) {
    return <div className="text-gray-500 p-4">No groups available</div>;
  }


  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discover Groups 💬</h1>
          <p>Join communities that share your interests!</p>
        </div>

        <button
          className="bg-[#FF7E6B] hover:bg-[#E56253] text-white font-medium px-4 py-2 rounded-lg shadow-md transition-all duration-200"
        >
          Create Group
        </button>
      </div>
        

      {/* Search/filter bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
        <input
          type="text"
          onChange={(e) => handleSearch(e)}
          placeholder="Search groups..."
          className="mt-3 sm:mt-0 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex items-center gap-3">
          {/* Sort dropdown */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
          >
            <option value="az">Sort: A-Z</option>
            <option value="za">Sort: Z-A</option>
            <option value="members">Sort: Most Members</option>
          </select>

          {/* Joined toggle */}
          <button
            onClick={() => setShowJoinedOnly(prev => !prev)}
            className={`px-3 py-2 text-sm rounded-lg border transition ${
              showJoinedOnly 
                ? "bg-blue-100 border-blue-400 text-blue-600" 
                : "border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {showJoinedOnly ? "Show All Groups" : "Show Joined Groups"}
          </button>
        </div>
      </div>
      


      {displayedGroups.map((group) => (
        <div
          key={group.id}
          className=" flex flex-col gap-1 bg-white rounded-xl shadow-md border border-gray-200 p-5"
        >
          {/* Group Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#3D7E9F]">{group.name}</h2>

            <GroupForm
              groupId={group.id}
              updateGroup={updateGroup}
              deleteUserGroup={deleteUserGroup}
              userGroups={group.user_groups}
            />
          </div>

          {/* Dropdown Toggle */}
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

          {/* Members List */}
          {openGroupID === group.id && (
            <div className="mt-4 bg-gray rounded-lg p-4 border border-gray-200 max-h-60 overflow-y-auto">
              {group.user_groups && group.user_groups.length > 0 ? (
                <ul className="space-y-2">
                  {group.user_groups.map((userGroup) => (
                    <li
                      key={userGroup.id}
                      className="flex items-start gap-3 bg-white rounded-lg shadow-sm p-3"
                    >
                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-full bg-[#86ABBD] text-white flex items-center justify-center font-semibold">
                          {userGroup.user.username[0].toUpperCase()}
                      </div>

                      {/* Content */}
                      <div>
                        <span className="text-gray-800 font-medium">
                          {userGroup.user.username}
                        </span>
                      
                        {/* Optional message */}
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


          )}

        </div>
      ))}
    </div>
  );
};

export default GroupList;
