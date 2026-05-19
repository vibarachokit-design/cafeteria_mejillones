import type { MenuProduct } from '@/data/menuData';

export interface RemoteMenuPayload {
  products: MenuProduct[];
  updatedAt: string | null;
}

interface RemoteMenuRow {
  id: string;
  products: MenuProduct[];
  updated_at: string | null;
}

const MENU_ROW_ID = 'main';

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

const mapRowToPayload = (row?: RemoteMenuRow): RemoteMenuPayload | null => {
  if (!row || !Array.isArray(row.products)) return null;

  return {
    products: row.products,
    updatedAt: row.updated_at,
  };
};

export const isMenuSyncEnabled = () => Boolean(getSupabaseConfig());

export async function fetchRemoteMenu() {
  const config = getSupabaseConfig();
  if (!config) return null;

  const response = await fetch(
    `${config.url}/rest/v1/shared_menu?id=eq.${MENU_ROW_ID}&select=id,products,updated_at`,
    {
      method: 'GET',
      headers: createHeaders(),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Supabase no respondió al cargar el menú.');
  }

  const data = (await response.json()) as RemoteMenuRow[];
  return mapRowToPayload(data[0]);
}

export async function saveRemoteMenu(products: MenuProduct[]) {
  const config = getSupabaseConfig();
  if (!config) {
    return {
      products,
      updatedAt: null,
    };
  }

  const response = await fetch(
    `${config.url}/rest/v1/shared_menu?on_conflict=id`,
    {
      method: 'POST',
      headers: {
        ...createHeaders(true),
        Prefer: 'resolution=merge-duplicates,return=representation',
      },
      body: JSON.stringify([
        {
          id: MENU_ROW_ID,
          products,
        },
      ]),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Supabase no respondió al guardar el menú.');
  }

  const data = (await response.json()) as RemoteMenuRow[];
  return (
    mapRowToPayload(data[0]) ?? {
      products,
      updatedAt: null,
    }
  );
}
