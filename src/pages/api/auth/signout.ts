import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ redirect, cookies }) => {
  // Cerrar sesión en Supabase
  await supabase.auth.signOut();

  // Eliminar cookies
  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });

  // Redirigir al inicio de sesión
  return redirect("/signin");
};
