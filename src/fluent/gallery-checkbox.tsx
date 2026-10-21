import { useState } from 'react';
import { Checkbox } from '../components/ui/checkbox';
import { galleryReference } from './gallery-reference';

export function GalleryCheckBox() {
  const [two, setTwo] = useState(false);
  const [three, setThree] = useState(0);
  const [output, setOutput] = useState(['', '']);
  const [options, setOptions] = useState([false, true, false]);
  const count = options.filter(Boolean).length;
  return <div className="native-button-examples">
    {galleryReference('CheckBox')?.examples.map((sample, index) => <section className="sample-section" key={sample.source}>
      <h2>{sample.content?.match(/--- header\s+([^\r\n]+)/)?.[1]}</h2>
      <div className="sample-frame">
        <div className="native-example-row"><div className="sample-stage">
          {index === 0 ? <label className="control-label"><Checkbox checked={two} onCheckedChange={value => {setTwo(value);setOutput(old => [value ? 'You checked the box.' : 'You unchecked the box.', old[1]]);}} />Two-state CheckBox</label> :
            index === 1 ? <label className="control-label"><Checkbox checked={three === 1} indeterminate={three === 2} onCheckedChange={() => {const next=(three+1)%3;setThree(next);setOutput(old=>[old[0], ['CheckBox is unchecked.','CheckBox is checked.','CheckBox state is indeterminate.'][next]]);}} />Three-state CheckBox</label> :
            <div className="demo-column"><label className="control-label"><Checkbox checked={count===3} indeterminate={count>0 && count<3} onCheckedChange={()=>setOptions([count===0,count===0,count===0])} />Select all</label>{options.map((checked, i) => <label key={i} className="control-label" style={{marginLeft:24}}><Checkbox checked={checked} onCheckedChange={value=>setOptions(old=>old.map((v,j)=>j===i?value:v))} />Option {i+1}</label>)}</div>}
          {index < 2 && <div className="native-example-output">Output: <span aria-live="polite">{output[index]}</span></div>}
        </div></div>
        <details className="native-source"><summary>Source code</summary><pre>{sample.content?.replace(/^--- header\s+[^\r\n]+\s*/, '')}</pre></details>
      </div>
    </section>)}
  </div>;
}
