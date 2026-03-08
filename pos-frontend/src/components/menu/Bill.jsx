import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTotalPrice } from "../../redux/slices/cartSlice";
import {
  addOrder,
  updateTable,
  getBillingSettings,
} from "../../https/index";
import { enqueueSnackbar } from "notistack";
import { useMutation, useQuery } from "@tanstack/react-query";
import { removeAllItems } from "../../redux/slices/cartSlice";
import { removeCustomer } from "../../redux/slices/customerSlice";
import Invoice from "../invoice/Invoice";

const Bill = () => {
  const dispatch = useDispatch();

  const customerData = useSelector((state) => state.customer);
  const cartData = useSelector((state) => state.cart);
  const total = useSelector(getTotalPrice);

  const { data: settingsRes } = useQuery({
    queryKey: ["billingSettings"],
    queryFn: getBillingSettings,
  });

  const billingSettings = settingsRes?.data?.data;
  const taxes = billingSettings?.taxes || [{ name: "Tax", rate: 10 }];
  const currency = billingSettings?.currency || "$";

  const taxLines = taxes.map((t) => ({
    name: t.name,
    rate: t.rate,
    amount: (total * (parseFloat(t.rate) || 0)) / 100,
  }));
  const tax = taxLines.reduce((sum, t) => sum + t.amount, 0);
  const totalPriceWithTax = total + tax;

  const [paymentMethod, setPaymentMethod] = useState();
  const [showInvoice, setShowInvoice] = useState(false);
  const [orderInfo, setOrderInfo] = useState();

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      enqueueSnackbar("Please select a payment method!", {
        variant: "warning",
      });
      return;
    }

    const orderData = {
      customerDetails: {
        name: customerData.customerName,
        phone: customerData.customerPhone,
        guests: customerData.guests,
      },
      orderStatus: "In Progress",
      orderType: customerData.orderType || "Dine In",
      bills: {
        total: total,
        tax: tax,
        totalWithTax: totalPriceWithTax,
      },
      items: cartData,
      table: customerData.table?.tableId || null,
      paymentMethod: paymentMethod,
    };
    orderMutation.mutate(orderData);
  };

  const orderMutation = useMutation({
    mutationFn: (reqData) => addOrder(reqData),
    onSuccess: (resData) => {
      const { data } = resData.data;

      setOrderInfo(data);

      if (data.tableId) {
        const tableData = {
          status: "Booked",
          orderId: data.id,
          tableId: data.tableId,
        };
        setTimeout(() => {
          tableUpdateMutation.mutate(tableData);
        }, 1500);
      } else {
        dispatch(removeCustomer());
        dispatch(removeAllItems());
      }
      enqueueSnackbar("Order Placed!", { variant: "success" });
      setShowInvoice(true);
    },
    onError: (error) => {
      enqueueSnackbar(
        error?.response?.data?.message || "Failed to place order!",
        { variant: "error" }
      );
    },
  });

  const tableUpdateMutation = useMutation({
    mutationFn: (reqData) => updateTable(reqData),
    onSuccess: (resData) => {
      dispatch(removeCustomer());
      dispatch(removeAllItems());
    },
  });

  return (
    <>
      <div className="space-y-3">
        {/* Payment toggle */}
        <div className="flex bg-gray-800 p-1 rounded-xl border border-gray-800 mb-2">
           <button
            onClick={() => setPaymentMethod("Cash")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              paymentMethod === "Cash" ? "bg-gray-900 text-gray-200 shadow-sm" : "text-gray-400 hover:text-gray-600"
            }`}
           >
             Cash
           </button>
           <button
            onClick={() => setPaymentMethod("Online")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              paymentMethod === "Online" ? "bg-gray-900 text-gray-200 shadow-sm" : "text-gray-400 hover:text-gray-600"
            }`}
           >
             Online
           </button>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-gray-500 font-medium text-sm">
            Subtotal
          </p>
          <span className="text-gray-100 text-sm font-bold">
            {currency}{total.toFixed(2)}
          </span>
        </div>
        {taxLines.map((t, i) => (
          <div key={i} className="flex items-center justify-between">
            <p className="text-gray-500 font-medium text-sm">
              {t.name} ({t.rate}%)
            </p>
            <span className="text-gray-100 text-sm font-bold">
              {currency}{t.amount.toFixed(2)}
            </span>
          </div>
        ))}
        
        <div className="border-t-[1.5px] border-dashed border-gray-700 my-2"></div>
        
        <div className="flex items-center justify-between">
          <p className="text-gray-100 font-bold text-lg">
            Total
          </p>
          <span className="text-gray-100 text-lg font-black">
            {currency}{totalPriceWithTax.toFixed(2)}
          </span>
        </div>

        {/* Action buttons */}
        <div className="pt-2">
          <button
            onClick={handlePlaceOrder}
            disabled={cartData.length === 0 || orderMutation.isPending}
            className="w-full bg-[#f85c60] hover:bg-[#f34b50] shadow-[0_4px_14px_rgba(248,92,96,0.3)] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed py-3.5 rounded-2xl text-white font-bold text-base transition-all"
          >
            {orderMutation.isPending ? "Printing..." : "Print Bills"}
          </button>
        </div>
      </div>

      {showInvoice && (
        <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />
      )}
    </>
  );
};

export default Bill;
