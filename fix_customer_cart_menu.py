import re

cart_file = "pos-customer/src/pages/Cart.jsx"
with open(cart_file, "r") as f:
    cart_content = f.read()

# Add orderType to Cart and Checkout
if "const [orderType, setOrderType] = useState('Dine-in');" not in cart_content:
    cart_content = cart_content.replace(
        "const [tableNo, setTableNo] = useState(tableNoParam);",
        "const [tableNo, setTableNo] = useState(tableNoParam);\n  const [orderType, setOrderType] = useState('Dine-in');"
    )

    cart_content = cart_content.replace(
        "const handleCheckout = async () => {",
        """const handleCheckout = async () => {
    if (orderType === 'Dine-in' && !tableNo) {
      toast.error('Please enter a valid table number for Dine-in.');
      return;
    }"""
    )
    
    # Simple form insertion
    insert_idx = cart_content.find("</div>", cart_content.find('id="customer-info"'))
    if insert_idx != -1:
        form_html = """
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-orange-500" />
              Order Type *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="orderType" value="Dine-in" checked={orderType === 'Dine-in'} onChange={() => setOrderType('Dine-in')} className="text-orange-500 focus:ring-orange-500" />
                <span>Dine-in</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="orderType" value="Takeaway" checked={orderType === 'Takeaway'} onChange={() => setOrderType('Takeaway')} className="text-orange-500 focus:ring-orange-500" />
                <span>Takeaway</span>
              </label>
            </div>
          </div>
          {orderType === 'Dine-in' && (
"""       
        cart_content = cart_content.replace(
            '''<div className="mb-4 relative">
            <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
              <span className="w-5 h-5 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full text-xs font-bold">#</span>
              Table Number {!tableNoParam && <span className="text-red-500">*</span>}
            </label>''',
            form_html + '''<div className="mb-4 relative">
            <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
              <span className="w-5 h-5 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full text-xs font-bold">#</span>
              Table Number {!tableNoParam && <span className="text-red-500">*</span>}
            </label>'''
        )

with open(cart_file, "w") as f:
    f.write(cart_content)
print("Updated Cart.jsx")
