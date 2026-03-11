const fs = require('fs');
const file = 'c:\\Users\\chauh\\Downloads\\lexindia\\lib\\translations.ts';
let content = fs.readFileSync(file, 'utf8');

// Update the type definition
content = content.replace(
  /hero: \{ title: string; subtitle: string;/g,
  "hero: { title: string; subtitle: string; titleB: string; subtitleB: string;"
);

// Update all translation instances
content = content.replace(
  /hero: \{\s*title: '(.*?)',\s*subtitle: '(.*?)', /g,
  "hero: { title: '$1', subtitle: '$2', titleB: 'Talk to India\\'s Top Lawyers Now', subtitleB: 'Expert legal advice at your fingertips', "
);
content = content.replace(
  /hero: \{\s*title: "(.*?)",\s*subtitle: "(.*?)", /g,
  "hero: { title: \"$1\", subtitle: \"$2\", titleB: 'Talk to India\\'s Top Lawyers Now', subtitleB: 'Expert legal advice at your fingertips', "
);

fs.writeFileSync(file, content);
console.log('Translations updated successfully');
