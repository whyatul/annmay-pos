const fs = require('fs');

// Cart.jsx
let cartPath = 'pos-customer/src/pages/Cart.jsx';
let cartContent = fs.readFileSync(cartPath, 'utf-8');

// 1. Remove useState for guests
cartContent = cartContent.replace(/const\s+\[guests,\s*setGuests\]\s*=\s*useState\(1\);/g, '');

// 2. Remove guests from customerDetails payload
cartContent = cartContent.replace(/customerDetails:\s*\{\s*name,\s*phone,\s*guests\s*\}/g, 'customerDetails: { name, phone, guests: 1 }');

// 3. Remove guest UI block using regex
// The block starts with <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Number of Guests</label>
// and ends after the + button</div>
const UI_REGEX = /<div className="flex items-center gap-4">[\s\S]*?<label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Number of Guests<\/label>[\s\S]*?<\/div>[\s\S]*?<\/div>\n\s*<\/div>/;
cartContent = cartContent.replace(UI_REGEX, '');

fs.writeFileSync(cartPath, cartContent);

// Menu.jsx
let menuPath = 'pos-customer/src/pages/Menu.jsx';
let menuContent = fs.readFileSync(menuPath, 'utf-8');

// Remove the warning about table missing.
const warningRegex = /\{\/\*\s*Table Warning\s*\*\/\}[\s\S]*?\{\!table\s*&&\s*\!loading\s*&&\s*\([\s\S]*?<\/div>\s*\)\}/g;
menuContent = menuContent.replace(warningRegex, '');

fs.writeFileSync(menuPath, menuContent);
