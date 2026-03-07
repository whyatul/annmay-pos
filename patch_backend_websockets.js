const fs = require('fs');

let orderCtrlPath = 'pos-backend/controllers/orderController.js';
let orderCtrl = fs.readFileSync(orderCtrlPath, 'utf8');

// Add socket emit for new orders
if (!orderCtrl.includes('req.io.emit("newOrder"')) {
    orderCtrl = orderCtrl.replace(
        'res\n      .status(201)\n      .json({ success: true, message: "Order created!", data: newOrder });',
        'req.io.emit("newOrder", newOrder);\n    res\n      .status(201)\n      .json({ success: true, message: "Order created!", data: newOrder });'
    );
    // fallback if formatting is different
    orderCtrl = orderCtrl.replace(
        'res.status(201).json({ success: true, message: "Order created!", data: newOrder });',
        'req.io.emit("newOrder", newOrder);\n    res.status(201).json({ success: true, message: "Order created!", data: newOrder });'
    );
}

// Add socket emit for updated orders
if (!orderCtrl.includes('req.io.emit("orderUpdated"')) {
    orderCtrl = orderCtrl.replace(
        'res\n      .status(200)\n      .json({ success: true, message: "Order updated", data: order });',
        'req.io.emit("orderUpdated", order);\n    res\n      .status(200)\n      .json({ success: true, message: "Order updated", data: order });'
    );
    orderCtrl = orderCtrl.replace(
        'res.status(200).json({ success: true, message: "Order updated", data: order });',
        'req.io.emit("orderUpdated", order);\n    res.status(200).json({ success: true, message: "Order updated", data: order });'
    );
}

fs.writeFileSync(orderCtrlPath, orderCtrl);
console.log("orderController.js patched with socket emits");

