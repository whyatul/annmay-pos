import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBillingSettings } from "../../https/index";
import annamayLogo from "../../assets/images/annamay-logo.svg";

const Invoice = ({ orderInfo, setShowInvoice }) => {
  const invoiceRef = useRef(null);

  const { data: settingsRes } = useQuery({
    queryKey: ["billingSettings"],
    queryFn: getBillingSettings,
  });

  const s = settingsRes?.data?.data || {};
  const restaurantName = s.restaurantName || "Restaurant";
  const address = s.address || "";
  const phone = s.phone || "";
  const currency = s.currency || "₹";
  const footerText = s.footerText || "PLEASE VISIT US AGAIN\nTHANK YOU!!";
  const showLogo = s.showLogo ?? true;
  const taxes = s.taxes || [];

  // Calculate taxes from settings
  const subtotal = orderInfo.total || 0;
  const taxLines = taxes.map((t) => ({
    name: t.name,
    rate: t.rate,
    amount: (subtotal * (parseFloat(t.rate) || 0)) / 100,
  }));
  const taxTotal = taxLines.reduce((sum, t) => sum + t.amount, 0);
  const grandTotal = subtotal + taxTotal;

  // Format date
  const orderDate = orderInfo.orderDate
    ? new Date(orderInfo.orderDate)
    : new Date();
  const dateStr = orderDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = orderDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const handlePrint = () => {
    const printContent = invoiceRef.current.innerHTML;
    const WinPrint = window.open("", "", "width=400,height=700");

    WinPrint.document.write(`
      <html>
        <head>
          <title>Receipt #${orderInfo.id}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Georgia', serif; padding: 10px; width: 300px; margin: 0 auto; }
            .receipt { padding: 15px 10px; }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .text-xs { font-size: 11px; }
            .text-sm { font-size: 13px; }
            .text-lg { font-size: 16px; }
            .my-2 { margin: 8px 0; }
            .my-3 { margin: 12px 0; }
            .my-4 { margin: 16px 0; }
            .dotted { border-bottom: 1px dotted #999; margin: 6px 0; }
            .flex { display: flex; justify-content: space-between; }
            .left { text-align: left; }
            .right { text-align: right; }
            .items-header { display: flex; font-weight: bold; font-size: 11px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
            .items-header span:first-child { flex: 1; }
            .items-header span { width: 70px; text-align: right; }
            .item-row { display: flex; font-size: 11px; padding: 2px 0; }
            .item-row span:first-child { flex: 1; }
            .item-row span { width: 70px; text-align: right; }
            .total-row { display: flex; justify-content: space-between; font-size: 11px; }
            .grand-total { display: flex; justify-content: space-between; font-size: 13px; font-weight: bold; }
            .footer { text-transform: uppercase; font-weight: bold; font-size: 11px; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);

    WinPrint.document.close();
    WinPrint.focus();
    setTimeout(() => {
      WinPrint.print();
      WinPrint.close();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-[340px] max-h-[90vh] overflow-y-auto">
        {/* Printable receipt area */}
        <div ref={invoiceRef} style={{ fontFamily: "Georgia, serif" }} className="p-6 text-black">
          {/* Logo */}
          {showLogo && (
            <div className="flex justify-center mb-2">
              <img src={annamayLogo} alt="Annamay" className="h-12 w-12 rounded-lg object-cover" />
            </div>
          )}

          {/* Restaurant Name */}
          <h2 className="text-center font-bold text-lg" style={{ fontFamily: "Georgia, serif" }}>
            {restaurantName}
          </h2>

          {/* Address lines */}
          {address &&
            address.split("\n").map((line, i) => (
              <p key={i} className="text-center text-xs text-gray-700">
                {line}
              </p>
            ))}

          {/* Phone */}
          {phone && (
            <p className="text-center text-xs text-gray-200 font-semibold">
              {phone}
            </p>
          )}

          <div className="my-4" />

          {/* Order Info */}
          <div className="text-xs space-y-0.5 text-left">
            <p>Receipt No.: {orderInfo.id}</p>
            {orderInfo.tableId && <p>Table No.: {orderInfo.tableId}</p>}
            {orderInfo.orderType === "Takeaway" && <p>Order Type: Takeaway</p>}
            <p>
              Date: {dateStr} &nbsp; {timeStr}
            </p>
            <p>Customer Name: {orderInfo.customerName}</p>
          </div>

          <div className="my-3" />

          {/* Items Header */}
          <div className="flex text-xs font-bold border-b border-gray-300 pb-1">
            <span className="flex-1 text-left">QTY/ Item Name</span>
            <span className="w-[70px] text-right">Price</span>
            <span className="w-[70px] text-right">Amount</span>
          </div>

          {/* Dotted separator */}
          <div className="border-b border-dotted border-gray-400 my-1" />

          {/* Items */}
          {orderInfo.items.map((item, index) => (
            <div key={index} className="flex text-xs py-0.5">
              <span className="flex-1 text-left">
                {item.quantity} &nbsp;{item.name}
              </span>
              <span className="w-[70px] text-right">
                {(item.price / item.quantity).toFixed(2)}
              </span>
              <span className="w-[70px] text-right">
                {item.price.toFixed(2)}
              </span>
            </div>
          ))}

          {/* Dotted separator */}
          <div className="border-b border-dotted border-gray-400 my-2" />

          {/* Totals */}
          <div className="text-xs space-y-0.5">
            <div className="flex justify-between">
              <span>Sub Total:</span>
              <span>{subtotal.toFixed(2)}</span>
            </div>
            {taxLines.map((t, i) => (
              <div key={i} className="flex justify-between">
                <span>
                  {t.name}: {t.rate}%
                </span>
                <span>{t.amount.toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-sm pt-1">
              <span>Total:</span>
              <span>
                {grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="my-4" />

          {/* Payment Mode */}
          <div className="text-xs text-left">
            <p>Payment Mode: {orderInfo.paymentMethod}</p>
          </div>

          <div className="my-8" />

          {/* Footer */}
          {footerText &&
            footerText.split("\n").map((line, i) => (
              <p
                key={i}
                className="text-xs font-bold text-center uppercase"
              >
                {line}
              </p>
            ))}
        </div>

        {/* Action Buttons (not printed) */}
        <div className="flex border-t border-gray-700 divide-x divide-gray-200">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
          >
            Print Receipt
          </button>
          <button
            onClick={() => setShowInvoice(false)}
            className="flex-1 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
