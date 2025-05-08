import React from "react";
import moment from "moment";
import { MdOutlinePushPin } from "react-icons/md";
import { MdCreate, MdDelete } from "react-icons/md";

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  return (
    <div className="border border-primary border-gray-300 p-4 rounded bg-white hover:shadow-md transition-all ease-in-out">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm font-medium">{title}</h6>
          <span className="text-xs text-slate-500">{moment(date).format("Do MMM YYYY")}</span>
        </div>

        <MdOutlinePushPin className={`icon-btn text-[26px] hover:text-[#ED9889] ${isPinned ? 'text-primary rotate-20 duration-300' : 'text-slate-300 duration-300'}`} onClick={onPinNote} />
      </div>

      <p className="text-xs text-gray-600 mt-2">{content?.slice(0, 60)}</p>

      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-slate-500">{tags.map((item) => `#${item} `)}</div>

        <div className="flex items-center gap-2">
          <MdCreate
            className="icon-btn hover:text-green-600"
            onClick={onEdit}
          />

          <MdDelete
            className="icon-btn hover:text-red-500"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
