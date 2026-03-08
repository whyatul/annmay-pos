import React, { useState, useEffect } from "react";
import TableCard from "../components/tables/TableCard";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTables } from "../https";
import { enqueueSnackbar } from "notistack";

const filters = [
  { key: "all", label: "All" },
  { key: "Available", label: "Available" },
  { key: "Booked", label: "Booked" },
];

const Tables = () => {
  const [status, setStatus] = useState("all");

  useEffect(() => {
    document.title = "POS | Tables";
  }, []);

  const { data: resData, isError } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => await getTables(),
    placeholderData: keepPreviousData,
  });

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  const allTables = resData?.data?.data || [];
  const filtered =
    status === "all" ? allTables : allTables.filter((t) => t.status === status);

  return (
    <section className="bg-[#141414] h-full overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-[#f5f5f5] text-lg font-bold">Tables</h1>
          <span className="text-xs text-[#666] bg-[#1a1a1a] border border-[#222] px-3 py-1 rounded-full">
            {filtered.length} of {allTables.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#1a1a1a] rounded-xl p-1 border border-[#222]">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatus(f.key)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                status === f.key
                  ? "bg-[#f6b100] text-[#111]"
                  : "text-[#888] hover:text-[#f5f5f5]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-8 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map((table) => (
            <TableCard
              key={table.id}
              id={table.id}
              name={table.tableNo}
              status={table.status}
              initials={table.Orders?.[0]?.customerName}
              seats={table.seats}
            />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-[#555] text-sm text-center py-20">
              No tables found
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Tables;
