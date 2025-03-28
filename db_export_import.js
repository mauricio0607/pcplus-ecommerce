/**
 * Utilitário para exportar e importar dados do banco de dados PostgreSQL
 * Pode ser usado para transferir dados entre diferentes ambientes
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const config = require('./config');

// Carrega as configurações do banco de dados
const dbConfig = config.database;

// Cria uma pool de conexões com o banco de dados
const pool = new Pool({
  connectionString: dbConfig.url,
  ssl: dbConfig.ssl ? { rejectUnauthorized: false } : false
});

// Lista de tabelas que serão exportadas/importadas
const TABLES = [
  'users',
  'categories',
  'products',
  'product_images',
  'orders',
  'order_items',
  'addresses',
  'wishlist_items',
  'reviews',
  'notifications',
  'sessions',
  'site_settings',
  'menu_items'
];

// Função para exportar dados
async function exportData(outputDir = './backup') {
  try {
    console.log('Iniciando exportação de dados...');
    
    // Cria o diretório de saída se não existir
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Exporta cada tabela para um arquivo JSON
    for (const table of TABLES) {
      const client = await pool.connect();
      try {
        console.log(`Exportando tabela: ${table}`);
        const result = await client.query(`SELECT * FROM ${table}`);
        
        // Escreve os dados para um arquivo JSON
        const outputFile = path.join(outputDir, `${table}.json`);
        fs.writeFileSync(outputFile, JSON.stringify(result.rows, null, 2));
        
        console.log(`✓ Tabela ${table} exportada com sucesso: ${result.rowCount} registros`);
      } finally {
        client.release();
      }
    }
    
    console.log(`\nExportação concluída! Os dados foram salvos em: ${outputDir}`);
  } catch (error) {
    console.error('Erro durante a exportação:', error);
  } finally {
    await pool.end();
  }
}

// Função para importar dados
async function importData(inputDir = './backup') {
  try {
    console.log('Iniciando importação de dados...');
    
    // Verifica se o diretório de entrada existe
    if (!fs.existsSync(inputDir)) {
      console.error(`Diretório não encontrado: ${inputDir}`);
      return;
    }
    
    // Pergunta ao usuário se deseja limpar as tabelas antes da importação
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise(resolve => {
      rl.question('Deseja limpar as tabelas antes de importar? (s/N): ', resolve);
    });
    
    const clearTables = answer.toLowerCase() === 's';
    rl.close();
    
    // Importa dados de cada arquivo JSON para a tabela correspondente
    for (const table of TABLES) {
      const inputFile = path.join(inputDir, `${table}.json`);
      
      // Verifica se o arquivo existe
      if (!fs.existsSync(inputFile)) {
        console.log(`Arquivo não encontrado, pulando: ${inputFile}`);
        continue;
      }
      
      // Lê os dados do arquivo
      const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
      
      if (data.length === 0) {
        console.log(`Nenhum dado encontrado para a tabela ${table}, pulando.`);
        continue;
      }
      
      const client = await pool.connect();
      try {
        // Inicia uma transação
        await client.query('BEGIN');
        
        // Limpa a tabela se solicitado
        if (clearTables) {
          console.log(`Limpando tabela: ${table}`);
          await client.query(`DELETE FROM ${table}`);
          
          // Reinicia a sequência de ID se for uma tabela com chave primária serial
          await client.query(`
            DO $$
            BEGIN
              IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '${table}' AND column_name = 'id' 
                AND column_default LIKE 'nextval%'
              ) THEN
                EXECUTE 'ALTER SEQUENCE ${table}_id_seq RESTART WITH 1';
              END IF;
            END $$;
          `);
        }
        
        console.log(`Importando dados para tabela: ${table} (${data.length} registros)`);
        
        // Para cada registro, construir e executar uma instrução INSERT
        for (const record of data) {
          const columns = Object.keys(record);
          const values = Object.values(record);
          
          // Constrói uma consulta parametrizada
          const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
          const query = `
            INSERT INTO ${table} (${columns.join(', ')})
            VALUES (${placeholders})
            ON CONFLICT DO NOTHING
          `;
          
          await client.query(query, values);
        }
        
        // Commit da transação
        await client.query('COMMIT');
        console.log(`✓ Tabela ${table} importada com sucesso`);
      } catch (error) {
        // Rollback em caso de erro
        await client.query('ROLLBACK');
        console.error(`Erro ao importar tabela ${table}:`, error);
      } finally {
        client.release();
      }
    }
    
    console.log('\nImportação concluída!');
  } catch (error) {
    console.error('Erro durante a importação:', error);
  } finally {
    await pool.end();
  }
}

// Processa argumentos da linha de comando
const args = process.argv.slice(2);
const command = args[0];
const directory = args[1] || './backup';

if (command === 'export') {
  exportData(directory);
} else if (command === 'import') {
  importData(directory);
} else {
  console.log(`
Uso: node db_export_import.js [comando] [diretório]

Comandos:
  export  - Exporta todos os dados para arquivos JSON
  import  - Importa dados de arquivos JSON para o banco de dados

Exemplos:
  node db_export_import.js export ./backup
  node db_export_import.js import ./backup
  `);
}