import supabase from "./lib/supabase/client";
import { TypeUser } from "./lib/types";

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

// Plan
export const getUserPlan = async () => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("plan:plans(*)")
      .single();

    if (error) {
      throw error.message;
    }

    return { data: data.plan };
  } catch (error) {
    console.error("Error getting user plan:", error);
    return { error: error };
  }
};

export const getLanguages = async () => {
  try {
    const { data, error } = await supabase.from("languages").select();
    if (error) {
      console.error("Error getting languages:", error);
      throw error.message;
    }
    return { data: data };
  } catch (error) {
    console.error("Error getting languages:", error);
    return { error: error };
  }
};

export const updateUser = async (updates: Partial<TypeUser>) => {
  const user = await getUserDetails();
  if (!user) {
    return { error: "User not found" };
  }
  try {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", user.id)
      .select(
        "* , input_language:users_input_language_fkey(*), output_language:users_output_language_fkey(*), default_style:users_default_style_fkey(*), plan:users_plan_fkey(*)"
      )
      .single();

    if (error) {
      throw error.message;
    }
    return { data };
  } catch (error) {
    console.error("Error updating user:", error);
    return { error: error };
  }
};

export const getUserDetails = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  } catch (error) {
    console.error("[Get User Error]", error);
    return null;
  }
};
