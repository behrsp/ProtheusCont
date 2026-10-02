import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const [
      ticketStats,
      docStats,
      lpStats,
      pointStats,
      taskStats,
      userStats,
      sectorStats
    ] = await Promise.all([
      sql`SELECT 
            count(*) as total,
            count(*) FILTER (WHERE status = 'aberto' OR status = 'em_analise') as open,
            count(*) FILTER (WHERE status = 'resolvido' OR status = 'fechado') as resolved
          FROM support_tickets`,
      sql`SELECT count(*) as total FROM documentation`,
      sql`SELECT count(*) as total FROM standard_launches`,
      sql`SELECT count(*) as total FROM launch_points`,
      sql`SELECT 
            count(*) as total,
            count(*) FILTER (WHERE status != 'done') as pending
          FROM tasks`,
      sql`SELECT count(*) as total FROM users_app`,
      sql`SELECT count(*) as total FROM sectors`
    ]);

    return NextResponse.json({
      totalTickets: parseInt(ticketStats[0]?.total || '0'),
      openTickets: parseInt(ticketStats[0]?.open || '0'),
      resolvedTickets: parseInt(ticketStats[0]?.resolved || '0'),
      totalDocs: parseInt(docStats[0]?.total || '0'),
      totalLPs: parseInt(lpStats[0]?.total || '0'),
      totalLaunchPoints: parseInt(pointStats[0]?.total || '0'),
      totalTasks: parseInt(taskStats[0]?.total || '0'),
      pendingTasks: parseInt(taskStats[0]?.pending || '0'),
      totalUsers: parseInt(userStats[0]?.total || '0'),
      totalSectors: parseInt(sectorStats[0]?.total || '0'),
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
