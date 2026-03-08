import React from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getOrders, updateOrderStatus } from "../../https/index";
import { formatDateAndTime } from "../../utils";

const RecentOrders = () => {
  const queryClient = useQueryClient();
  const handleStatusChange = ({orderId, orderStatus}) => {
    if (orderStatus === "Cancelled" && !window.confirm("Cancel this order? This will free the table.")) return;
    orderStatusUpdateMutation.mutate({orderId, orderStatus});
  };

  const orderStatusUpdateMutation = useMutation({
    mutationFn: ({orderId, orderStatus}) => updateOrderStatus({orderId, orderStatus}),
    onSuccess: () => {
      enqueueSnackbar("Order status updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["orders"]);
      queryClient.invalidateQueries(["tables"]);
    },
    onError: () => {
      enqueueSnackbar("Failed to update order status!", { variant: "error" });
    }
  })

  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
  });

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  const statusColor = (s) => {
    if (s === "Ready") return "text-green-500";
    if (s === "Completed") return "text-blue-500";
    if (s === "Cancelled") return "text-red-500";
    return "text-yellow-500";
  };

  return (
    <div className="container mx-auto bg-[#262626] p-4 rounded-lg">
      <h2 className="text-[#f5f5f5] text-xl font-semibold mb-4">
        Recent Orders
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[#f5f5f5]">
          <thead className="bg-[#333] text-[#ababab]">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date & Time</th>
              <th className="p-3">Items</th>
              <th className="p-3">Table No</th>
              <th className="p-3">Total</th>
              <th className="p-3 text-center">Payment</th>
            </tr>
          </thead>
          <tbody>
            {resData?.data?.data?.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-600 hover:bg-[#333]"
              >
                <td className="p-4">#{order.id}</td>
                <td className="p-4">{order.customerName}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    order.orderType === "Takeaway"
                      ? "bg-orange-500/15 text-orange-400"
                      : "bg-blue-500/15 text-blue-400"
                  }`}>
                    {order.orderType || "Dine In"}
                  </span>
                </td>
                <td className="p-4">
                  <select
                    className={`bg-[#1a1a1a] border border-gray-500 p-2 rounded-lg focus:outline-none ${statusColor(order.orderStatus)}`}
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange({orderId: order.id, orderStatus: e.target.value})}
                    disabled={order.orderStatus === "Cancelled" || order.orderStatus === "Completed"}
                  >
                    <option className="text-yellow-500" value="In Progress">
                      In Progress
                    </option>
                    <option className="text-green-500" value="Ready">
                      Ready
                    </option>
                    <option className="text-blue-500" value="Completed">
                      Completed
                    </option>
                    <option className="text-red-500" value="Cancelled">
                      Cancelled
                    </option>
                  </select>
                </td>
                <td className="p-4">{formatDateAndTime(order.orderDate)}</td>
                <td className="p-4">{order.items?.length || 0} Items</td>
                <td className="p-4">
                  {order.orderType === "Takeaway"
                    ? "Takeaway"
                    : `Table - ${order.Table?.tableNo || "N/A"}`}
                </td>
                <td className="p-4">₹{order.totalWithTax?.toFixed(2)}</td>
                <td className="p-4 text-center">
                  {order.paymentMethod}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
