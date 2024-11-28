import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();

  if (!email) {
    return new Response("El correo electrónico es obligatorio.", { status: 400 });
  }

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'localhost:4321/reset-password',
  })
  

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return new Response("Enlace de restauración enviado. Revisa tu correo.", { status: 200 });
};
