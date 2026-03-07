const fs = require('fs');

let cartPath = 'pos-customer/src/pages/Cart.jsx';
let cartContent = fs.readFileSync(cartPath, 'utf-8');

cartContent = cartContent.replace(/if\s*\(!table\)\s*\{\s*alert\("No table assigned\. Please scan QR code again\."\);\s*return;\s*\}/g, '');
cartContent = cartContent.replace(/Table \{table \|\| '\?'\}/g, '{table ? `Table ${table}` : "Generic Order"}');
cartContent = cartContent.replace(/orderType:\s*"Dine In"/g, 'orderType: table ? "Dine In" : "Takeaway"');

fs.writeFileSync(cartPath, cartContent);
