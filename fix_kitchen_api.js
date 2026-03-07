const fs = require('fs');
let file = 'pos-kitchen/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    'await axios.get(`${API_BASE}/order`);',
    'await axios.get(`${API_BASE}/order/kitchen/active`);'
);

content = content.replace(
    'await axios.put(`${API_BASE}/order/${id}`, { orderStatus: \'Completed\' });',
    'await axios.put(`${API_BASE}/order/kitchen/${id}/status`, { orderStatus: \'Completed\' });'
);

fs.writeFileSync(file, content);
console.log("App.jsx patched for kitchen APIs");
