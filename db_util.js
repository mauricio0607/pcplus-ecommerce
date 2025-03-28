/**
 * Utilitário para verificar a conexão com o banco de dados PostgreSQL
 * e executar tarefas relacionadas ao banco de dados
 */

const { Pool } = require('pg');
const config = require('./config');

// Carrega as configurações do banco de dados
const dbConfig = config.database;

// Função para verificar a conexão com o banco de dados
async function checkDatabaseConnection() {
  const pool = new Pool({
    connectionString: dbConfig.url,
    ssl: dbConfig.ssl ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('Tentando conectar ao banco de dados...');
    
    const client = await pool.connect();
    try {
      console.log('Conexão estabelecida com sucesso!');
      
      // Verifica a versão do PostgreSQL
      const versionResult = await client.query('SELECT version()');
      console.log(`Versão do PostgreSQL: ${versionResult.rows[0].version}`);
      
      // Lista tabelas existentes
      const tablesQuery = `
        SELECT 
          table_name, 
          (SELECT count(*) FROM information_schema.columns WHERE table_name = t.table_name) AS column_count
        FROM 
          information_schema.tables t
        WHERE 
          table_schema = 'public'
        ORDER BY 
          table_name;
      `;
      
      const tablesResult = await client.query(tablesQuery);
      
      if (tablesResult.rows.length > 0) {
        console.log('\nTabelas encontradas:');
        console.log('--------------------------------------------------');
        console.log('Nome da Tabela                 | Número de Colunas');
        console.log('--------------------------------------------------');
        
        tablesResult.rows.forEach(row => {
          const paddedName = row.table_name.padEnd(30);
          console.log(`${paddedName} | ${row.column_count}`);
        });
        
        console.log('--------------------------------------------------');
        console.log(`Total de tabelas: ${tablesResult.rows.length}`);
      } else {
        console.log('\nNenhuma tabela encontrada no banco de dados.');
      }
      
      // Verifica estatísticas básicas das tabelas principais
      if (tablesResult.rows.some(row => row.table_name === 'users')) {
        const stats = await getTableStats(client);
        
        console.log('\nEstatísticas do Banco de Dados:');
        console.log('--------------------------------------------------');
        Object.entries(stats).forEach(([table, count]) => {
          console.log(`${table.padEnd(20)} | ${count} registros`);
        });
        console.log('--------------------------------------------------');
      }
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error.message);
    if (error.message.includes('does not exist')) {
      console.log('\nDica: O banco de dados pode precisar ser criado primeiro.');
      console.log('Execute: CREATE DATABASE pcplus; no terminal do PostgreSQL.');
    } else if (error.message.includes('password authentication failed')) {
      console.log('\nDica: Verifique se as credenciais do banco de dados estão corretas.');
      console.log('Verifique as variáveis DATABASE_URL, PGUSER e PGPASSWORD no arquivo .env.');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('\nDica: O servidor PostgreSQL parece não estar rodando ou não está acessível.');
      console.log('Verifique se o PostgreSQL está instalado e em execução.');
    }
  } finally {
    await pool.end();
  }
}

// Função para obter estatísticas das tabelas principais
async function getTableStats(client) {
  const mainTables = ['users', 'products', 'categories', 'orders', 'reviews'];
  const stats = {};
  
  for (const table of mainTables) {
    try {
      const result = await client.query(`SELECT COUNT(*) FROM ${table}`);
      stats[table] = parseInt(result.rows[0].count, 10);
    } catch (error) {
      stats[table] = 'N/A';
    }
  }
  
  return stats;
}

// Executa a verificação se for chamado diretamente
if (require.main === module) {
  checkDatabaseConnection().catch(console.error);
}

module.exports = {
  checkDatabaseConnection
};