const fs = require('fs');

let cartPath = 'pos-customer/src/pages/Cart.jsx';
let cartContent = fs.readFileSync(cartPath, 'utf-8');

// The label is: <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Number of Guests</label>
// Let's just remove the entire wrapping div.
// It's under something like <div className="flex items-center gap-4">
// I'll just match from `<label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Number of Guests</label>` to the next closure. OR better yet, just look for it by exact chunks.
let startIdx = cartContent.indexOf('<label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Number of Guests</label>');

if (startIdx !== -1) {
    let divStart = cartContent.lastIndexOf('<div', startIdx);
    let temp = cartContent.substring(divStart);
    // Find the end of this div block
    // We can just remove it bluntly
    cartContent = cartContent.substring(0, divStart) + temp.substring(temp.indexOf('</div>\n              </div>') + '</div>\n              </div>'.length);
}

// Ensure there are no guests= guests+1 references left that cause crash
cartContent = cartContent.replace(/<button[^>]*setGuests[^>]*>.*?<\/button>/g, '');
cartContent = cartContent.replace(/<span[^>]*>\{guests\}<\/span>/g, '');

fs.writeFileSync(cartPath, cartContent);
