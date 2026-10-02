const { neon } = require('@neondatabase/serverless');

const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_oWpq0dA6EnCF@ep-shiny-union-b6u4g5rz-pooler.c-2.sa-east-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(connectionString);

async function seedFull() {
  console.log("Garantindo estrutura completa e dados de demonstração...");

  // Garante coluna color em sectors
  await sql`
    ALTER TABLE sectors ADD COLUMN IF NOT EXISTS color VARCHAR(30) DEFAULT '#3b82f6';
  `;

  // Verifica se há documentos
  const docCount = await sql`SELECT count(*) FROM documentation`;
  if (parseInt(docCount[0].count) === 0) {
    const sectors = await sql`SELECT * FROM sectors LIMIT 1`;
    const users = await sql`SELECT * FROM users_app LIMIT 1`;
    const sectorId = sectors[0]?.id || null;
    const sectorName = sectors[0]?.name || 'Contabilidade Geral';
    const userId = users[0]?.id || null;
    const userName = users[0]?.name || 'Carlos Eduardo (Analista Protheus)';

    await sql`
      INSERT INTO documentation (
        title, category, module_protheus, sector_id, sector_name, user_id, user_name,
        content, steps, tags
      ) VALUES (
        'Guia de Configuração e Auditoria de Lançamento Padrão (LP 610 - Compras)',
        'Manual Técnico', 'SIGACTB',
        ${sectorId}, ${sectorName},
        ${userId}, ${userName},
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
    console.log("✓ Documentação inserida");
  }

  // Verifica se há pontos de lançamento
  const pointCount = await sql`SELECT count(*) FROM launch_points`;
  if (parseInt(pointCount[0].count) === 0) {
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
    console.log("✓ Ponto de lançamento comparativo inserido");
  }

  // Verifica se há LPs
  const lpCount = await sql`SELECT count(*) FROM standard_launches`;
  if (parseInt(lpCount[0].count) === 0) {
    await sql`
      INSERT INTO standard_launches (
        lp_title,
        cod_lanc_pad, sequencial, status, descricao, tipo_lcto, tipo_sld,
        cta_debito, cta_credito, c_custo_deb, c_custo_crd, item_debito, item_credito, cl_vlr_deb, cl_vlr_cred, outro_inf_deb, outro_inf_cred, moed_fato_db, moed_fato_cr,
        lcto_moedas, vlr_moeda1, vlr_moeda2, vlr_moeda3, vlr_moeda4, vlr_moeda5,
        historico, hist_aglut, origem_lcto, rot_rastrear, tabela_orig, reg_origem, outros,
        updated_by
      ) VALUES (
        'LP 610 / 001 - Vlr Total NF Entrada Fornecedor x Estoque',
        '610', '001', '1 - Ativo', 'Vlr Mercadorias NF Entrada', '3 - Partida Dobrada', '1',
        'Posicione("SB1",1,xFilial("SB1")+SD1->D1_COD,"B1_CONTA")',
        'Posicione("SA2",1,xFilial("SA2")+SF1->F1_FORNECE+SF1->F1_LOJA,"A2_CONTA")',
        'SD1->D1_CC', 'SF1->F1_COND', '', '', '', '', '', '', '', '',
        '100000', 'SD1->D1_TOTAL', '', '', '', '',
        '"NF " + AllTrim(SF1->F1_DOC) + " SERIE " + AllTrim(SF1->F1_SERIE) + " FORN: " + AllTrim(SF1->F1_FORNECE)',
        '', 'MATA103', 'CTBA500', 'SD1', 'SD1->(RecNo())', 'Contabilização do valor líquido das mercadorias deduzido de impostos recuperáveis (ICMS/PIS/COFINS)',
        'Carlos Eduardo'
      );
    `;
    console.log("✓ Lançamento Padrão inserido");
  }

  // Verifica se há tarefas
  const taskCount = await sql`SELECT count(*) FROM tasks`;
  if (parseInt(taskCount[0].count) === 0) {
    const users = await sql`SELECT * FROM users_app LIMIT 1`;
    const sectors = await sql`SELECT * FROM sectors LIMIT 1`;

    await sql`
      INSERT INTO tasks (title, description, status, priority, assigned_to, assigned_name, sector_id, sector_name, module_protheus, due_date) VALUES
      ('Revisar LP 530 de Baixa de Títulos a Receber', 'Validar regra de juros e descontos concedidos na rotina FINA070', 'in_progress', 'alta', ${users[0]?.id || null}, ${users[0]?.name || 'Carlos Eduardo'}, ${sectors[0]?.id || null}, ${sectors[0]?.name || 'Contabilidade Geral'}, 'SIGAFIN', CURRENT_DATE + INTERVAL '2 days'),
      ('Elaborar Guia de Conciliação Contábil vs Financeiro', 'Criar documentação passo a passo para a equipe contábil fechar o mês', 'todo', 'media', ${users[0]?.id || null}, ${users[0]?.name || 'Mariana Santos'}, ${sectors[0]?.id || null}, ${sectors[0]?.name || 'Contabilidade Geral'}, 'SIGACTB', CURRENT_DATE + INTERVAL '5 days'),
      ('Auditoria de LPs do Módulo Fiscal (SIGAFIS)', 'Verificar pontos de lançamento 630 e 640 para apuração de ICMS ST', 'waiting_totvs', 'urgente', ${users[0]?.id || null}, ${users[0]?.name || 'Roberto Almeida'}, ${sectors[0]?.id || null}, ${sectors[0]?.name || 'Fiscal / Tributário'}, 'SIGAFIS', CURRENT_DATE + INTERVAL '1 day');
    `;
    console.log("✓ Tarefas colaborativas inseridas");
  }

  console.log("✓ Finalizado com sucesso!");
}

seedFull().catch(console.error);
