import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const source = new URL('../public/icon-json-data/', import.meta.url);
const output = new URL('../public/category-index.json', import.meta.url);
const files = (await readdir(source)).filter((name) => name.endsWith('.json')).sort();
const categories = {};

const categoryRules = [
  [/accessib|visibaly|visibility/, 'Accessibility'],
  [/artificial intelligence|\bai\b/, 'Artificial Intelligence'],
  [/alert|warning|notice|status|indication|indicator|prohibition/, 'Alerts & Status'],
  [/arrow|directional|chevron/, 'Arrows & Direction'],
  [/animal|pet|zoo|nature|ecology|environment|plant|flower|agriculture/, 'Animals & Nature'],
  [/audio|music|instrument|sound/, 'Audio & Music'],
  [/automotive|vehicle|transport|transit|maritime|car\b/, 'Transport & Vehicles'],
  [/brand|logo|professional networks|developer communities|social media|social network|social bookmark|social reward|^social$/, 'Brands & Social'],
  [/building|construction|real estate|home|household|furniture|door|elevator|escalator|stairs/, 'Buildings & Home'],
  [/business|finance|money|banking|currency|payment|enterprise|marketing|statistics/, 'Business & Finance'],
  [/calendar|date|time|alarm|clock/, 'Calendar & Time'],
  [/chart|graph|data|database/, 'Charts & Data'],
  [/chat|message|communication|communicate|call|phone|contact|connect$/, 'Communication'],
  [/cloth|makeup|personal hygiene/, 'Clothing & Personal Care'],
  [/cloud|network|internet|connectivity|transmission|server|browser/, 'Cloud & Network'],
  [/code|coding|programming|programing|developer|development|git|software/, 'Code & Development'],
  [/commerce|shopping|shop|retail|ecommerce|e-commerce/, 'Commerce & Shopping'],
  [/crypto|web3/, 'Crypto & Web3'],
  [/design|edit|drawing|art\b|graphics|vector|color|arrange|resize/, 'Design & Editing'],
  [/device|hardware|computer|electronic|technology|printer|battery/, 'Devices & Hardware'],
  [/education|school|study|science|math|astronomy|constellation|zodiac/, 'Education & Science'],
  [/email|mail|inbox/, 'Email & Mail'],
  [/emoji|emot|smile|face|hand sign|gesture|character|^hands?$/, 'Emoji & Emotions'],
  [/energy|recycling/, 'Energy & Environment'],
  [/family|people|person|user|account|gender|body|identity|child|baby|romance/, 'People & Family'],
  [/file|folder|archive|arhive|document|docs|content|blog|bookmark|notes|page/, 'Files & Folders'],
  [/flag|political/, 'Flags'],
  [/food|drink|beverage|fruit|nutrition/, 'Food & Drink'],
  [/game|gaming|chess/, 'Games'],
  [/health|medical|medicine|medication|pharmacy|diagnostic|symptom|vaccine|virus|covid|blood|contraceptive|wellness|ppe|quarantine|mutation|cross/, 'Health & Medical'],
  [/holiday|halloween|spring|summer|autumn|winter|snowflake/, 'Holidays & Seasons'],
  [/image|photo|camera/, 'Images & Photography'],
  [/interface|layout|component|form|toggle|menu|tooltip|view|ui\b|essential|core|base|settings|system|list|like|login/, 'Interface & Layout'],
  [/location|map|geographic|wayfinding|navigation|navigator/, 'Maps & Location'],
  [/logistic|delivery|shipping/, 'Logistics & Delivery'],
  [/media|video|movie|entertainment|player|av\b/, 'Media & Entertainment'],
  [/notification/, 'Notifications'],
  [/security|secure|privacy|lock|safe/, 'Security & Privacy'],
  [/shape|symbol|abstract|material|thematic/, 'Shapes & Symbols'],
  [/sport|fitness|exercise|leisure|camping/, 'Sports & Fitness'],
  [/text|typography|font|writing/, 'Text & Typography'],
  [/tool|build|operate|operation|industry/, 'Tools & Industry'],
  [/travel|place|hotel|traveling/, 'Travel & Places'],
  [/weather|condition/, 'Weather'],
  [/work|office|organization|planning|professional/, 'Work & Office'],
  [/action|activity|activities|add|remove|cancel|check|download|load|search|sort|control|modifier|moving/, 'Actions'],
  [/spinner|animation/, 'Animation & Spinners'],
];

function readableCategory(value) {
  const spaced = value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Za-z])(\d)/g, '$1 $2')
    .replace(/[_/,+]+/g, ' & ')
    .replace(/\s*&\s*&\s*/g, ' & ')
    .replace(/\s+/g, ' ')
    .trim();
  const lower = spaced.toLowerCase();
  const match = categoryRules.find(([pattern]) => pattern.test(lower));
  if (match) return match[1];
  if (/general|common|other|misc|extra|part|regular|single|charity|culture|life|religion|restroom|service|specialt|object|social distancing/.test(lower)) return 'General';
  return spaced.replace(/\b\w/g, (letter) => letter.toUpperCase()).replace(/\bUi\b/g, 'UI');
}

for (const file of files) {
  const data = JSON.parse(await readFile(join(source.pathname, file), 'utf8'));
  const prefix = data.prefix || file.replace(/\.json$/, '');
  if (data.info?.category) {
    const category = readableCategory(data.info.category);
    const list = categories[category] || (categories[category] = []);
    for (const name of Object.keys(data.icons || {})) list.push(`${prefix}:${name}`);
  }
  for (const [rawCategory, names] of Object.entries(data.categories || {})) {
    const category = readableCategory(rawCategory || data.info?.category || 'General');
    const list = categories[category] || (categories[category] = []);
    for (const name of names) list.push(`${prefix}:${name}`);
  }
}

const sorted = Object.fromEntries(
  Object.entries(categories)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, icons]) => [name, [...new Set(icons)].sort()]),
);

await writeFile(output, JSON.stringify(sorted));
console.log(`Indexed ${Object.keys(sorted).length} categories across ${files.length} icon sets.`);
