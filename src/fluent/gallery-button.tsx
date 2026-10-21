import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { galleryReference } from './gallery-reference';

export function GalleryButton() {
  const [disabled, setDisabled] = useState(false);
  const [output, setOutput] = useState(['', '']);
  const reference = galleryReference('Button');
  return <div className="native-button-examples">
    {reference?.examples.slice(0, 4).map((sample, index) => <section className="sample-section" key={sample.source}>
      <h2>{sample.content?.match(/--- header\s+([^\r\n]+)/)?.[1]}</h2>
      <div className="sample-frame">
        <div className="native-example-row">
          <div className="sample-stage">
            {index === 0 ? <Button disabled={disabled} onClick={() => setOutput(old => ['You clicked: Button1', old[1]])}>Standard XAML button</Button> :
              index === 1 ? <Button className="image-button" aria-label="Pie" onClick={() => setOutput(old => [old[0], 'You clicked: Button2'])}><img src="/gallery-slices.png" alt="Slice" /></Button> :
              index === 2 ? <div className="demo-row"><Button className="accent">Accent style button</Button><Button variant="ghost">Subtle style button</Button></div> :
              <div className="demo-column wrapping-buttons"><p>The following buttons' content may get clipped if we don't pay careful attention to their layout containers.</p><p>One option to mitigate clipped content is to place Buttons underneath each other, allowing for more space to grow horizontally:</p><Button>This is some text that is too long and will get cut off</Button><Button>This is another text that would result in being cut off</Button><p>Another option is to explicitly wrap the Button's content</p><div className="demo-row"><Button>This is some text that is too long and will get cut off without wrapping</Button><Button>This is another text that would result in being cut off without wrapping</Button></div></div>}
            {index < 2 && <div className="native-example-output">Output: <span aria-live="polite">{output[index]}</span></div>}
          </div>
          {index === 0 && <div className="native-example-options"><label className="control-label"><Checkbox checked={disabled} onCheckedChange={v => setDisabled(Boolean(v))} />Disable button</label></div>}
        </div>
        <details className="native-source"><summary>Source code</summary><pre>{sample.content?.replace(/^--- header\s+[^\r\n]+\s*/, '')}</pre></details>
      </div>
    </section>)}
  </div>;
}
