/**
 * Script para criar um usuário administrador
 * Este script pode ser usado para criar um administrador no primeiro setup
 * ou para recuperar acesso administrativo
 */

const { Pool } = require('pg');
const readline = require('readline');
const crypto = require('crypto');
const config = require('./config');

// Função para hash de senha usando SHA-256 (para compatibilidade com o sistema existente)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Função para criar um usuário administrador
async function createAdminUser(name, email, password) {
  const pool = new Pool({
    connectionString: config.database.url,
    ssl: config.database.ssl ? { rejectUnauthorized: false } : false
  });

  try {
    const client = await pool.connect();
    try {
      // Verificar se o usuário já existe
      const checkQuery = 'SELECT * FROM users WHERE email = $1';
      const checkResult = await client.query(checkQuery, [email]);
      
      if (checkResult.rows.length > 0) {
        const userId = checkResult.rows[0].id;
        
        // Atualizar usuário existente para administrador
        const updateQuery = 'UPDATE users SET role = $1, name = $2, password = $3 WHERE id = $4 RETURNING *';
        const hashedPassword = hashPassword(password);
        const result = await client.query(updateQuery, ['admin', name, hashedPassword, userId]);
        
        console.log(`\nUsuário existente atualizado como administrador:`);
        console.log(`- ID: ${result.rows[0].id}`);
        console.log(`- Nome: ${result.rows[0].name}`);
        console.log(`- Email: ${result.rows[0].email}`);
        console.log(`- Função: ${result.rows[0].role}`);
      } else {
        // Criar novo usuário administrador
        const insertQuery = 'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *';
        const hashedPassword = hashPassword(password);
        const result = await client.query(insertQuery, [name, email, hashedPassword, 'admin']);
        
        console.log(`\nNovo usuário administrador criado com sucesso:`);
        console.log(`- ID: ${result.rows[0].id}`);
        console.log(`- Nome: ${result.rows[0].name}`);
        console.log(`- Email: ${result.rows[0].email}`);
        console.log(`- Função: ${result.rows[0].role}`);
      }
      
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Erro ao criar usuário administrador:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

// Função para listar usuários existentes
async function listUsers() {
  const pool = new Pool({
    connectionString: config.database.url,
    ssl: config.database.ssl ? { rejectUnauthorized: false } : false
  });

  try {
    const client = await pool.connect();
    try {
      const query = 'SELECT id, name, email, role, created_at FROM users ORDER BY id';
      const result = await client.query(query);
      
      if (result.rows.length === 0) {
        console.log('\nNenhum usuário encontrado no banco de dados.');
        return;
      }
      
      console.log('\nUsuários existentes:');
      console.log('----------------------------------------------------------------------');
      console.log('ID  | Nome                 | Email                    | Função       ');
      console.log('----------------------------------------------------------------------');
      
      result.rows.forEach(user => {
        const id = String(user.id).padEnd(3);
        const name = (user.name || '').padEnd(20);
        const email = (user.email || '').padEnd(24);
        const role = (user.role || '').padEnd(12);
        
        console.log(`${id} | ${name} | ${email} | ${role}`);
      });
      
      console.log('----------------------------------------------------------------------');
      console.log(`Total: ${result.rows.length} usuários`);
      
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Erro ao listar usuários:', error.message);
  } finally {
    await pool.end();
  }
}

// Configuração de entrada interativa
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Função principal
async function main() {
  console.log('# PC+ E-commerce - Criação de Usuário Administrador');
  console.log('==================================================');
  console.log('Este script permite criar ou atualizar um usuário com privilégios de administrador.');
  
  try {
    // Listar usuários existentes
    await listUsers();
    
    // Solicitar informações do administrador
    const name = await new Promise(resolve => {
      rl.question('\nNome do administrador: ', answer => resolve(answer));
    });
    
    const email = await new Promise(resolve => {
      rl.question('Email do administrador: ', answer => resolve(answer));
    });
    
    const password = await new Promise(resolve => {
      rl.question('Senha do administrador: ', answer => resolve(answer));
    });
    
    // Confirmar operação
    const confirm = await new Promise(resolve => {
      rl.question('\nCriar/atualizar este usuário como administrador? (s/N): ', answer => resolve(answer.toLowerCase()));
    });
    
    if (confirm === 's' || confirm === 'sim') {
      await createAdminUser(name, email, password);
      console.log('\nOperação concluída com sucesso!');
    } else {
      console.log('\nOperação cancelada pelo usuário.');
    }
  } catch (error) {
    console.error('\nErro durante a execução:', error.message);
  } finally {
    rl.close();
  }
}

// Executar programa principal
main().catch(console.error);