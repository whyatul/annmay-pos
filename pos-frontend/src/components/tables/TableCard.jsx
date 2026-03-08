import React from "react";
import { useNavigate } from "react-router-dom";
import { getAvatarName } from "../../utils";
import { useDispatch } from "react-redux";
import { updateTable } from "../../redux/slices/customerSlice";

const TableCard = ({ id, name, status, initials, seats }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    if (status === "Booked") return;
    dispatch(updateTable({ table: { tableId: id, tableNo: name } }));
    navigate("/menu");
  };

  const isBooked = status === "Booked";

  return (
    <div
      onClick={handleClick}
      className={`group bg-[#1a1a1a] border rounded-xl p-4 transition-all duration-200 ${
        isBooked
          ? "border-emerald-500/20 cursor-default"
          : "border-[#222] hover:border-[#f6b100]/40 cursor-pointer"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[#f5f5f5] text-base font-bold">T-{name}</h2>
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
            isBooked
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-[#f6b100]/15 text-[#f6b100]"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="flex items-center justify-center py-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
            isBooked
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-[#222] text-[#555]"
          }`}
        >
          {getAvatarName(initials) || "—"}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <p className="text-[#555] text-xs">{seats} seats</p>
        {!isBooked && (
          <p className="text-[10px] text-[#f6b100] opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
            Select →
          </p>
        )}
      </div>
    </div>
  );
};

export default TableCard;
