import type {
  OpenTable,
  PaymentMethod,
  SaleRecord,
} from '@/context/CartContext';

interface OpenTableRow {
  table_id: string;
  items: OpenTable['items'];
  opened_at: string;
  last_sent_at: string | null;
}

interface SaleRecordRow {
  id: string;
  table_id: string;
  opened_at: string;
  closed_at: string;
  subtotal: number;
  tip_amount: number;
  total: number;
  payment_method: PaymentMethod;
  elapsed_minutes: number;
  items: SaleRecord['items'];
}

const getSupabaseConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) return null;

  return {
    url: url.replace(/\/$/, ''),
    anonKey,
  };
};

const createHeaders = (includeBody = false) => {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error(
      'Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en la configuración.'
    );
  }

  return {
    apikey: config.anonKey,
    Authorization: `Bearer ${config.anonKey}`,
    Accept: 'application/json',
    ...(includeBody ? { 'Content-Type': 'application/json' } : {}),
  };
};

const mapOpenTableRow = (row: OpenTableRow): OpenTable => ({
  tableId: row.table_id,
  items: Array.isArray(row.items) ? row.items : [],
  openedAt: row.opened_at,
  lastSentAt: row.last_sent_at,
});

const mapSaleRecordRow = (row: SaleRecordRow): SaleRecord => ({
  id: row.id,
  tableId: row.table_id,
  openedAt: row.opened_at,
  closedAt: row.closed_at,
  subtotal: row.subtotal ?? row.total,
  tipAmount: row.tip_amount ?? 0,
  total: row.total,
  paymentMethod: row.payment_method ?? 'efectivo',
  elapsedMinutes: row.elapsed_minutes ?? 0,
  items: Array.isArray(row.items) ? row.items : [],
});

export const isSharedOrdersSyncEnabled = () => Boolean(getSupabaseConfig());

export async function fetchRemoteOpenTables() {
  const config = getSupabaseConfig();
  if (!config) return null;

  const response = await fetch(
    `${config.url}/rest/v1/open_tables?select=table_id,items,opened_at,last_sent_at`,
    {
      method: 'GET',
      headers: createHeaders(),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Supabase no respondió al cargar las mesas abiertas.');
  }

  const data = (await response.json()) as OpenTableRow[];
  return Object.fromEntries(data.map((row) => [row.table_id, mapOpenTableRow(row)]));
}

export async function saveRemoteOpenTable(openTable: OpenTable) {
  const config = getSupabaseConfig();
  if (!config) return openTable;

  const response = await fetch(
    `${config.url}/rest/v1/open_tables?on_conflict=table_id`,
    {
      method: 'POST',
      headers: {
        ...createHeaders(true),
        Prefer: 'resolution=merge-duplicates,return=representation',
      },
      body: JSON.stringify([
        {
          table_id: openTable.tableId,
          items: openTable.items,
          opened_at: openTable.openedAt,
          last_sent_at: openTable.lastSentAt,
        },
      ]),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Supabase no respondió al guardar la mesa abierta.');
  }

  const data = (await response.json()) as OpenTableRow[];
  return data[0] ? mapOpenTableRow(data[0]) : openTable;
}

export async function deleteRemoteOpenTable(tableId: string) {
  const config = getSupabaseConfig();
  if (!config) return;

  const response = await fetch(
    `${config.url}/rest/v1/open_tables?table_id=eq.${tableId}`,
    {
      method: 'DELETE',
      headers: {
        ...createHeaders(),
        Prefer: 'return=minimal',
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Supabase no respondió al cerrar la mesa.');
  }
}

export async function fetchRemoteSalesHistory() {
  const config = getSupabaseConfig();
  if (!config) return null;

  const response = await fetch(
    `${config.url}/rest/v1/sales_history?select=id,table_id,opened_at,closed_at,subtotal,tip_amount,total,payment_method,elapsed_minutes,items&order=closed_at.desc`,
    {
      method: 'GET',
      headers: createHeaders(),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Supabase no respondió al cargar las ventas.');
  }

  const data = (await response.json()) as SaleRecordRow[];
  return data.map(mapSaleRecordRow);
}

export async function insertRemoteSaleRecord(sale: SaleRecord) {
  const config = getSupabaseConfig();
  if (!config) return sale;

  const response = await fetch(`${config.url}/rest/v1/sales_history`, {
    method: 'POST',
    headers: {
      ...createHeaders(true),
      Prefer: 'return=representation',
    },
    body: JSON.stringify([
      {
        id: sale.id,
        table_id: sale.tableId,
        opened_at: sale.openedAt,
        closed_at: sale.closedAt,
        subtotal: sale.subtotal,
        tip_amount: sale.tipAmount,
        total: sale.total,
        payment_method: sale.paymentMethod,
        elapsed_minutes: sale.elapsedMinutes,
        items: sale.items,
      },
    ]),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Supabase no respondió al guardar la venta.');
  }

  const data = (await response.json()) as SaleRecordRow[];
  return data[0] ? mapSaleRecordRow(data[0]) : sale;
}
