import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const password = formData.get("password")?.toString();

  // Acceder a los parámetros de la URL
  const url = new URL(request.url);
  const accessToken = url.searchParams.get("access_token");

  if (!password || !accessToken) {
    return new Response("Faltan datos necesarios.", { status: 400 });
  }

  // Establecer la sesión temporalmente usando el token de acceso
  const { error: sessionError } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: "",
  });

  if (sessionError) {
    return new Response(`Error al establecer la sesión: ${sessionError.message}`, { status: 500 });
  }

  // Actualizar la contraseña
  const { data, error } = await supabase.auth.updateUser({ password });

  if (error) {
    return new Response(`Error al actualizar la contraseña: ${error.message}`, { status: 500 });
  }

  return new Response("Contraseña restaurada exitosamente. Ahora puedes iniciar sesión.", {
    status: 200,
  });
};
