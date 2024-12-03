import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const password = formData.get("password")?.toString();
  const direccion = formData.get("direccion")?.toString();
  const correo = formData.get("email")?.toString();
  const email = encodeURI(correo);
  const resetToken = formData.get("reset_token")?.toString();

  const { error, data } = await supabase.auth.exchangeCodeForSession(resetToken);

  // Actualizar la contraseña
  const { error: updateError } = await supabase.auth.updateUser({
      email: email,
      password: password
    });

  if (updateError) {
    return new Response(`Error al actualizar la contraseña: ${updateError.message}`, { status: 500 });
  }

  return new Response("Contraseña restaurada exitosamente. Ahora puedes iniciar sesión.", {
    status: 200,
  });
};
