import { NextResponse } from 'next/server';
import { sql, query } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const module = searchParams.get('module');

    let sqlText = `SELECT * FROM launch_points WHERE 1=1`;
    const params: any[] = [];

    if (module && module !== 'todos') {
      params.push(module);
      sqlText += ` AND module_origin = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      sqlText += ` AND (title ILIKE $${params.length} OR before_codigo ILIKE $${params.length} OR after_codigo ILIKE $${params.length} OR before_descricao ILIKE $${params.length} OR after_descricao ILIKE $${params.length})`;
    }

    sqlText += ` ORDER BY created_at DESC`;

    const points = await query(sqlText, params);
    return NextResponse.json(points);
  } catch (error: any) {
    console.error('Error fetching launch points:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      module_origin,
      notes,
      before_codigo,
      before_descricao,
      before_cfg_online = true,
      before_operacao,
      before_tipo_integ = '1 - On Line',
      before_tipo_movto = '1 - Inclusao',
      after_codigo,
      after_descricao,
      after_cfg_online = true,
      after_operacao,
      after_tipo_integ = '1 - On Line',
      after_tipo_movto = '1 - Inclusao',
      status = 'Ativo',
      user_name
    } = body;

    if (!title) {
      return NextResponse.json({ error: 'Título da comparação é obrigatório' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO launch_points (
        title, module_origin, notes,
        before_codigo, before_descricao, before_cfg_online, before_operacao, before_tipo_integ, before_tipo_movto,
        after_codigo, after_descricao, after_cfg_online, after_operacao, after_tipo_integ, after_tipo_movto,
        status, user_name
      )
      VALUES (
        ${title}, ${module_origin || null}, ${notes || null},
        ${before_codigo ? before_codigo.slice(0, 3) : null},
        ${before_descricao ? before_descricao.slice(0, 250) : null},
        ${before_cfg_online},
        ${before_operacao ? before_operacao.slice(0, 3) : null},
        ${before_tipo_integ},
        ${before_tipo_movto},
        ${after_codigo ? after_codigo.slice(0, 3) : null},
        ${after_descricao ? after_descricao.slice(0, 250) : null},
        ${after_cfg_online},
        ${after_operacao ? after_operacao.slice(0, 3) : null},
        ${after_tipo_integ},
        ${after_tipo_movto},
        ${status}, ${user_name || null}
      )
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating launch point:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      title,
      module_origin,
      notes,
      before_codigo,
      before_descricao,
      before_cfg_online,
      before_operacao,
      before_tipo_integ,
      before_tipo_movto,
      after_codigo,
      after_descricao,
      after_cfg_online,
      after_operacao,
      after_tipo_integ,
      after_tipo_movto,
      status,
      user_name
    } = body;

    if (!id || !title) {
      return NextResponse.json({ error: 'ID e Título são obrigatórios' }, { status: 400 });
    }

    const result = await sql`
      UPDATE launch_points
      SET
        title = ${title},
        module_origin = ${module_origin || null},
        notes = ${notes || null},
        before_codigo = ${before_codigo ? before_codigo.slice(0, 3) : null},
        before_descricao = ${before_descricao ? before_descricao.slice(0, 250) : null},
        before_cfg_online = ${before_cfg_online},
        before_operacao = ${before_operacao ? before_operacao.slice(0, 3) : null},
        before_tipo_integ = ${before_tipo_integ},
        before_tipo_movto = ${before_tipo_movto},
        after_codigo = ${after_codigo ? after_codigo.slice(0, 3) : null},
        after_descricao = ${after_descricao ? after_descricao.slice(0, 250) : null},
        after_cfg_online = ${after_cfg_online},
        after_operacao = ${after_operacao ? after_operacao.slice(0, 3) : null},
        after_tipo_integ = ${after_tipo_integ},
        after_tipo_movto = ${after_tipo_movto},
        status = ${status},
        user_name = ${user_name || null},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json(result[0]);
  } catch (error: any) {
    console.error('Error updating launch point:', error);
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

    await sql`DELETE FROM launch_points WHERE id = ${parseInt(id)}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting launch point:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
