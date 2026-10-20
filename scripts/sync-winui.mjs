import fs from 'node:fs'
import path from 'node:path'
import {execFileSync} from 'node:child_process'
import {createHash} from 'node:crypto'
const root='microsoft-ui-xaml/controls/dev'
const source=root+'/CommonStyles/Common_themeresources_any.xaml'
const xml=fs.readFileSync(source,'utf8'), themes={}
const cssColor=value=>value.length===9?'#'+value.slice(3)+value.slice(1,3):value
for(const theme of ['Light','Default']){
 const block=xml.match(new RegExp(`<ResourceDictionary x:Key="${theme}">([\\s\\S]*?)</ResourceDictionary>`))[1]
 themes[theme]=Object.fromEntries([...block.matchAll(/<Color x:Key="([^"]+)">(#[\da-fA-F]+)<\/Color>/g)].map(m=>[m[1],cssColor(m[2])]))
}
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)])}
const resources=walk(root).filter(file=>/_themeresources(?:_any|_perf2026)?\.xaml$/.test(file)&&!file.includes('TestUI')).map(file=>{
 const text=fs.readFileSync(file,'utf8')
 return {file:file.replaceAll('\\','/'),name:path.basename(file).replace(/_themeresources(?:_any|_perf2026)?\.xaml$/,''),variant:file.includes('_perf2026')?'perf2026':'standard',styles:[...text.matchAll(/<Style[^>]*TargetType="([^"]+)"/g)].map(m=>m[1]),metrics:Object.fromEntries([...text.matchAll(/<(?:x:Double|Thickness|CornerRadius) x:Key="([^"]+)">([^<]+)<\//g)].map(m=>[m[1],m[2]]))}
})
const referenceRevision=execFileSync('git',['-C','microsoft-ui-xaml','rev-parse','HEAD'],{encoding:'utf8'}).trim()
const colorsHash=createHash('sha256').update(xml).digest('hex')
const css='/* Generated from '+source+'. Microsoft MIT licensed resources. Do not edit; npm run sync:winui. */\n'+Object.entries(themes).map(([theme,colors])=>(theme==='Light'?':root':'.dark')+' {\n'+Object.entries(colors).map(([key,value])=>`  --${key}: ${value};`).join('\n')+'\n}').join('\n')+'\n'
const metadata=JSON.stringify({source,referenceRevision,colorsHash,themes,resources},null,2)+'\n'
if(process.argv.includes('--check')){
 for(const [file,value] of [['src/fluent/tokens.css',css],['src/fluent/source-resources.json',metadata]]){
  if(fs.readFileSync(file,'utf8').replaceAll('\r\n','\n')!==value)throw new Error(file+' differs from local XAML; run npm run sync:winui')
 }
 console.log('Generated themes match the pinned local XAML source.')
}else{
 fs.writeFileSync('src/fluent/tokens.css',css);fs.writeFileSync('src/fluent/source-resources.json',metadata)
 console.log(`Extracted ${Object.keys(themes.Light).length} colors per theme; ${resources.length} dictionaries (standard + perf2026). Reference ${referenceRevision.slice(0,9)}.`)
}
