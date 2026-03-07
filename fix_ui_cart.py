import re

cart_file = "pos-customer/src/pages/Cart.jsx"
with open(cart_file, "r") as f:
    orig = f.read()
    
# We need to add setOrderType to imports
if "setOrderType" not in orig:
    orig = orig.replace("clearCart } from '../store';", "clearCart, setOrderType } from '../store';")

# We need to add the toggle in the UI. 
# Let's find "customerDetails" form.

insertion = """
          {/* Order Type Toggle */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
            <h2 className="font-semibold text-gray-800 mb-3">Order Type</h2>
            <div className="flex gap-3">
              <button 
                onClick={() => dispatch(setOrderType('Dine In'))}
                className={`flex-1 py-2.5 rounded-xl font-medium border transition-colors ${
                  orderType === 'Dine In'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                Dine In
              </button>
              <button 
                onClick={() => dispatch(setOrderType('Takeaway'))}
                className={`flex-1 py-2.5 rounded-xl font-medium border transition-colors ${
                  orderType === 'Takeaway'
                    ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-200'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                Takeaway
              </button>
            </div>
          </div>
"""

# Let's insert it before "{/* Customer Details */}" or in the similar area
# We can search for the "Customer Details" or "Your Details" area.
# Let's see if we can find '<div className="space-y-4">' or something similar.

if "Order Type Toggle" not in orig:
    if "{/* Customer Details */}" in orig:
        orig = orig.replace("{/* Customer Details */}", insertion + "\n          {/* Customer Details */}")
    elif "Your Details" in orig:
        # Before the parent div of Your Details
        orig = re.sub(r'(<div[^>]*>[\s]*<h2[^>]*>Your Details</h2>)', insertion + r'\1', orig)
    else:
        # Just put it inside the first column or main content area
        # We can look for {items.map
        orig = orig.replace("          {/* Order Items */}", insertion + "\n          {/* Order Items */}")

with open(cart_file, "w") as f:
    f.write(orig)

print("Updated UI in Cart.jsx")
