const fs = require('fs');
const path = require('path');

// Criar SVGs de placeholder para produtos
const createPlaceholderSVG = (width, height, text, color = '#27b99a') => {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${color}"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" dy=".3em">${text}</text>
  </svg>`;
};

const placeholders = [
  { name: 'produto-1.svg', text: 'Produto 1', color: '#27b99a' },
  { name: 'produto-2.svg', text: 'Produto 2', color: '#ff0080' },
  { name: 'produto-3.svg', text: 'Produto 3', color: '#27b99a' },
  { name: 'produto-4.svg', text: 'Produto 4', color: '#ff0080' },
  { name: 'produto-5.svg', text: 'Produto 5', color: '#27b99a' },
  { name: 'produto-6.svg', text: 'Produto 6', color: '#ff0080' },
  { name: 'produto-7.svg', text: 'Produto 7', color: '#27b99a' },
  { name: 'produto-8.svg', text: 'Produto 8', color: '#ff0080' },
];

const outputDir = path.join(__dirname, '..', 'public', 'images', 'produtos');

// Criar diretório se não existir
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Gerar placeholders
placeholders.forEach(({ name, text, color }) => {
  const svg = createPlaceholderSVG(400, 400, text, color);
  const filePath = path.join(outputDir, name);
  fs.writeFileSync(filePath, svg);
  console.log(`Criado: ${name}`);
});

console.log('Placeholders criados com sucesso!');
