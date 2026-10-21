import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

// Both inputs must originate from Windows.Graphics.Capture. Browser screenshots
// are deliberately kept outside this evidence directory.
const [reference, candidate, output = 'visual-evidence/comparison', cropFile] = process.argv.slice(2);
if (!reference || !candidate) throw new Error('Usage: node scripts/compare-system-captures.mjs native.jpg tauri.jpg output-directory [crops.json]');
await fs.mkdir(output, { recursive: true });
const crops = cropFile ? JSON.parse(await fs.readFile(cropFile, 'utf8')) : null;
async function read(file, crop) {
  const input = sharp(file);
  return (crop ? input.extract(crop) : input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
}
const a = await read(reference, crops?.reference);
const b = await read(candidate, crops?.candidate);
if (a.info.width !== b.info.width || a.info.height !== b.info.height) throw new Error('Capture dimensions differ. Match DPI/window size or supply equal-size explicit crops; resizing would hide geometry errors.');
const { width, height } = a.info;
const pixels = width * height;
const difference = Buffer.alloc(pixels * 3);
let changed = 0, sum = 0;
for (let p = 0; p < pixels; p++) {
  let maximum = 0;
  for (let c = 0; c < 3; c++) {
    const d = Math.abs(a.data[p * 3 + c] - b.data[p * 3 + c]);
    sum += d;
    maximum = Math.max(maximum, d);
    difference[p * 3 + c] = Math.min(255, d * 4);
  }
  // JPEG capture noise is reported with a 16/255 tolerance, not a pass threshold.
  if (maximum > 16) changed++;
}
const raw = { width, height, channels: 3 };
await sharp(difference, {raw}).png().toFile(path.join(output, 'difference.png'));
const aa = await sharp(a.data, {raw}).png().toBuffer();
const bb = await sharp(b.data, {raw}).png().toBuffer();
await sharp({create:{width:width*2,height,channels:3,background:'#ffffff'}}).composite([{input:aa,left:0,top:0},{input:bb,left:width,top:0}]).png().toFile(path.join(output,'side-by-side.png'));
const report = {reference,candidate,crops,width,height,meanAbsoluteChannelError:sum/(pixels*3),changedPixelRatio:changed/pixels,noiseTolerance:16,status:'requires-review',captureMethod:'Windows.Graphics.Capture'};
await fs.writeFile(path.join(output,'metrics.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
