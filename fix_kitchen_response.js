const fs = require('fs');
let file = 'pos-kitchen/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    'if (res.data.success) {',
    'if (res.data && res.data.data) {'
);

fs.writeFileSync(file, content);
console.log("App.jsx patched for response format");
