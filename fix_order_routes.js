const fs = require('fs');
let file = 'pos-backend/routes/orderRoute.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    'router.route("/:id").put(isVerifiedUser, updateOrder);',
    'router.route("/:id").put(isVerifiedUser, updateOrder);\n\n// Kitchen endpoints (no auth for local network kitchen app)\nrouter.route("/kitchen/active").get(getOrders);\nrouter.route("/kitchen/:id/status").put(updateOrder);'
);

fs.writeFileSync(file, content);
console.log("orderRoute.js patched for kitchen.");
