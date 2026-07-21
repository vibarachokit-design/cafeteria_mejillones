# Sincronizar menu con Supabase

Este proyecto ya puede leer y guardar el menu compartido desde Supabase.

## 1. Crear la tabla en Supabase

1. Entra a tu proyecto de Supabase.
2. Ve a `SQL Editor`.
3. Copia y ejecuta el contenido de:

`supabase/menu_sync.sql`

## 2. Obtener las credenciales

En Supabase ve a:

`Project Settings > API`

Y copia:

- `Project URL`
- `anon public key`

## 3. Crear archivo local de variables

Crea un archivo:

`.env.local`

Con este contenido:

```env
VITE_ADMIN_PIN=kihnally2026
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

## 4. Publicar en GitHub Pages

Como GitHub Pages no lee `.env.local`, debes agregar las mismas variables como `Repository secrets` o rearmar el flujo de deploy para inyectarlas al build.

Variables necesarias:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ADMIN_PIN`

## 5. Como funciona

- El computador del administrador guarda el menu en Supabase.
- El celular de la garzona consulta ese menu al abrir la app.
- Luego revisa cambios cada 20 segundos mientras la pagina este abierta.
- Si Supabase falla, el sistema sigue usando la ultima copia guardada localmente.

## 6. Limitacion importante

La clave del panel admin sigue siendo una proteccion visual del lado del navegador. No es seguridad real de backend.

Para seguridad real, el siguiente paso seria mover la escritura del menu a un backend autenticado.
