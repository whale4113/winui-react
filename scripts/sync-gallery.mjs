import fs from 'node:fs';
import path from 'node:path';

const root = 'WinUI-Gallery/WinUIGallery';
const data = JSON.parse(fs.readFileSync(`${root}/SampleSupport/Data/ControlInfoData.json`, 'utf8'));
const entries = Object.fromEntries(data.Groups.flatMap(group => group.Items.map(item => {
  const folder = `${root}/Samples/${item.UniqueId}`;
  const page = `${folder}/${item.UniqueId}Page.xaml`;
  const xaml = fs.existsSync(page) ? fs.readFileSync(page, 'utf8') : '';
  return [item.UniqueId, {
    title: item.Title, category: group.Title, description: item.Description || item.Subtitle || '',
    image: item.ImagePath?.replace('ms-appx:///Assets/', '/gallery-assets/'),
    source: fs.existsSync(page) ? page : null,
    examples: [...xaml.matchAll(/<controls:ControlExample\b[^>]*SampleDefinition="([^"]+)"/g)].map(m => {
      const sample = `${root}/Samples/${m[1].replaceAll('\\', '/')}`;
      return { source: sample, content: fs.existsSync(sample) ? fs.readFileSync(sample, 'utf8') : null };
    }),
  }];
})));
fs.writeFileSync('src/fluent/gallery-reference.json', JSON.stringify(entries, null, 2) + '\n');
for (const folder of ['ControlImages', 'HomeHeaderTiles']) {
  fs.cpSync(path.join(root, 'Assets', folder), path.join('public/gallery-assets', folder), { recursive: true });
}
console.log(`Indexed ${Object.keys(entries).length} upstream Gallery pages.`);
