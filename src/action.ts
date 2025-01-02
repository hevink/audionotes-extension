import supabase from "./lib/supabase/client";

// User
export const getUser = async () => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select(
        `
        *,
        input_language:languages!users_input_language_fkey(*),
        output_language:languages!users_output_language_fkey(*),
        default_style:styles!users_default_style_fkey(*),
        plan:plans!users_plan_fkey(*)
      `
      )
      .single();

    if (error) {
      throw error.message;
    }
    return { data: data };
  } catch (error) {
    console.error("Error getting user:", error);
    return { error: error };
  }
};
