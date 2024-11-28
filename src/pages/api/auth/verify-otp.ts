import { supabase } from "../../../lib/supabase";
import type { APIRoute } from 'astro';


export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const otp = formData.get("otp")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !otp || !password) {
    return new Response("Todos los campos son obligatorios", { status: 400 });
  }

  // Verificar el OTP en la base de datos
  const { data, error: dbError } = await supabase
    .from("password_reset_tokens")
    .select("*")
    .eq("email", email)
    .eq("otp", otp)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (dbError || !data) {
    return new Response("OTP inválido o expirado", { status: 400 });
  }

  // OTP válido: actualizar la contraseña del usuario
  const { error: authError } = await supabase.auth.updateUser({
    email,
    password,
  });

  if (authError) {
    return new Response(`Error al actualizar contraseña: ${authError.message}`, { status: 500 });
  }

  // Eliminar el OTP de la base de datos después de usarlo
  await supabase
    .from("password_reset_tokens")
    .delete()
    .eq("email", email);

  return new Response("Contraseña restablecida exitosamente");
};
