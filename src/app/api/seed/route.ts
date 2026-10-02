import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST() {
  try {
    // Insere dados padrão caso necessário
    const sectorCount = await sql`SELECT count(*) FROM sectors`;
    if (parseInt(sectorCount[0].count) === 0) {
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

      const insertedUsers = await sql`
        INSERT INTO users_app (name, email, sector_id, sector_name, role, avatar_url) VALUES
        ('Carlos Eduardo (Analista Protheus)', 'carlos.analista@empresa.com.br', ${insertedSectors[6].id}, 'TI / Suporte Protheus', 'Especialista TOTVS Protheus', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
        ('Mariana Santos (Contadora Sênior)', 'mariana.contabil@empresa.com.br', ${insertedSectors[0].id}, 'Contabilidade Geral', 'Coordenadora Contábil', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'),
        ('Roberto Almeida (Fiscal)', 'roberto.fiscal@empresa.com.br', ${insertedSectors[1].id}, 'Fiscal / Tributário', 'Analista Fiscal Pleno', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
        ('Juliana Costa (Financeiro)', 'juliana.fin@empresa.com.br', ${insertedSectors[2].id}, 'Financeiro (Contas a Pagar/Receber)', 'Supervisora Financeira', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80')
        RETURNING *;
      `;

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

      await sql`
        INSERT INTO tasks (title, description, status, priority, assigned_to, assigned_name, sector_id, sector_name, module_protheus, due_date) VALUES
        ('Revisar LP 530 de Baixa de Títulos a Receber', 'Validar regra de juros e descontos concedidos na rotina FINA070', 'in_progress', 'alta', ${insertedUsers[0].id}, 'Carlos Eduardo (Analista Protheus)', ${insertedSectors[2].id}, 'Financeiro (Contas a Pagar/Receber)', 'SIGAFIN', CURRENT_DATE + INTERVAL '2 days'),
        ('Elaborar Guia de Conciliação Contábil vs Financeiro', 'Criar documentação passo a passo para a equipe contábil fechar o mês', 'todo', 'media', ${insertedUsers[1].id}, 'Mariana Santos (Contadora Sênior)', ${insertedSectors[0].id}, 'Contabilidade Geral', 'SIGACTB', CURRENT_DATE + INTERVAL '5 days'),
        ('Auditoria de LPs do Módulo Fiscal (SIGAFIS)', 'Verificar pontos de lançamento 630 e 640 para apuração de ICMS ST', 'waiting_totvs', 'urgente', ${insertedUsers[2].id}, 'Roberto Almeida (Fiscal)', ${insertedSectors[1].id}, 'Fiscal / Tributário', 'SIGAFIS', CURRENT_DATE + INTERVAL '1 day');
      `;
    }

    return NextResponse.json({ success: true, message: 'Dados inicializados com sucesso no Neon DB' });
  } catch (error: any) {
    console.error('Error seeding data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
