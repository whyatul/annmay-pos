import re

cart_file = "pos-customer/src/pages/Cart.jsx"
with open(cart_file, "r") as f:
    orig = f.read()

# We need to add setOrderType to imports
if "setOrderType" not in orig:
    orig = orig.replace("clearCart } from '../store';", "clearCart, setOrderType } from '../store';")

insertion = """
          {/* Order Type Toggle */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Order Type</h3>
            <div className="flex gap-4">
              <button 
                onClick={() => dispatch(setOrderType('Dine In'))}
                className={`flex-1 py-3.5 rounded-xl font-medium border-2 transition-all ${
                  orderType === 'Dine In'
                    ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm'
                    : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                Dine In
              </button>
              <button 
                onClick={() => dispatch(setOrderType('Takeaway'))}
                className={`flex-1 py-3.5 rounded-xl font-medium border-2 transition-all ${
                  orderType === 'Takeaway'
                    ? 'bg-orange-50 text-orange-600 border-orange-200 shadow-sm'
                    : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                Takeaway
              </button>
            </div>
          </div>
"""

if "Order Type Toggle" not in orig:
    orig = orig.replace("{/* Your Details */}", insertion + "\n          {/* Your Details */}")

with open(cart_file, "w") as f:
    f.write(orig)

