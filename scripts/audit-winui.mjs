import {catalog,resources} from '../src/fluent/catalog.ts'
import fs from 'node:fs'
const supporting=new Set(['Common','CornerRadius','Deprecated','TextControlsCommon','TabularSurfaces'])
const sourceNames=[...new Set(resources.resources.map(r=>r.name))]
const missing=sourceNames.filter(n=>!supporting.has(n)&&!catalog.some(c=>c.name===n||c.source.includes('/'+n+'_themeresources')))
const rows=catalog.map(c=>`| ${c.name} | ${c.category} | ${c.source.replace('microsoft-ui-xaml/','')} |`)
const text=`# WinUI 源码覆盖清单\n\n参考提交：${resources.referenceRevision}\n\n${catalog.length} 个 Web 控件/组合/布局/材质示例；${resources.resources.length} 份 standard + perf2026 资源字典。基础颜色从 Common_themeresources_any.xaml 原值转换 ARGB → CSS RGBA。控件以 standard 模板为基线，perf2026 字典用于对照查询，未声称两套模板均独立实现。\n\n未匹配的独立主题控件：${missing.length?missing.join(', '):'无'}。Common、CornerRadius、Deprecated、TextControlsCommon、TabularSurfaces 为共享/兼容资源字典，不计为交互控件。\n\n这里的覆盖表示存在可运行示例与源码对应关系，不表示全部原生 API 或像素级一致性。每个控件页面的“实现范围”列出剩余差异。\n\n| Control | Category | Local source |\n| --- | --- | --- |\n${rows.join('\n')}\n\n## 依赖原生宿主的范围\n\nWebView2、MapControl、SystemBackdropElement、系统窗口拖动/非客户区、Windows Ink 服务、IAnimatedVisualSource、原生媒体服务不由本 Web 工程提供。CSS Mica/Acrylic/Reveal、Canvas Ink 和 HTML video 只实现 Web 可表达的外观与交互。\n\n## 验证边界\n\n自动化验证颜色值和关键尺寸、两种主题下的全部示例渲染与若干键盘/交互流程。已安装原生 WinUI Gallery 3.0.4。系统截图、逐控件采集状态和剩余对照项见 visual-evidence/STATUS.md；截图采集不代表视觉通过。\n`
fs.writeFileSync('COVERAGE.md',text)
console.log(`${catalog.length} examples; unmatched themed controls: ${missing.join(', ')||'none'}`)
