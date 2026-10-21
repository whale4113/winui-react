// Import from node_repl after initializing @oai/sky and selecting exactly one
// returned Tauri window. All app input and screenshots use the Computer Use API.
import fs from 'node:fs/promises';
import path from 'node:path';

export async function captureNextBatch(sky, window, names, theme) {
  const directory = path.resolve('visual-evidence/tauri');
  await fs.mkdir(directory, {recursive:true});
  const captured = [];
  await sky.activate_window({window});
  for (const name of names) {
    // This predefined traversal is implemented by the desktop audit shortcut;
    // it does not reuse coordinate targets or accessibility indexes.
    await sky.press_key({window, key:'Control_L+Alt_L+Right'});
    // Give React, WebView2 and the compositor a frame budget before capture.
    await new Promise(resolve => setTimeout(resolve, 250));
    const state = await sky.get_window_state({window, include_screenshot:true, include_text:false});
    const frame = [...state.screenshots].sort((a,b)=>(b.width??0)*(b.height??0)-(a.width??0)*(a.height??0))[0];
    if (!frame?.url.startsWith('data:image/')) throw new Error(`No system capture for ${name}`);
    if ((frame.width??0) < 500 || (frame.height??0) < 300) throw new Error(`Only a transient surface was captured for ${name}`);
    const filename = path.join(directory,`${name}-${theme}.jpg`);
    await fs.writeFile(filename,Buffer.from(frame.url.split(',')[1],'base64'));
    const evidence = {control:name,theme,window:state.window,captureMethod:'Windows.Graphics.Capture',capturedAt:new Date().toISOString(),width:frame.width,height:frame.height,status:'requires-review',accessibility:state.accessibility};
    await fs.writeFile(filename.replace('.jpg','.json'),JSON.stringify(evidence,null,2)+'\n');
    captured.push(name);
  }
  return captured;
}

// Call only after observing the state and confirming the visible control/state.
// Preserve the whole system frame, including transient popup surfaces.
export async function saveObservedState(state, {control, theme, interaction, viewport, implementation}) {
  for (const value of [control, theme, interaction, viewport, implementation]) {
    if (!/^[\w-]+$/.test(value)) throw new Error('Evidence labels must be explicit safe identifiers');
  }
  const directory = path.resolve('visual-evidence/mica-states', implementation);
  await fs.mkdir(directory, {recursive:true});
  const stem = `${control}-${theme}-${interaction}-${viewport}`;
  const surfaces = [];
  for (const [index, frame] of state.screenshots.entries()) {
    if (!frame.url.startsWith('data:image/')) throw new Error('Missing system screenshot');
    const filename = `${stem}-surface-${index}.jpg`;
    await fs.writeFile(path.join(directory, filename), Buffer.from(frame.url.split(',')[1], 'base64'));
    surfaces.push({filename,width:frame.width,height:frame.height,originX:frame.originX,originY:frame.originY,zIndex:frame.zIndex});
  }
  if (!surfaces.length) throw new Error('No captured surfaces');
  await fs.writeFile(path.join(directory, `${stem}.json`), JSON.stringify({
    control,theme,interaction,viewport,implementation,window:state.window,
    captureMethod:'Windows.Graphics.Capture',recordedAt:new Date().toISOString(),
    surfaces,status:'requires-paired-reference-review',
  },null,2)+'\n');
}
