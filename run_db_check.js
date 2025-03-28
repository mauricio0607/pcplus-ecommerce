/**
 * Script para verificar a conexão com o banco de dados
 * Executa a verificação e exibe uma mensagem informativa
 */

const { checkDatabaseConnection } = require('./db_util');

console.log('# PC+ E-commerce - Verificação de Banco de Dados');
console.log('================================================');
console.log('Este script verifica se o banco de dados PostgreSQL está configurado corretamente');
console.log('e se a aplicação consegue conectar com o mesmo.\n');

checkDatabaseConnection()
  .then(() => {
    console.log('\nVerificação de banco de dados concluída!');
  })
  .catch(err => {
    console.error('\nOcorreu um erro durante a verificação:', err.message);
    process.exit(1);
  });