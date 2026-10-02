const { neon } = require('@neondatabase/serverless');

const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_oWpq0dA6EnCF@ep-shiny-union-b6u4g5rz-pooler.c-2.sa-east-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(connectionString);

async function migrate() {
  console.log("Iniciando migração no Neon PostgreSQL...");

  // 1. Tabela de Setores
  await sql`
    CREATE TABLE IF NOT EXISTS sectors (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      code VARCHAR(50),
      description TEXT,
      color VARCHAR(30) DEFAULT '#3b82f6',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  console.log("✓ Tabela sectors verificada/criada.");

  // 2. Tabela de Usuários / Solicitantes
  await sql`
    CREATE TABLE IF NOT EXISTS users_app (
      id SERIAL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(150),
      sector_id INT REFERENCES sectors(id) ON DELETE SET NULL,
      sector_name VARCHAR(100),
      role VARCHAR(100),
      avatar_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  console.log("✓ Tabela users_app verificada/criada.");

  // 3. Tabela de Tarefas Colaborativas
  await sql`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title VARCHAR(250) NOT NULL,
      description TEXT,
      status VARCHAR(50) DEFAULT 'todo', -- 'todo', 'in_progress', 'waiting_totvs', 'in_review', 'done'
      priority VARCHAR(20) DEFAULT 'media', -- 'baixa', 'media', 'alta', 'urgente'
      assigned_to INT REFERENCES users_app(id) ON DELETE SET NULL,
      assigned_name VARCHAR(150),
      sector_id INT REFERENCES sectors(id) ON DELETE SET NULL,
      sector_name VARCHAR(100),
      module_protheus VARCHAR(50),
      due_date DATE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  console.log("✓ Tabela tasks verificada/criada.");

  // 4. Tabela de Suporte (Problemas & Resoluções Protheus com Mídias)
  await sql`
    CREATE TABLE IF NOT EXISTS support_tickets (
      id SERIAL PRIMARY KEY,
      title VARCHAR(250) NOT NULL,
      sector_id INT REFERENCES sectors(id) ON DELETE SET NULL,
      sector_name VARCHAR(100),
      user_id INT REFERENCES users_app(id) ON DELETE SET NULL,
      user_name VARCHAR(150),
      module_protheus VARCHAR(50), -- SIGACTB, SIGAFIN, SIGAFAT, SIGACOM, SIGAEST, etc.
      status VARCHAR(50) DEFAULT 'aberto', -- 'aberto', 'em_analise', 'resolvido', 'fechado'
      priority VARCHAR(20) DEFAULT 'media',
      problem_description TEXT NOT NULL,
      problem_media JSONB DEFAULT '[]'::jsonb, -- [{ url, type: 'image'|'video', name, size }]
      solution_description TEXT,
      solution_media JSONB DEFAULT '[]'::jsonb, -- [{ url, type: 'image'|'video', name, size }]
      tags JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  console.log("✓ Tabela support_tickets verificada/criada.");

  // 5. Tabela de Documentação / Manuais Técnicos e Guias
  await sql`
    CREATE TABLE IF NOT EXISTS documentation (
      id SERIAL PRIMARY KEY,
      title VARCHAR(250) NOT NULL,
      category VARCHAR(100) DEFAULT 'Manual Técnico', -- 'Manual Técnico', 'Guia Passo a Passo', 'Procedimento Operacional', 'FAQ Protheus'
      module_protheus VARCHAR(50),
      sector_id INT REFERENCES sectors(id) ON DELETE SET NULL,
      sector_name VARCHAR(100),
      user_id INT REFERENCES users_app(id) ON DELETE SET NULL,
      user_name VARCHAR(150),
      support_ticket_id INT REFERENCES support_tickets(id) ON DELETE SET NULL,
      content TEXT NOT NULL,
      steps JSONB DEFAULT '[]'::jsonb, -- [{ step_number, title, instruction, media_url, media_type }]
      media_attachments JSONB DEFAULT '[]'::jsonb,
      tags JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  console.log("✓ Tabela documentation verificada/criada.");

  // 6. Tabela de Pontos de Lançamento (Comparativo Antes x Depois)
  await sql`
    CREATE TABLE IF NOT EXISTS launch_points (
      id SERIAL PRIMARY KEY,
      title VARCHAR(250) NOT NULL,
      module_origin VARCHAR(50),
      notes TEXT,
      -- ANTES:
      before_codigo VARCHAR(3),
      before_descricao VARCHAR(250),
      before_cfg_online BOOLEAN DEFAULT TRUE,
      before_operacao VARCHAR(3),
      before_tipo_integ VARCHAR(30) DEFAULT '1 - On Line', -- '1 - On Line', '2 - OffLine'
      before_tipo_movto VARCHAR(30) DEFAULT '1 - Inclusao', -- '1 - Inclusao', '2 - Estorno'
      -- DEPOIS:
      after_codigo VARCHAR(3),
      after_descricao VARCHAR(250),
      after_cfg_online BOOLEAN DEFAULT TRUE,
      after_operacao VARCHAR(3),
      after_tipo_integ VARCHAR(30) DEFAULT '1 - On Line', -- '1 - On Line', '2 - OffLine'
      after_tipo_movto VARCHAR(30) DEFAULT '1 - Inclusao', -- '1 - Inclusao', '2 - Estorno'
      -- Meta:
      status VARCHAR(50) DEFAULT 'Ativo',
      user_name VARCHAR(150),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  console.log("✓ Tabela launch_points verificada/criada.");

  // 7. Tabela de Lançamento Padrão (LPs com todas as abas e histórico antes/depois)
  await sql`
    CREATE TABLE IF NOT EXISTS standard_launches (
      id SERIAL PRIMARY KEY,
      lp_title VARCHAR(250),
      -- ABA CADASTRO
      cod_lanc_pad VARCHAR(3) NOT NULL,
      sequencial VARCHAR(3) NOT NULL,
      status VARCHAR(30) DEFAULT '1 - Ativo', -- '1 - Ativo' / '2 - Inativo'
      descricao VARCHAR(250),
      tipo_lcto VARCHAR(50) DEFAULT '1 - Debito', -- '1 - Debito' / '2 - Credito' / '3 - Partida Dobrada' / '4 - Cont Histor'
      tipo_sld VARCHAR(2) DEFAULT '1',
      -- ABA ENTIDADES (max 250 caracteres)
      cta_debito VARCHAR(250),
      cta_credito VARCHAR(250),
      c_custo_deb VARCHAR(250),
      c_custo_crd VARCHAR(250),
      item_debito VARCHAR(250),
      item_credito VARCHAR(250),
      cl_vlr_deb VARCHAR(250),
      cl_vlr_cred VARCHAR(250),
      outro_inf_deb VARCHAR(250),
      outro_inf_cred VARCHAR(250),
      moed_fato_db VARCHAR(250),
      moed_fato_cr VARCHAR(250),
      -- ABA VALORES
      lcto_moedas VARCHAR(6),
      vlr_moeda1 VARCHAR(250),
      vlr_moeda2 VARCHAR(250),
      vlr_moeda3 VARCHAR(250),
      vlr_moeda4 VARCHAR(250),
      vlr_moeda5 VARCHAR(250),
      -- ABA HISTORICO
      historico VARCHAR(250),
      hist_aglut VARCHAR(250),
      origem_lcto VARCHAR(250),
      rot_rastrear VARCHAR(250),
      tabela_orig VARCHAR(250),
      reg_origem VARCHAR(250),
      outros VARCHAR(500),
      -- Comparativo Antes x Depois e Histórico de alterações
      previous_version JSONB DEFAULT NULL,
      updated_by VARCHAR(150),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  console.log("✓ Tabela standard_launches verificada/criada.");

  // Inserir dados de exemplo caso o banco esteja vazio
  const sectorCount = await sql`SELECT count(*) FROM sectors`;
  if (parseInt(sectorCount[0].count) === 0) {
    console.log("Populando dados iniciais para suporte Protheus e contabilidade...");
    
    // Setores
    const insertedSectors = await sql`
      INSERT INTO sectors (name, code, description, color) VALUES
      ('Contabilidade Geral', 'CTB', 'Departamento responsável pela escrituração e conciliação contábil Protheus', '#3b82f6'),
      ('Fiscal / Tributário', 'FIS', 'Gestão de notas fiscais, apuração e obrigações acessórias', '#10b981'),
      ('Financeiro (Contas a Pagar/Receber)', 'FIN', 'Gestão de fluxo de caixa, borderôs e conciliação bancária', '#f59e0b'),
      ('Faturamento & Vendas', 'FAT', 'Emissão de notas fiscais de saída e pedidos de vendas', '#8b5cf6'),
      ('Compras & Suprimentos', 'COM', 'Pedidos de compras e notas de entrada', '#ec4899'),
      ('Estoque & Custos', 'EST', 'Movimentações de materiais e fechamento de custos (SIGAEST)', '#06b6d4'),
      ('TI / Suporte Protheus', 'TI', 'Administração de ERP TOTVS Protheus, ADVPL e infraestrutura', '#6366f1')
      RETURNING *;
    `;

    // Usuários
    const insertedUsers = await sql`
      INSERT INTO users_app (name, email, sector_id, sector_name, role, avatar_url) VALUES
      ('Carlos Eduardo (Analista Protheus)', 'carlos.analista@empresa.com.br', ${insertedSectors[6].id}, 'TI / Suporte Protheus', 'Especialista TOTVS Protheus', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
      ('Mariana Santos (Contadora Sênior)', 'mariana.contabil@empresa.com.br', ${insertedSectors[0].id}, 'Contabilidade Geral', 'Coordenadora Contábil', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'),
      ('Roberto Almeida (Fiscal)', 'roberto.fiscal@empresa.com.br', ${insertedSectors[1].id}, 'Fiscal / Tributário', 'Analista Fiscal Pleno', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
      ('Juliana Costa (Financeiro)', 'juliana.fin@empresa.com.br', ${insertedSectors[2].id}, 'Financeiro (Contas a Pagar/Receber)', 'Supervisora Financeira', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80')
      RETURNING *;
    `;

    // Chamado de Suporte exemplo com problema e resolução
    const insertedSupport = await sql`
      INSERT INTO support_tickets (
        title, sector_id, sector_name, user_id, user_name, module_protheus,
        status, priority, problem_description, problem_media, solution_description, solution_media, tags
      ) VALUES (
        'Erro Contabilização Off-line Documento de Entrada (SIGACOM/SIGACTB)',
        ${insertedSectors[0].id}, 'Contabilidade Geral',
        ${insertedUsers[1].id}, 'Mariana Santos (Contadora Sênior)',
        'SIGACTB', 'resolvido', 'alta',
        'Ao executar a rotina CTBA500 (Contabilização Off-line) para notas fiscais de entrada do tipo Normal com frete FOB, o sistema gerou a mensagem "LP 610 sequencial 001 não encontrou conta contábil de crédito" e abortou o lote.',
        ${JSON.stringify([
          { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80', type: 'image', name: 'print_erro_ctba500.png', size: '240 KB' }
        ])}::jsonb,
        'Identificado que no cadastro do Lançamento Padrão 610/001 a regra da Conta Crédito estava buscando o campo A2_CONTA (Fornecedor) quando a operação era frete vinculado à transportadora (A4_CONTA). Ajustado o LP 610 sequencial 001 com a fórmula IIf(!Empty(SD1->D1_TRANSP), Posicione("SA4",1,xFilial("SA4")+SD1->D1_TRANSP,"A4_CONTA"), Posicione("SA2",1,xFilial("SA2")+SF1->F1_FORNECE+SF1->F1_LOJA,"A2_CONTA")). Reprocessado o lote com sucesso.',
        ${JSON.stringify([
          { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80', type: 'image', name: 'print_lp610_ajustado.png', size: '310 KB' }
        ])}::jsonb,
        ${JSON.stringify(['SIGACTB', 'CTBA500', 'LP 610', 'Documento Entrada', 'SA4 Transportadora'])}::jsonb
      )
      RETURNING *;
    `;

    // Documentação / Manual Técnico exemplo
    await sql`
      INSERT INTO documentation (
        title, category, module_protheus, sector_id, sector_name, user_id, user_name, support_ticket_id,
        content, steps, tags
      ) VALUES (
        'Guia de Configuração e Auditoria de Lançamento Padrão (LP 610 - Compras)',
        'Manual Técnico', 'SIGACTB',
        ${insertedSectors[0].id}, 'Contabilidade Geral',
        ${insertedUsers[0].id}, 'Carlos Eduardo (Analista Protheus)',
        ${insertedSupport[0].id},
        'Este manual detalha o funcionamento e a parametrização do Ponto de Lançamento 610 no módulo de Contabilidade Gerencial (SIGACTB) do Protheus, abrangendo notas fiscais de entrada de mercadorias, fretes e impostos retidos.',
        ${JSON.stringify([
          { step_number: 1, title: 'Acessar Rotina CTBA080', instruction: 'Navegue em SIGACTB -> Atualizações -> Cadastros -> Lançamento Padrão (CTBA080).' },
          { step_number: 2, title: 'Localizar LP 610 Sequência 001', instruction: 'Posicione no código 610 e clique em Visualizar/Alterar para inspecionar os campos de fórmula ADVPL.' },
          { step_number: 3, title: 'Configurar Entidades Contábeis', instruction: 'Verifique se as contas débito e crédito possuem validação de preenchimento (Empty check) para evitar parada em lote.' },
          { step_number: 4, title: 'Executar Simulação de Contabilização', instruction: 'Execute a rotina CTBA500 em modo de simulação com geração de relatório de inconsistências antes de efetivar.' }
        ])}::jsonb,
        ${JSON.stringify(['LP 610', 'Manual CTB', 'ADVPL', 'Passo a Passo'])}::jsonb
      );
    `;

    // Ponto de Lançamento (Antes x Depois)
    await sql`
      INSERT INTO launch_points (
        title, module_origin, notes,
        before_codigo, before_descricao, before_cfg_online, before_operacao, before_tipo_integ, before_tipo_movto,
        after_codigo, after_descricao, after_cfg_online, after_operacao, after_tipo_integ, after_tipo_movto,
        status, user_name
      ) VALUES (
        'Ponto 610 - Entrada de Documentos Fiscais de Compras',
        'SIGACOM',
        'Alteração para permitir contabilização Off-line em lote noturno e suporte a estorno de notas',
        '610', 'Emissao Docto Entrada Compras', true, '001', '1 - On Line', '1 - Inclusao',
        '610', 'Emissao Docto Entrada Compras c/ Estorno OffLine', false, '001', '2 - OffLine', '1 - Inclusao',
        'Ativo', 'Carlos Eduardo'
      );
    `;

    // Lançamento Padrão (LP 610/001 completo)
    await sql`
      INSERT INTO standard_launches (
        lp_title,
        cod_lanc_pad, sequencial, status, descricao, tipo_lcto, tipo_sld,
        cta_debito, cta_credito, c_custo_deb, c_custo_crd, item_debito, item_credito, cl_vlr_deb, cl_vlr_cred, outro_inf_deb, outro_inf_cred, moed_fato_db, moed_fato_cr,
        lcto_moedas, vlr_moeda1, vlr_moeda2, vlr_moeda3, vlr_moeda4, vlr_moeda5,
        historico, hist_aglut, origem_lcto, rot_rastrear, tabela_orig, reg_origem, outros,
        previous_version, updated_by
      ) VALUES (
        'LP 610 / 001 - Vlr Total NF Entrada Fornecedor x Estoque',
        '610', '001', '1 - Ativo', 'Vlr Mercadorias NF Entrada', '3 - Partida Dobrada', '1',
        'Posicione("SB1",1,xFilial("SB1")+SD1->D1_COD,"B1_CONTA")',
        'Posicione("SA2",1,xFilial("SA2")+SF1->F1_FORNECE+SF1->F1_LOJA,"A2_CONTA")',
        'SD1->D1_CC', 'SF1->F1_COND', '', '', '', '', '', '', '', '',
        '100000', 'SD1->D1_TOTAL', '', '', '', '',
        '"NF " + AllTrim(SF1->F1_DOC) + " SERIE " + AllTrim(SF1->F1_SERIE) + " FORN: " + AllTrim(SF1->F1_FORNECE)',
        '', 'MATA103', 'CTBA500', 'SD1', 'SD1->(RecNo())', 'Contabilização do valor líquido das mercadorias deduzido de impostos recuperáveis (ICMS/PIS/COFINS)',
        ${JSON.stringify({
          cod_lanc_pad: '610',
          sequencial: '001',
          cta_credito: 'SA2->A2_CONTA',
          descricao: 'Versão antiga sem Posicione SA2',
          vlr_moeda1: 'SD1->D1_TOTAL',
          updated_at: '2026-09-15T10:00:00Z'
        })}::jsonb,
        'Carlos Eduardo'
      );
    `;

    // Tarefas Iniciais
    await sql`
      INSERT INTO tasks (title, description, status, priority, assigned_to, assigned_name, sector_id, sector_name, module_protheus, due_date) VALUES
      ('Revisar LP 530 de Baixa de Títulos a Receber', 'Validar regra de juros e descontos concedidos na rotina FINA070', 'in_progress', 'alta', ${insertedUsers[0].id}, 'Carlos Eduardo (Analista Protheus)', ${insertedSectors[2].id}, 'Financeiro (Contas a Pagar/Receber)', 'SIGAFIN', CURRENT_DATE + INTERVAL '2 days'),
      ('Elaborar Guia de Conciliação Contábil vs Financeiro', 'Criar documentação passo a passo para a equipe contábil fechar o mês', 'todo', 'media', ${insertedUsers[1].id}, 'Mariana Santos (Contadora Sênior)', ${insertedSectors[0].id}, 'Contabilidade Geral', 'SIGACTB', CURRENT_DATE + INTERVAL '5 days'),
      ('Auditoria de LPs do Módulo Fiscal (SIGAFIS)', 'Verificar pontos de lançamento 630 e 640 para apuração de ICMS ST', 'waiting_totvs', 'urgente', ${insertedUsers[2].id}, 'Roberto Almeida (Fiscal)', ${insertedSectors[1].id}, 'Fiscal / Tributário', 'SIGAFIS', CURRENT_DATE + INTERVAL '1 day');
    `;
    console.log("✓ Dados iniciais de demonstração inseridos com sucesso!");
  }

  console.log("Migração concluída com sucesso no Neon DB!");
}

migrate().catch((err) => {
  console.error("Erro na migração:", err);
  process.exit(1);
});
