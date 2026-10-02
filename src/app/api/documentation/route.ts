import { NextResponse } from 'next/server';
import { sql, query } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const module_protheus = searchParams.get('module');
    const search = searchParams.get('search');

    let sqlText = `SELECT * FROM documentation WHERE 1=1`;
    const params: any[] = [];

    if (category && category !== 'todos') {
      params.push(category);
      sqlText += ` AND category = $${params.length}`;
    }

    if (module_protheus && module_protheus !== 'todos') {
      params.push(module_protheus);
      sqlText += ` AND module_protheus = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      sqlText += ` AND (title ILIKE $${params.length} OR content ILIKE $${params.length} OR sector_name ILIKE $${params.length} OR user_name ILIKE $${params.length})`;
    }

    sqlText += ` ORDER BY created_at DESC`;

    const docs = await query(sqlText, params);
    return NextResponse.json(docs);
  } catch (error: any) {
    console.error('Error fetching documentation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      category = 'Manual Técnico',
      module_protheus,
      sector_id,
      sector_name,
      user_id,
      user_name,
      support_ticket_id,
      content,
      steps = [],
      media_attachments = [],
      tags = []
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Título e Conteúdo do manual são obrigatórios' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO documentation (
        title, category, module_protheus, sector_id, sector_name,
        user_id, user_name, support_ticket_id, content,
        steps, media_attachments, tags
      )
      VALUES (
        ${title}, ${category}, ${module_protheus || null},
        ${sector_id || null}, ${sector_name || null},
        ${user_id || null}, ${user_name || null},
        ${support_ticket_id || null}, ${content},
        ${JSON.stringify(steps)}::jsonb,
        ${JSON.stringify(media_attachments)}::jsonb,
        ${JSON.stringify(tags)}::jsonb
      )
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating documentation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      title,
      category,
      module_protheus,
      sector_id,
      sector_name,
      user_id,
      user_name,
      support_ticket_id,
      content,
      steps,
      media_attachments,
      tags
    } = body;

    if (!id || !title || !content) {
      return NextResponse.json({ error: 'ID, Título e Conteúdo são obrigatórios' }, { status: 400 });
    }

    const result = await sql`
      UPDATE documentation
      SET
        title = ${title},
        category = ${category},
        module_protheus = ${module_protheus || null},
        sector_id = ${sector_id || null},
        sector_name = ${sector_name || null},
        user_id = ${user_id || null},
        user_name = ${user_name || null},
        support_ticket_id = ${support_ticket_id || null},
        content = ${content},
        steps = ${JSON.stringify(steps || [])}::jsonb,
        media_attachments = ${JSON.stringify(media_attachments || [])}::jsonb,
        tags = ${JSON.stringify(tags || [])}::jsonb,
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json(result[0]);
  } catch (error: any) {
    console.error('Error updating documentation:', error);
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

    await sql`DELETE FROM documentation WHERE id = ${parseInt(id)}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting documentation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
