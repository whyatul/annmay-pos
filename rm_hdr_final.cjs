const fs = require('fs');
let hdrPath = '/home/whyyatul/Downloads/Restaurant_POS_System-master/pos-frontend/src/components/shared/Header.jsx';
let hdrContent = fs.readFileSync(hdrPath, 'utf-8');

// I will just use a generic replace for any UI block that contains Guests until its parent div.
let stratRegex = /<div>\s*<label className="block text-\[#888\] mb-1\.5 text-xs font-medium uppercase tracking-wider">\s*Guests\s*<\/label>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
hdrContent = hdrContent.replace(stratRegex, '');
fs.writeFileSync(hdrPath, hdrContent);
