import { chromium } from '@playwright/test';
import fs from 'node:fs';
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const page=await browser.newPage();
 const bytes=await page.evaluate(async()=>{
  const c=document.createElement('canvas');c.width=640;c.height=360;const ctx=c.getContext('2d');
  const recorder=new MediaRecorder(c.captureStream(30),{mimeType:'video/webm;codecs=vp9'});const chunks=[];
  const done=new Promise(resolve=>{recorder.ondataavailable=e=>chunks.push(e.data);recorder.onstop=async()=>resolve(Array.from(new Uint8Array(await new Blob(chunks,{type:'video/webm'}).arrayBuffer())))});
  recorder.start();const start=performance.now();
  await new Promise(resolve=>{function draw(now){const t=(now-start)/1000;const bg=ctx.createLinearGradient(0,0,640,360);bg.addColorStop(0,'#092b5c');bg.addColorStop(1,'#0078d4');ctx.fillStyle=bg;ctx.fillRect(0,0,640,360);ctx.save();ctx.translate(320,170);ctx.rotate(t*.7);const g=ctx.createLinearGradient(-80,-80,80,80);g.addColorStop(0,'#c9edff');g.addColorStop(1,'#1d8fe3');ctx.fillStyle=g;ctx.beginPath();for(let i=0;i<160;i++){const a=i/160*Math.PI*2,r=75+Math.sin(a*3+t*2)*14;const x=Math.cos(a)*r,y=Math.sin(a)*r;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.closePath();ctx.fill();ctx.restore();ctx.fillStyle='#fff';ctx.font='20px Segoe UI';ctx.textAlign='center';ctx.fillText('Fluent motion study',320,310);if(t<3)requestAnimationFrame(draw);else{recorder.stop();resolve()}}requestAnimationFrame(draw)});
  return await done;
 });
 fs.writeFileSync('public/fluent-motion.webm',Buffer.from(bytes));console.log('Created public/fluent-motion.webm');
}finally{await browser.close()}
