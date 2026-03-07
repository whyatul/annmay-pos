import re

cart_file = "pos-customer/src/pages/Cart.jsx"
with open(cart_file, "r") as f:
    cart_content = f.read()

# Replace handleCheckout to use PhonePe
if "api/v1/payment/checkout" in cart_content:
    # Looks like we need to modify handleCheckout
    cart_content = re.sub(r'const handleCheckout = async \(\) => \{.+?(?=\n  return \(\n)', r'''const handleCheckout = async () => {
    if (orderType === 'Dine-in' && !tableNo) {
      toast.error('Please enter a valid table number for Dine-in.');
      return;
    }
    if (!customerInfo.name || !customerInfo.phone) {
      toast.error('Please fill in your name and phone number.');
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        name: customerInfo.name,
        phone: customerInfo.phone,
        amount: totalCost,
        orderId: `ORD-${Date.now()}`,
        cart: cartItems.map(item => ({
          menuItem: item._id,     // Backend expects menuItem ID
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        tableNo: tableNo || undefined,
        orderType: orderType,
      };

      // 1. Initiate Payment with PhonePe
      const initiateRes = await axios.post(`${import.meta.env.VITE_URL}/api/v1/payment/phonepe/initiate`, payload);
      
      console.log("MERC", initiateRes.data);

      if (initiateRes.data && initiateRes.data.success && initiateRes.data.data) {
        // Clear cart since the order is initiated
        dispatch(clearCart());
        toast.success("Redirecting to payment gateway...");
        
        // Save polling info
        localStorage.setItem("phonepe_trn_id", initiateRes.data.merchantTransactionId);
        
        // 2. Redirect to PhonePe page
        const redirectUrl = initiateRes.data.data.instrumentResponse?.redirectInfo?.url;
        if (redirectUrl) {
           window.location.href = redirectUrl;
        } else {
           toast.error("Invalid payment redirect URL");
        }
      } else {
        toast.error("Failed to initiate payment");
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

''', cart_content, flags=re.DOTALL)

with open(cart_file, "w") as f:
    f.write(cart_content)

print("fixed checkout")
