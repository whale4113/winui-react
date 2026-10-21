import fs from 'node:fs';
import { catalog } from '../src/fluent/catalog.ts';
const references = JSON.parse(fs.readFileSync('src/fluent/gallery-reference.json','utf8'));
const rows = catalog.map(entry => {
  const reference = references[entry.name];
  const evidence = ['light','dark'].map(theme => {
    const native = `visual-evidence/native/${entry.name}-${theme}.jpg`;
    const tauri = `visual-evidence/tauri/${entry.name}-${theme}.jpg`;
    const comparison = `visual-evidence/comparison/${entry.name}-${theme}/metrics.json`;
    return {theme,native:fs.existsSync(native)?native:null,tauri:fs.existsSync(tauri)?tauri:null,browser:fs.existsSync(`test-results/catalog/${theme}/${entry.name}.png`),comparison:fs.existsSync(comparison)?comparison:null,status:fs.existsSync(comparison)?'requires-review':'pending-system-comparison'};
  });
  return {name:entry.name,reference:reference?.source??null,upstreamExamples:reference?.examples.length??0,evidence};
});
const unmatched = Object.entries(references).filter(([name])=>!catalog.some(entry=>entry.name===name)).map(([name,entry])=>({name,title:entry.title,category:entry.category}));
fs.mkdirSync('visual-evidence',{recursive:true});
fs.writeFileSync('visual-evidence/inventory.json',JSON.stringify({catalog:rows,upstreamPagesWithoutExactCatalogMatch:unmatched},null,2)+'\n');
fs.writeFileSync('visual-evidence/STATUS.md',`# Gallery 视觉验证清单\n\n${rows.length} 个现有 React 示例；${Object.keys(references).length} 个上游 Gallery 页面。名称未直接匹配的页面 ${unmatched.length} 个（含设计、基础知识和多个控件的组合页，详见 inventory.json）。\n\n系统截图来自 Windows.Graphics.Capture；浏览器渲染检查不算原生视觉通过。所有差分结果均需人工复核，不自动宣布像素等效。\n\n| 控件 | 上游示例数 | 浅色系统参考/宿主 | 深色系统参考/宿主 | 浏览器浅/深 |\n|---|---:|---|---|---|\n${rows.map(row=>`| ${row.name} | ${row.upstreamExamples} | ${row.evidence[0].native?'有':'缺'}/${row.evidence[0].tauri?'有':'缺'} | ${row.evidence[1].native?'有':'缺'}/${row.evidence[1].tauri?'有':'缺'} | ${row.evidence[0].browser?'有':'缺'}/${row.evidence[1].browser?'有':'缺'} |`).join('\n')}\n`);
console.log(`${rows.length} controls; ${rows.filter(row=>row.evidence.some(e=>e.native)).length} native references; ${rows.filter(row=>row.evidence.some(e=>e.tauri)).length} Tauri captures.`);
