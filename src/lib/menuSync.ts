import { getFallbackImageForCategory, type MenuProduct } from '@/data/menuData';
import { getSupabaseConfig, getSupabaseConfigError } from '@/lib/supabaseConfig';

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
const MAX_INLINE_IMAGE_LENGTH = 120000;

const createHeaders = (includeBody = false) => {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error(getSupabaseConfigError() ?? 'No se pudo leer la configuracion de Supabase.');
  }

  return {
    apikey: config.anonKey,
    Authorization: `Bearer ${config.anonKey}`,
    Accept: 'application/json',
    ...(includeBody ? { 'Content-Type': 'application/json' } : {}),
  };
};

const sanitizeProductsForSync = (products: MenuProduct[]) =>
  products.map((product) => {
    if (
      typeof product.image === 'string' &&
      product.image.startsWith('data:image') &&
      product.image.length > MAX_INLINE_IMAGE_LENGTH
    ) {
      return {
        ...product,
        image: getFallbackImageForCategory(product.category),
      };
    }

    return product;
  });

const mapRowToPayload = (row?: RemoteMenuRow): RemoteMenuPayload | null => {
  if (!row || !Array.isArray(row.products)) return null;

  return {
    products: sanitizeProductsForSync(row.products),
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
  const sanitizedProducts = sanitizeProductsForSync(products);
  const config = getSupabaseConfig();
  if (!config) {
    return {
      products: sanitizedProducts,
      updatedAt: null,
    };
  }

  const response = await fetch(`${config.url}/rest/v1/shared_menu?on_conflict=id`, {
    method: 'POST',
    headers: {
      ...createHeaders(true),
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify([
      {
        id: MENU_ROW_ID,
        products: sanitizedProducts,
      },
    ]),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Supabase no respondió al guardar el menú.');
  }

  const data = (await response.json()) as RemoteMenuRow[];
  return (
    mapRowToPayload(data[0]) ?? {
      products: sanitizedProducts,
      updatedAt: null,
    }
  );
}
