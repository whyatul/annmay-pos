const fs = require('fs');
let appPath = 'pos-kitchen/src/App.jsx';
let app = fs.readFileSync(appPath, 'utf8');

if (!app.includes('socket.on("orderUpdated"')) {
    app = app.replace(
        'socket.on("newOrder", (order) => {',
        `socket.on("orderUpdated", (updatedOrder) => {
      if (updatedOrder.orderStatus === 'Completed' || updatedOrder.orderStatus === 'Cancelled') {
        setOrders(prev => prev.filter(o => o.id !== updatedOrder.id));
      } else {
        setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
      }
    });\n    socket.on("newOrder", (order) => {`
    );
    fs.writeFileSync(appPath, app);
    console.log("App.jsx patched with orderUpdated");
}
