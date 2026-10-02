import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const sector_id = searchParams.get('sector_id');

    let tasks;
    if (status && sector_id) {
      tasks = await sql`
        SELECT * FROM tasks 
        WHERE status = ${status} AND sector_id = ${parseInt(sector_id)}
        ORDER BY due_date ASC NULLS LAST, created_at DESC
      `;
    } else if (status) {
      tasks = await sql`
        SELECT * FROM tasks 
        WHERE status = ${status}
        ORDER BY due_date ASC NULLS LAST, created_at DESC
      `;
    } else if (sector_id) {
      tasks = await sql`
        SELECT * FROM tasks 
        WHERE sector_id = ${parseInt(sector_id)}
        ORDER BY due_date ASC NULLS LAST, created_at DESC
      `;
    } else {
      tasks = await sql`
        SELECT * FROM tasks 
        ORDER BY due_date ASC NULLS LAST, created_at DESC
      `;
    }

    return NextResponse.json(tasks);
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      status = 'todo',
      priority = 'media',
      assigned_to,
      assigned_name,
      sector_id,
      sector_name,
      module_protheus,
      due_date
    } = body;

    if (!title) {
      return NextResponse.json({ error: 'Título da tarefa é obrigatório' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO tasks (
        title, description, status, priority, assigned_to, assigned_name,
        sector_id, sector_name, module_protheus, due_date
      )
      VALUES (
        ${title}, ${description || null}, ${status}, ${priority},
        ${assigned_to || null}, ${assigned_name || null},
        ${sector_id || null}, ${sector_name || null},
        ${module_protheus || null}, ${due_date || null}
      )
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      title,
      description,
      status,
      priority,
      assigned_to,
      assigned_name,
      sector_id,
      sector_name,
      module_protheus,
      due_date
    } = body;

    if (!id || !title) {
      return NextResponse.json({ error: 'ID e Título são obrigatórios' }, { status: 400 });
    }

    const result = await sql`
      UPDATE tasks
      SET
        title = ${title},
        description = ${description || null},
        status = ${status},
        priority = ${priority},
        assigned_to = ${assigned_to || null},
        assigned_name = ${assigned_name || null},
        sector_id = ${sector_id || null},
        sector_name = ${sector_name || null},
        module_protheus = ${module_protheus || null},
        due_date = ${due_date || null},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json(result[0]);
  } catch (error: any) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID e Status são obrigatórios' }, { status: 400 });
    }

    const result = await sql`
      UPDATE tasks
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json(result[0]);
  } catch (error: any) {
    console.error('Error updating task status:', error);
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

    await sql`DELETE FROM tasks WHERE id = ${parseInt(id)}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
