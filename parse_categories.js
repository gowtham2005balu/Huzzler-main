const fs = require('fs');

const lines = fs.readFileSync('raw_categories.txt', 'utf8').split('\n').map(l => l.trim()).filter(l => l);

const data = [];
let currentMainCategory = null;
let currentSection = null;

for (let line of lines) {
  // Main category matches something like "🎨 1. Graphics & Design" or "💻 2. Programming & Tech"
  if (line.match(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]\s*\d+\.\s/u)) {
    // Or sometimes there's an emoji then "1. "
    const titleMatch = line.match(/^([\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}])?\s*\d+\.\s+(.*)$/u);
    if (titleMatch) {
      currentMainCategory = {
        icon: titleMatch[1] || '',
        title: titleMatch[2].trim(),
        sections: []
      };
      data.push(currentMainCategory);
      currentSection = null;
    }
  } 
  // Section matches something like "🖌️ 1.1 Logo Design"
  else if (line.match(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]\s*\d+\.\d+\s/u)) {
    const sectionMatch = line.match(/^([\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}])?\s*\d+\.\d+\s+(.*)$/u);
    if (sectionMatch && currentMainCategory) {
      currentSection = {
        icon: sectionMatch[1] || '',
        title: sectionMatch[2].trim(),
        items: []
      };
      currentMainCategory.sections.push(currentSection);
    }
  } else {
    // It's an item under the current section
    if (currentSection) {
      currentSection.items.push(line);
    }
  }
}

fs.writeFileSync('src/data/categoriesData.json', JSON.stringify(data, null, 2));
console.log('Done mapping', data.length, 'categories');
