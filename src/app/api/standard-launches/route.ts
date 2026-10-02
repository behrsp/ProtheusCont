import { NextResponse } from 'next/server';
import { sql, query } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const cod = searchParams.get('cod');

    let sqlText = `SELECT * FROM standard_launches WHERE 1=1`;
    const params: any[] = [];

    if (cod) {
      params.push(cod);
      sqlText += ` AND cod_lanc_pad = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      sqlText += ` AND (cod_lanc_pad ILIKE $${params.length} OR descricao ILIKE $${params.length} OR cta_debito ILIKE $${params.length} OR cta_credito ILIKE $${params.length} OR historico ILIKE $${params.length} OR outros ILIKE $${params.length})`;
    }

    sqlText += ` ORDER BY cod_lanc_pad ASC, sequencial ASC`;

    const lps = await query(sqlText, params);
    return NextResponse.json(lps);
  } catch (error: any) {
    console.error('Error fetching standard launches:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      lp_title,
      // ABA Cadastro
      cod_lanc_pad,
      sequencial,
      status = '1 - Ativo',
      descricao,
      tipo_lcto = '1 - Debito',
      tipo_sld = '1',
      // ABA Entidades (max 250)
      cta_debito,
      cta_credito,
      c_custo_deb,
      c_custo_crd,
      item_debito,
      item_credito,
      cl_vlr_deb,
      cl_vlr_cred,
      outro_inf_deb,
      outro_inf_cred,
      moed_fato_db,
      moed_fato_cr,
      // ABA Valores
      lcto_moedas,
      vlr_moeda1,
      vlr_moeda2,
      vlr_moeda3,
      vlr_moeda4,
      vlr_moeda5,
      // ABA Historico
      historico,
      hist_aglut,
      origem_lcto,
      rot_rastrear,
      tabela_orig,
      reg_origem,
      outros,
      updated_by
    } = body;

    if (!cod_lanc_pad || !sequencial) {
      return NextResponse.json(
        { error: 'Código do Lançamento Padrão (3 dígitos) e Sequencial (3 dígitos) são obrigatórios' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO standard_launches (
        lp_title,
        cod_lanc_pad, sequencial, status, descricao, tipo_lcto, tipo_sld,
        cta_debito, cta_credito, c_custo_deb, c_custo_crd, item_debito, item_credito,
        cl_vlr_deb, cl_vlr_cred, outro_inf_deb, outro_inf_cred, moed_fato_db, moed_fato_cr,
        lcto_moedas, vlr_moeda1, vlr_moeda2, vlr_moeda3, vlr_moeda4, vlr_moeda5,
        historico, hist_aglut, origem_lcto, rot_rastrear, tabela_orig, reg_origem, outros,
        updated_by
      )
      VALUES (
        ${lp_title || `LP ${cod_lanc_pad} / ${sequencial}`},
        ${cod_lanc_pad.slice(0, 3)},
        ${sequencial.slice(0, 3)},
        ${status},
        ${descricao ? descricao.slice(0, 250) : null},
        ${tipo_lcto},
        ${tipo_sld ? tipo_sld.slice(0, 2) : '1'},
        ${cta_debito ? cta_debito.slice(0, 250) : null},
        ${cta_credito ? cta_credito.slice(0, 250) : null},
        ${c_custo_deb ? c_custo_deb.slice(0, 250) : null},
        ${c_custo_crd ? c_custo_crd.slice(0, 250) : null},
        ${item_debito ? item_debito.slice(0, 250) : null},
        ${item_credito ? item_credito.slice(0, 250) : null},
        ${cl_vlr_deb ? cl_vlr_deb.slice(0, 250) : null},
        ${cl_vlr_cred ? cl_vlr_cred.slice(0, 250) : null},
        ${outro_inf_deb ? outro_inf_deb.slice(0, 250) : null},
        ${outro_inf_cred ? outro_inf_cred.slice(0, 250) : null},
        ${moed_fato_db ? moed_fato_db.slice(0, 250) : null},
        ${moed_fato_cr ? moed_fato_cr.slice(0, 250) : null},
        ${lcto_moedas ? lcto_moedas.slice(0, 6) : '100000'},
        ${vlr_moeda1 ? vlr_moeda1.slice(0, 250) : null},
        ${vlr_moeda2 ? vlr_moeda2.slice(0, 250) : null},
        ${vlr_moeda3 ? vlr_moeda3.slice(0, 250) : null},
        ${vlr_moeda4 ? vlr_moeda4.slice(0, 250) : null},
        ${vlr_moeda5 ? vlr_moeda5.slice(0, 250) : null},
        ${historico ? historico.slice(0, 250) : null},
        ${hist_aglut ? hist_aglut.slice(0, 250) : null},
        ${origem_lcto ? origem_lcto.slice(0, 250) : null},
        ${rot_rastrear ? rot_rastrear.slice(0, 250) : null},
        ${tabela_orig ? tabela_orig.slice(0, 250) : null},
        ${reg_origem ? reg_origem.slice(0, 250) : null},
        ${outros ? outros.slice(0, 500) : null},
        ${updated_by || null}
      )
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating standard launch:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      lp_title,
      cod_lanc_pad,
      sequencial,
      status,
      descricao,
      tipo_lcto,
      tipo_sld,
      cta_debito,
      cta_credito,
      c_custo_deb,
      c_custo_crd,
      item_debito,
      item_credito,
      cl_vlr_deb,
      cl_vlr_cred,
      outro_inf_deb,
      outro_inf_cred,
      moed_fato_db,
      moed_fato_cr,
      lcto_moedas,
      vlr_moeda1,
      vlr_moeda2,
      vlr_moeda3,
      vlr_moeda4,
      vlr_moeda5,
      historico,
      hist_aglut,
      origem_lcto,
      rot_rastrear,
      tabela_orig,
      reg_origem,
      outros,
      updated_by
    } = body;

    if (!id || !cod_lanc_pad || !sequencial) {
      return NextResponse.json({ error: 'ID, Código LP e Sequencial são obrigatórios' }, { status: 400 });
    }

    // Primeiro busca o estado atual para gravar como previous_version (Histórico / Antes x Depois)
    const current = await sql`SELECT * FROM standard_launches WHERE id = ${id}`;
    const previous_version = current.length > 0 ? current[0] : null;

    const result = await sql`
      UPDATE standard_launches
      SET
        lp_title = ${lp_title || `LP ${cod_lanc_pad} / ${sequencial}`},
        cod_lanc_pad = ${cod_lanc_pad.slice(0, 3)},
        sequencial = ${sequencial.slice(0, 3)},
        status = ${status},
        descricao = ${descricao ? descricao.slice(0, 250) : null},
        tipo_lcto = ${tipo_lcto},
        tipo_sld = ${tipo_sld ? tipo_sld.slice(0, 2) : '1'},
        cta_debito = ${cta_debito ? cta_debito.slice(0, 250) : null},
        cta_credito = ${cta_credito ? cta_credito.slice(0, 250) : null},
        c_custo_deb = ${c_custo_deb ? c_custo_deb.slice(0, 250) : null},
        c_custo_crd = ${c_custo_crd ? c_custo_crd.slice(0, 250) : null},
        item_debito = ${item_debito ? item_debito.slice(0, 250) : null},
        item_credito = ${item_credito ? item_credito.slice(0, 250) : null},
        cl_vlr_deb = ${cl_vlr_deb ? cl_vlr_deb.slice(0, 250) : null},
        cl_vlr_cred = ${cl_vlr_cred ? cl_vlr_cred.slice(0, 250) : null},
        outro_inf_deb = ${outro_inf_deb ? outro_inf_deb.slice(0, 250) : null},
        outro_inf_cred = ${outro_inf_cred ? outro_inf_cred.slice(0, 250) : null},
        moed_fato_db = ${moed_fato_db ? moed_fato_db.slice(0, 250) : null},
        moed_fato_cr = ${moed_fato_cr ? moed_fato_cr.slice(0, 250) : null},
        lcto_moedas = ${lcto_moedas ? lcto_moedas.slice(0, 6) : '100000'},
        vlr_moeda1 = ${vlr_moeda1 ? vlr_moeda1.slice(0, 250) : null},
        vlr_moeda2 = ${vlr_moeda2 ? vlr_moeda2.slice(0, 250) : null},
        vlr_moeda3 = ${vlr_moeda3 ? vlr_moeda3.slice(0, 250) : null},
        vlr_moeda4 = ${vlr_moeda4 ? vlr_moeda4.slice(0, 250) : null},
        vlr_moeda5 = ${vlr_moeda5 ? vlr_moeda5.slice(0, 250) : null},
        historico = ${historico ? historico.slice(0, 250) : null},
        hist_aglut = ${hist_aglut ? hist_aglut.slice(0, 250) : null},
        origem_lcto = ${origem_lcto ? origem_lcto.slice(0, 250) : null},
        rot_rastrear = ${rot_rastrear ? rot_rastrear.slice(0, 250) : null},
        tabela_orig = ${tabela_orig ? tabela_orig.slice(0, 250) : null},
        reg_origem = ${reg_origem ? reg_origem.slice(0, 250) : null},
        outros = ${outros ? outros.slice(0, 500) : null},
        previous_version = ${JSON.stringify(previous_version)}::jsonb,
        updated_by = ${updated_by || null},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json(result[0]);
  } catch (error: any) {
    console.error('Error updating standard launch:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    await sql`DELETE FROM standard_launches WHERE id = ${parseInt(id)}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting standard launch:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
