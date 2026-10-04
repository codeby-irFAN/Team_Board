import { supabase } from '../lib/supabaseclient'

export function subscribeToTaskChanges(onChange) {
  const channel = supabase
    .channel('teamboard-task-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tasks',
      },
      (payload) => {
        onChange(payload)
      }
    )
    .subscribe()

  return channel
}

export function unsubscribeFromTaskChanges(channel) {
  if (channel) {
    supabase.removeChannel(channel)
  }
}