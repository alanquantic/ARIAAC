# AARIAC Diagnostico IA para RH

Aplicacion web para evaluar que tan preparada esta una empresa para capacitar talento en IA, con foco en lideres de Recursos Humanos y organizaciones industriales.

## Incluye

- landing page comercial
- diagnostico con 12 preguntas en escala de 1 a 5
- scoring por dimension y nivel de madurez
- generacion de reporte ejecutivo
- descarga de PDF
- almacenamiento local en desarrollo y soporte para Vercel Blob en produccion
- envio de correo transaccional con Resend
- panel simple de seguimiento en `/admin`

## Ejecutar en local

```bash
npm install
npm run dev
```

La app queda disponible en [http://localhost:3000](http://localhost:3000).

## Variables opcionales

Puedes agregar un archivo `.env.local` si quieres personalizar el comportamiento:

```bash
OPENAI_API_KEY=
OPENAI_MODEL=
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3-flash-preview
NEXT_PUBLIC_APP_URL=http://localhost:3000
RESEND_API_KEY=
RESEND_FROM="AARIAC Diagnostico <noreply@updates.ceoslogica.com>"
RESEND_REPLY_TO=
RESEND_ADMIN_TO=
BLOB_READ_WRITE_TOKEN=
```

Si no defines esas variables, la app funciona con un motor de recomendaciones basado en reglas.
Si defines `GEMINI_API_KEY`, la app puede reescribir el resumen ejecutivo y el impacto de negocio con Gemini.

## Vercel

Para montarlo en Vercel:

1. Importa el repositorio.
2. Agrega estas variables de entorno:
   - `NEXT_PUBLIC_APP_URL`
   - `RESEND_API_KEY`
   - `RESEND_FROM`
   - `GEMINI_API_KEY` opcional
   - `GEMINI_MODEL` opcional
   - `RESEND_REPLY_TO` opcional
   - `RESEND_ADMIN_TO` opcional
   - `BLOB_READ_WRITE_TOKEN` para persistencia real
3. En local la app guarda en archivo. En Vercel, si agregas `BLOB_READ_WRITE_TOKEN`, cambia automaticamente a Vercel Blob.
4. Si no configuras Blob en Vercel, la app puede desplegar, pero la persistencia de respuestas no sera confiable entre ejecuciones.

## Rutas principales

- `/` landing principal
- `/diagnostico` formulario completo
- `/resultado/[id]` reporte individual
- `/admin` lista de envios guardados

## Notas del MVP

- El envio de correo se dispara al guardar un diagnostico y usa links absolutos a resultado y PDF.
- La persistencia esta implementada con fallback local para desarrollo y Blob para produccion en Vercel.
- Para una siguiente fase conviene agregar autenticacion al panel admin.
