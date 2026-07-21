const normalizeSupabaseUrl = (value?: string) => {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    const hostname = parsed.hostname.toLowerCase();

    if (parsed.protocol !== 'https:' || !hostname.endsWith('.supabase.co')) {
      return null;
    }

    return `${parsed.origin}${parsed.pathname}`.replace(/\/$/, '');
  } catch {
    return null;
  }
};

export const getSupabaseConfig = () => {
  const url = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) return null;

  return {
    url,
    anonKey,
  };
};

export const getSupabaseConfigError = () => {
  const rawUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  if (!rawUrl || !anonKey) {
    return 'Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en la configuracion.';
  }

  if (!normalizeSupabaseUrl(rawUrl)) {
    return 'La URL de Supabase es invalida. Revisa el secret VITE_SUPABASE_URL en GitHub: debe verse como https://tu-proyecto.supabase.co';
  }

  return null;
};
