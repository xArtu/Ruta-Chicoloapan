// Con `output: 'hybrid'` configurado:
// export const prerender = false;
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const nombre = formData.get("nombre")?.toString();
  const apellido = formData.get("apellido")?.toString();

  if (!email || !password || !nombre || !apellido) {
    return new Response("Todos los campos son obligatorios", { status: 400 });
  }

  // Crear el usuario en Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return new Response(`Error al registrar usuario: ${authError.message}`, { status: 500 });
  }

  // Insertar datos en la tabla de Usuarios
  const { error: dbError } = await supabase.from("Usuarios").insert([
    {
      id: authData.user?.id, // Usar el ID del usuario creado en Supabase Auth
      nombre,
      apellido,
      email 
    },
  ]);

  if (dbError) {
    return new Response(`Error al guardar datos del usuario: ${dbError.message}`, { status: 500 });
  }

  return redirect("/signin");
};
