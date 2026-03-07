const fs = require('fs');

let navPath = 'pos-frontend/src/components/shared/BottomNav.jsx';
let navContent = fs.readFileSync(navPath, 'utf-8');
navContent = navContent.replace(/const\s+\[guestCount,\s*setGuestCount\]\s*=\s*useState\(.*?\);/g, '');
navContent = navContent.replace(/guests:\s*guestCount/g, 'guests: 1');
navContent = navContent.replace(/<label[^>]*>Guest<\/label>[\s\S]*?(?=<\/div>\s*<div[^>]*>\s*<button)/, '');
fs.writeFileSync(navPath, navContent);

let hdrPath = 'pos-frontend/src/components/shared/Header.jsx';
let hdrContent = fs.readFileSync(hdrPath, 'utf-8');
hdrContent = hdrContent.replace(/const\s+\[guestCount,\s*setGuestCount\]\s*=\s*useState\(.*?\);/g, '');
hdrContent = hdrContent.replace(/guests:\s*guestCount/g, 'guests: 1');
hdrContent = hdrContent.replace(/setGuestCount\(1\);/g, '');
let hdrStartIdx = hdrContent.indexOf('<label className="block text-sm font-semibold mb-2">Guests</label>');
if (hdrStartIdx !== -1) {
    let divStart = hdrContent.lastIndexOf('<div', hdrStartIdx);
    let temp = hdrContent.substring(divStart);
    hdrContent = hdrContent.substring(0, divStart) + temp.substring(temp.indexOf('</div>\n            </div>') + '</div>\n            </div>'.length);
}
fs.writeFileSync(hdrPath, hdrContent);
