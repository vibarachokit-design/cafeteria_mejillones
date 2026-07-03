const DEFAULT_MENU_BUCKET = 'menu-images';

const getSupabaseConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
  const bucket =
    import.meta.env.VITE_SUPABASE_MENU_BUCKET?.trim() || DEFAULT_MENU_BUCKET;

  if (!url || !anonKey) return null;

  return {
    url: url.replace(/\/$/, ''),
    anonKey,
    bucket,
  };
};

export const isMenuStorageEnabled = () => Boolean(getSupabaseConfig());

export async function uploadMenuImage(file: Blob, fileName: string) {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error('Faltan los datos de Supabase para subir imágenes.');
  }

  const extension = file.type === 'image/webp' ? 'webp' : 'jpg';
  const safeName = fileName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50) || 'producto';
  const objectPath = `products/${Date.now()}-${safeName}.${extension}`;

  const response = await fetch(
    `${config.url}/storage/v1/object/${config.bucket}/${objectPath}`,
    {
      method: 'POST',
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
        'Content-Type': file.type || 'image/webp',
        'x-upsert': 'true',
      },
      body: file,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Supabase no respondió al subir la imagen.');
  }

  return `${config.url}/storage/v1/object/public/${config.bucket}/${objectPath}`;
}
