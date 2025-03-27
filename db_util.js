// Script utilitário para verificar a conexão com o banco de dados
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { yellow, green, red, blue } from 'colorette';

async function checkDatabaseConnection() {
  console.log(blue('🔍 Verificando conexão com o banco de dados...'));
  
  try {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      console.error(red('❌ Variável DATABASE_URL não encontrada'));
      console.log(yellow('⚠️ Certifique-se de adicionar sua string de conexão como um segredo no Replit'));
      return;
    }
    
    console.log(yellow('🔌 Tentando conexão com: ') + connectionString.replace(/\/\/([^:]+):[^@]+@/, '//***:***@'));
    
    const client = postgres(connectionString);
    const db = drizzle(client);
    
    // Tenta executar uma consulta simples
    const result = await client`SELECT NOW() as time`;
    
    console.log(green('✅ Conexão bem-sucedida!'));
    console.log(blue('⏱️ Tempo do servidor: ') + result[0].time);
    
    // Verifica se as tabelas estão criadas
    try {
      const tablesResult = await client`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
      
      console.log(green(`📋 ${tablesResult.length} tabelas encontradas:`));
      tablesResult.forEach(table => {
        console.log(blue(`   - ${table.table_name}`));
      });
      
      // Verifica se há produtos no banco
      try {
        const productsCount = await client`SELECT COUNT(*) as count FROM products`;
        console.log(green(`📦 ${productsCount[0].count} produtos cadastrados`));
      } catch (err) {
        console.log(yellow('⚠️ Não foi possível contar produtos. A tabela existe mas pode estar vazia.'));
      }
      
      // Verifica se há usuários no banco
      try {
        const usersCount = await client`SELECT COUNT(*) as count FROM users`;
        console.log(green(`👤 ${usersCount[0].count} usuários cadastrados`));
      } catch (err) {
        console.log(yellow('⚠️ Não foi possível contar usuários. A tabela existe mas pode estar vazia.'));
      }
      
    } catch (err) {
      console.log(yellow('⚠️ Conexão bem-sucedida, mas não encontramos tabelas. Execute o script SQL para criar o esquema.'));
    }
    
    await client.end();
    
  } catch (error) {
    console.error(red('❌ Erro de conexão:'), error.message);
    console.log(yellow('⚠️ Verifique se a string de conexão está correta e se o banco de dados está acessível.'));
  }
}

checkDatabaseConnection().catch(error => {
  console.error(red('❌ Erro:'), error);
});