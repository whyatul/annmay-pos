import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowLeft } from "lucide-react";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10">
        <CheckCircle className="text-emerald-400" size={48} />
      </div>

      <h1 className="text-3xl font-bold text-white mb-2">Order Placed!</h1>
      <p className="text-gray-400 mb-2">
        Your order has been sent to the kitchen.
      </p>
      <p className="text-gray-500 text-sm mb-8">
        Sit back and relax — your food will be ready shortly.
      </p>

      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-2 bg-brand-500 text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-brand-600 transition-colors"
      >
        <ArrowLeft size={18} /> Browse Menu Again
      </button>
    </div>
  );
};

export default OrderSuccess;
