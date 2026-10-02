export interface Sector {
  id: number;
  name: string;
  code?: string;
  description?: string;
  color?: string;
  created_at?: string;
}

export interface UserApp {
  id: number;
  name: string;
  email?: string;
  sector_id?: number;
  sector_name?: string;
  role?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface MediaAttachment {
  id?: string;
  url: string;
  type: 'image' | 'video';
  name: string;
  size?: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'waiting_totvs' | 'in_review' | 'done';
export type TaskPriority = 'baixa' | 'media' | 'alta' | 'urgente';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigned_to?: number;
  assigned_name?: string;
  sector_id?: number;
  sector_name?: string;
  module_protheus?: string;
  due_date?: string;
  created_at?: string;
  updated_at?: string;
}

export type SupportStatus = 'aberto' | 'em_analise' | 'resolvido' | 'fechado';

export interface SupportTicket {
  id: number;
  title: string;
  sector_id?: number;
  sector_name?: string;
  user_id?: number;
  user_name?: string;
  module_protheus?: string;
  status: SupportStatus;
  priority: TaskPriority;
  problem_description: string;
  problem_media: MediaAttachment[];
  solution_description?: string;
  solution_media: MediaAttachment[];
  tags: string[];
  created_at?: string;
  updated_at?: string;
}

export interface DocStep {
  step_number: number;
  title: string;
  instruction: string;
  media_url?: string;
  media_type?: 'image' | 'video';
}

export interface Documentation {
  id: number;
  title: string;
  category: 'Manual Técnico' | 'Guia Passo a Passo' | 'Procedimento Operacional' | 'FAQ Protheus';
  module_protheus?: string;
  sector_id?: number;
  sector_name?: string;
  user_id?: number;
  user_name?: string;
  support_ticket_id?: number;
  content: string;
  steps: DocStep[];
  media_attachments: MediaAttachment[];
  tags: string[];
  created_at?: string;
  updated_at?: string;
}

export interface LaunchPoint {
  id: number;
  title: string;
  module_origin?: string;
  notes?: string;
  
  // ANTES
  before_codigo?: string;
  before_descricao?: string;
  before_cfg_online: boolean;
  before_operacao?: string;
  before_tipo_integ: '1 - On Line' | '2 - OffLine' | '3 - Ambos' | string;
  before_tipo_movto: '1 - Inclusao' | '2 - Estorno' | string;
  
  // DEPOIS
  after_codigo?: string;
  after_descricao?: string;
  after_cfg_online: boolean;
  after_operacao?: string;
  after_tipo_integ: '1 - On Line' | '2 - OffLine' | '3 - Ambos' | string;
  after_tipo_movto: '1 - Inclusao' | '2 - Estorno' | string;
  
  status?: string;
  user_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StandardLaunch {
  id: number;
  lp_title?: string;
  
  // ABA CADASTRO
  cod_lanc_pad: string; // 3 digitos
  sequencial: string; // 3 digitos
  status: '1 - Ativo' | '2 - Inativo' | string;
  descricao?: string; // max 250
  tipo_lcto: '1 - Debito' | '2 - Credito' | '3 - Partida Dobrada' | '4 - Cont Histor' | string;
  tipo_sld?: string; // 2 digitos
  
  // ABA ENTIDADES (max 250 chars)
  cta_debito?: string;
  cta_credito?: string;
  c_custo_deb?: string;
  c_custo_crd?: string;
  item_debito?: string;
  item_credito?: string;
  cl_vlr_deb?: string;
  cl_vlr_cred?: string;
  outro_inf_deb?: string;
  outro_inf_cred?: string;
  moed_fato_db?: string;
  moed_fato_cr?: string;
  
  // ABA VALORES
  lcto_moedas?: string; // 6 digitos
  vlr_moeda1?: string; // max 250
  vlr_moeda2?: string; // max 250
  vlr_moeda3?: string; // max 250
  vlr_moeda4?: string; // max 250
  vlr_moeda5?: string; // max 250
  
  // ABA HISTORICO
  historico?: string; // max 250
  hist_aglut?: string; // max 250
  origem_lcto?: string; // max 250
  rot_rastrear?: string; // max 250
  tabela_orig?: string; // max 250
  reg_origem?: string; // max 250
  outros?: string; // max 500
  
  previous_version?: Partial<StandardLaunch> | null;
  updated_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  totalDocs: number;
  totalLPs: number;
  totalLaunchPoints: number;
  totalTasks: number;
  pendingTasks: number;
  totalUsers: number;
  totalSectors: number;
}
