// Script para executar o db_util.js
const { execSync } = require('child_process');

try {
  // Executar o script
  execSync('node --experimental-json-modules db_util.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Erro ao executar o script:', error);
}