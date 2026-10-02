const { neon } = require('@neondatabase/serverless');

const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_oWpq0dA6EnCF@ep-shiny-union-b6u4g5rz-pooler.c-2.sa-east-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(connectionString);

async function fixSchema() {
  console.log("Verificando e sincronizando todas as colunas no Neon DB...");

  // Garante que todas as colunas existem em support_tickets
  await sql`
    ALTER TABLE support_tickets 
    ADD COLUMN IF NOT EXISTS sector_id INT,
    ADD COLUMN IF NOT EXISTS sector_name VARCHAR(100),
    ADD COLUMN IF NOT EXISTS user_id INT,
    ADD COLUMN IF NOT EXISTS user_name VARCHAR(150),
    ADD COLUMN IF NOT EXISTS module_protheus VARCHAR(50) DEFAULT 'SIGACTB',
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'aberto',
    ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'media',
    ADD COLUMN IF NOT EXISTS problem_media JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS solution_description TEXT,
    ADD COLUMN IF NOT EXISTS solution_media JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;
  `;
  console.log("✓ support_tickets colunas atualizadas com sucesso!");

  // Garante colunas em documentation
  await sql`
    ALTER TABLE documentation 
    ADD COLUMN IF NOT EXISTS sector_id INT,
    ADD COLUMN IF NOT EXISTS sector_name VARCHAR(100),
    ADD COLUMN IF NOT EXISTS user_id INT,
    ADD COLUMN IF NOT EXISTS user_name VARCHAR(150),
    ADD COLUMN IF NOT EXISTS module_protheus VARCHAR(50) DEFAULT 'SIGACTB',
    ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'Manual Técnico',
    ADD COLUMN IF NOT EXISTS support_ticket_id INT,
    ADD COLUMN IF NOT EXISTS steps JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS media_attachments JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;
  `;
  console.log("✓ documentation colunas atualizadas com sucesso!");

  // Garante colunas em standard_launches
  await sql`
    ALTER TABLE standard_launches
    ADD COLUMN IF NOT EXISTS lp_title VARCHAR(250),
    ADD COLUMN IF NOT EXISTS tipo_sld VARCHAR(2) DEFAULT '1',
    ADD COLUMN IF NOT EXISTS c_custo_deb VARCHAR(250),
    ADD COLUMN IF NOT EXISTS c_custo_crd VARCHAR(250),
    ADD COLUMN IF NOT EXISTS item_debito VARCHAR(250),
    ADD COLUMN IF NOT EXISTS item_credito VARCHAR(250),
    ADD COLUMN IF NOT EXISTS cl_vlr_deb VARCHAR(250),
    ADD COLUMN IF NOT EXISTS cl_vlr_cred VARCHAR(250),
    ADD COLUMN IF NOT EXISTS outro_inf_deb VARCHAR(250),
    ADD COLUMN IF NOT EXISTS outro_inf_cred VARCHAR(250),
    ADD COLUMN IF NOT EXISTS moed_fato_db VARCHAR(250),
    ADD COLUMN IF NOT EXISTS moed_fato_cr VARCHAR(250),
    ADD COLUMN IF NOT EXISTS lcto_moedas VARCHAR(6) DEFAULT '100000',
    ADD COLUMN IF NOT EXISTS vlr_moeda1 VARCHAR(250),
    ADD COLUMN IF NOT EXISTS vlr_moeda2 VARCHAR(250),
    ADD COLUMN IF NOT EXISTS vlr_moeda3 VARCHAR(250),
    ADD COLUMN IF NOT EXISTS vlr_moeda4 VARCHAR(250),
    ADD COLUMN IF NOT EXISTS vlr_moeda5 VARCHAR(250),
    ADD COLUMN IF NOT EXISTS historico VARCHAR(250),
    ADD COLUMN IF NOT EXISTS hist_aglut VARCHAR(250),
    ADD COLUMN IF NOT EXISTS origem_lcto VARCHAR(250),
    ADD COLUMN IF NOT EXISTS rot_rastrear VARCHAR(250),
    ADD COLUMN IF NOT EXISTS tabela_orig VARCHAR(250),
    ADD COLUMN IF NOT EXISTS reg_origem VARCHAR(250),
    ADD COLUMN IF NOT EXISTS outros VARCHAR(500),
    ADD COLUMN IF NOT EXISTS previous_version JSONB,
    ADD COLUMN IF NOT EXISTS updated_by VARCHAR(150);
  `;
  console.log("✓ standard_launches colunas atualizadas com sucesso!");

  // Garante colunas em launch_points
  await sql`
    ALTER TABLE launch_points
    ADD COLUMN IF NOT EXISTS module_origin VARCHAR(50),
    ADD COLUMN IF NOT EXISTS notes TEXT,
    ADD COLUMN IF NOT EXISTS before_codigo VARCHAR(3),
    ADD COLUMN IF NOT EXISTS before_descricao VARCHAR(250),
    ADD COLUMN IF NOT EXISTS before_cfg_online BOOLEAN DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS before_operacao VARCHAR(3),
    ADD COLUMN IF NOT EXISTS before_tipo_integ VARCHAR(30) DEFAULT '1 - On Line',
    ADD COLUMN IF NOT EXISTS before_tipo_movto VARCHAR(30) DEFAULT '1 - Inclusao',
    ADD COLUMN IF NOT EXISTS after_codigo VARCHAR(3),
    ADD COLUMN IF NOT EXISTS after_descricao VARCHAR(250),
    ADD COLUMN IF NOT EXISTS after_cfg_online BOOLEAN DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS after_operacao VARCHAR(3),
    ADD COLUMN IF NOT EXISTS after_tipo_integ VARCHAR(30) DEFAULT '1 - On Line',
    ADD COLUMN IF NOT EXISTS after_tipo_movto VARCHAR(30) DEFAULT '1 - Inclusao',
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Ativo',
    ADD COLUMN IF NOT EXISTS user_name VARCHAR(150);
  `;
  console.log("✓ launch_points colunas atualizadas com sucesso!");

  // Garante colunas em tasks
  await sql`
    ALTER TABLE tasks
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'todo',
    ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'media',
    ADD COLUMN IF NOT EXISTS assigned_to INT,
    ADD COLUMN IF NOT EXISTS assigned_name VARCHAR(150),
    ADD COLUMN IF NOT EXISTS sector_id INT,
    ADD COLUMN IF NOT EXISTS sector_name VARCHAR(100),
    ADD COLUMN IF NOT EXISTS module_protheus VARCHAR(50),
    ADD COLUMN IF NOT EXISTS due_date DATE;
  `;
  console.log("✓ tasks colunas atualizadas com sucesso!");

  // Garante colunas em users_app
  await sql`
    ALTER TABLE users_app
    ADD COLUMN IF NOT EXISTS email VARCHAR(150),
    ADD COLUMN IF NOT EXISTS sector_id INT,
    ADD COLUMN IF NOT EXISTS sector_name VARCHAR(100),
    ADD COLUMN IF NOT EXISTS role VARCHAR(100),
    ADD COLUMN IF NOT EXISTS avatar_url TEXT;
  `;
  console.log("✓ users_app colunas atualizadas com sucesso!");

  console.log("Todas as tabelas do Neon DB estão 100% atualizadas!");
}

fixSchema().catch(console.error);
