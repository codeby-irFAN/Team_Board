import { supabase } from "../lib/supabaseclient";

export async function getTasks() {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export async function createTask(task) {
  const { data, error } = await supabase
    .from("tasks")
    .insert(task)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateTask(taskId, updates, expectedVersion) {
  const { data, error } = await supabase
    .from("tasks")
    .update({
      ...updates,
      version: expectedVersion + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", taskId)
    .eq("version", expectedVersion)
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteTask(taskId) {
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) {
    throw error;
  }
}
