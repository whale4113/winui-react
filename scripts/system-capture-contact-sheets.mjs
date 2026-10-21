import fs from 'node:fs/promises';
import sharp from 'sharp';
const inventory = JSON.parse(await fs.readFile('visual-evidence/inventory.json','utf8'));
await fs.mkdir('visual-evidence/contact-sheets',{recursive:true});
for (const theme of ['light','dark']) {
  const names = inventory.catalog.map(c=>c.name);
  const hashes = new Map();
  for (let start=0;start<names.length;start+=35) {
    const chunk=names.slice(start,start+35);
    const overlays=[];
    for (let row=0;row<chunk.length;row++) {
      const name=chunk[row];
      const file=`visual-evidence/tauri/${name}-${theme}.jpg`;
      const metadata=await sharp(file).metadata();
      if (metadata.width<1000 || metadata.height<500) throw new Error(`Invalid main window capture: ${file}`);
      const header=await sharp(file).extract({left:350,top:76,width:700,height:42}).png().toBuffer();
      const hash=(await import('node:crypto')).createHash('sha256').update(header).digest('hex');
      if(hashes.has(hash)) throw new Error(`Duplicate title capture: ${name}, ${hashes.get(hash)}`);
      hashes.set(hash,name);
      const label=Buffer.from(`<svg width="250" height="42"><rect width="250" height="42" fill="white"/><text x="8" y="26" font-family="Segoe UI" font-size="14">${name}</text></svg>`);
      overlays.push({input:label,left:0,top:row*44},{input:header,left:250,top:row*44});
    }
    await sharp({create:{width:950,height:chunk.length*44,channels:3,background:'#dddddd'}}).composite(overlays).png().toFile(`visual-evidence/contact-sheets/${theme}-${Math.floor(start/35)+1}.png`);
  }
}
