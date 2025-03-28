/**
 * Script para gerar automaticamente os tipos TypeScript para o Supabase
 * 
 * Este script usa a CLI do Supabase para gerar tipos TypeScript a partir do seu banco de dados.
 * Isso mantém o arquivo shared/supabase-types.ts sempre atualizado com a estrutura do banco.
 * 
 * Pré-requisitos:
 * - Instalar Supabase CLI: npm install -g supabase
 * - Autenticar: supabase login
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Verifica se as variáveis de ambiente estão disponíveis
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error('Erro: As variáveis de ambiente SUPABASE_URL e SUPABASE_SERVICE_KEY são necessárias.');
  console.error('Adicione-as ao arquivo .env ou configure-as no ambiente.');
  process.exit(1);
}

// Extrai o ID do projeto do URL do Supabase
function extractProjectId(url) {
  // Obtém o primeiro segmento do hostname (exemplo: https://abcdefghijklm.supabase.co -> abcdefghijklm)
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  if (match && match[1]) {
    return match[1];
  }
  throw new Error(`Não foi possível extrair o ID do projeto do URL: ${url}`);
}

const projectId = extractProjectId(process.env.SUPABASE_URL);
const apiKey = process.env.SUPABASE_SERVICE_KEY;
const outputFile = path.join(__dirname, 'shared', 'supabase-types.ts');
const tempFile = path.join(__dirname, 'temp-supabase-types.ts');

console.log('# Gerando tipos TypeScript para o Supabase');
console.log(`URL do projeto: ${process.env.SUPABASE_URL}`);
console.log(`ID do projeto: ${projectId}`);
console.log(`Arquivo de saída: ${outputFile}`);

// Comando para gerar os tipos
const command = `supabase gen types typescript --project-id ${projectId} --api-key ${apiKey} > ${tempFile}`;

// Executa o comando
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Erro ao executar o comando: ${error.message}`);
    console.error('Certifique-se de que a Supabase CLI está instalada e você está autenticado.');
    console.error('Execute: npm install -g supabase && supabase login');
    
    // Limpa o arquivo temporário se existir
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
    
    process.exit(1);
  }
  
  if (stderr) {
    console.warn(`Avisos: ${stderr}`);
  }
  
  // Verifica se o arquivo temporário existe e tem conteúdo
  if (fs.existsSync(tempFile)) {
    const fileContent = fs.readFileSync(tempFile, 'utf8');
    
    if (fileContent.includes('export type Json =') && fileContent.includes('export interface Database')) {
      // Move o arquivo para o destino final
      fs.renameSync(tempFile, outputFile);
      console.log('\n✅ Tipos TypeScript gerados com sucesso!');
      console.log(`Arquivo criado: ${outputFile}`);
    } else {
      console.error('O arquivo gerado parece estar incompleto ou vazio.');
      fs.unlinkSync(tempFile);
      process.exit(1);
    }
  } else {
    console.error('Falha ao gerar o arquivo de tipos.');
    process.exit(1);
  }
});