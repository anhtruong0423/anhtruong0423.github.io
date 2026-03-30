const fs = require('fs');
const path = require('path');

const destDir = 'c:\\portfolio\\ui\\travel\\images';
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const images = {
  'hero_travel_1774805339830.png': 'hero.png',
  'dest_sapa_1774805358652.png': 'sapa.png',
  'dest_hoian_1774805374560.png': 'hoian.png',
  'dest_dalat_1774805402269.png': 'dalat.png',
  'dest_phuquoc_1774805420379.png': 'phuquoc.png',
  'dest_nhatrang_1774805436715.png': 'nhatrang.png',
  'dest_phongnya_1774805451359.png': 'phongnya.png'
};

const srcBase = 'C:\\Users\\anhtr\\.gemini\\antigravity\\brain\\e83f5bd3-cf64-4b61-8e80-13283f8a1f73';

for (const [srcName, destName] of Object.entries(images)) {
  const src = path.join(srcBase, srcName);
  const dest = path.join(destDir, destName);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${srcName} to ${destName}`);
  } else {
    console.log(`Source not found: ${src}`);
  }
}
