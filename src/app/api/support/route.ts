import { NextResponse } from 'next/server';
import { sql, query } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const module_protheus = searchParams.get('module');
    const search = searchParams.get('search');

    let sqlText = `SELECT * FROM support_tickets WHERE 1=1`;
    const params: any[] = [];

    if (status && status !== 'todos') {
      params.push(status);
      sqlText += ` AND status = $${params.length}`;
    }

    if (module_protheus && module_protheus !== 'todos') {
      params.push(module_protheus);
      sqlText += ` AND module_protheus = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      sqlText += ` AND (title ILIKE $${params.length} OR problem_description ILIKE $${params.length} OR solution_description ILIKE $${params.length} OR user_name ILIKE $${params.length} OR sector_name ILIKE $${params.length})`;
    }

    sqlText += ` ORDER BY created_at DESC`;

    const tickets = await query(sqlText, params);
    return NextResponse.json(tickets);
  } catch (error: any) {
    console.error('Error fetching support tickets:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      sector_id,
      sector_name,
      user_id,
      user_name,
      module_protheus,
      status = 'aberto',
      priority = 'media',
      problem_description,
      problem_media = [],
      solution_description = '',
      solution_media = [],
      tags = []
    } = body;

    if (!title || !problem_description) {
      return NextResponse.json(
        { error: 'Título e Descrição do Problema são obrigatórios' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO support_tickets (
        title, sector_id, sector_name, user_id, user_name, module_protheus,
        status, priority, problem_description, problem_media,
        solution_description, solution_media, tags
      )
      VALUES (
        ${title}, ${sector_id || null}, ${sector_name || null},
        ${user_id || null}, ${user_name || null}, ${module_protheus || null},
        ${status}, ${priority}, ${problem_description},
        ${JSON.stringify(problem_media)}::jsonb,
        ${solution_description || null},
        ${JSON.stringify(solution_media)}::jsonb,
        ${JSON.stringify(tags)}::jsonb
      )
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating support ticket:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      title,
      sector_id,
      sector_name,
      user_id,
      user_name,
      module_protheus,
      status,
      priority,
      problem_description,
      problem_media,
      solution_description,
      solution_media,
      tags
    } = body;

    if (!id || !title || !problem_description) {
      return NextResponse.json({ error: 'ID, Título e Descrição são obrigatórios' }, { status: 400 });
    }

    const result = await sql`
      UPDATE support_tickets
      SET
        title = ${title},
        sector_id = ${sector_id || null},
        sector_name = ${sector_name || null},
        user_id = ${user_id || null},
        user_name = ${user_name || null},
        module_protheus = ${module_protheus || null},
        status = ${status},
        priority = ${priority},
        problem_description = ${problem_description},
        problem_media = ${JSON.stringify(problem_media || [])}::jsonb,
        solution_description = ${solution_description || null},
        solution_media = ${JSON.stringify(solution_media || [])}::jsonb,
        tags = ${JSON.stringify(tags || [])}::jsonb,
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json(result[0]);
  } catch (error: any) {
    console.error('Error updating support ticket:', error);
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

    await sql`DELETE FROM support_tickets WHERE id = ${parseInt(id)}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting support ticket:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
