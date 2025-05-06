import React from "react";
import { getInitials } from "../../utils/helper";

const ProfileInfo = ({ userInfo, onLogout }) => {
  if (!userInfo) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-700 font-medium bg-[#9AC7E3]">
        {getInitials(userInfo?.fullName)}
      </div>

      <div>
        <p className="text-sm font-medium">{userInfo?.fullName || "Loading..."}</p>
        <button className="text-sm text-slate-700 underline" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
