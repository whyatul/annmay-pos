const fs = require('fs');
const file = 'pos-frontend/src/components/shared/Header.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '            </div>\n            </div>\n            </div>\n            {/* Order Type Toggle */}\n            <div>\n              <label className="block text-[#888] mb-1.5 text-xs font-medium uppercase tracking-wider">',
  '            </div>\n          </div>\n          {/* Order Type Toggle */}\n          <div>\n            <label className="block text-[#888] mb-1.5 text-xs font-medium uppercase tracking-wider">'
);

fs.writeFileSync(file, content);
console.log("Fixed Header.jsx tags!");
