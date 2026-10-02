import { supabase } from '../lib/supabaseclient'

const clientId = crypto.randomUUID()

let channel = null

export function subscribeToEditingPresence(onChange) {
  channel = supabase
    .channel('teamboard-editing-presence', {
      config: {
        presence: {
          key: clientId,
        },
      },
    })
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState()
      const editingTasks = {}

      Object.values(state)
        .flat()
        .forEach((presence) => {
          if (
            presence.clientId !== clientId &&
            presence.editingTaskId
          ) {
            editingTasks[presence.editingTaskId] = true
          }
        })

      onChange(editingTasks)
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          clientId,
          editingTaskId: null,
        })
      }
    })

  return channel
}

export async function startEditingTask(taskId) {
  if (!channel) return

  await channel.track({
    clientId,
    editingTaskId: taskId,
  })
}

export async function stopEditingTask() {
  if (!channel) return

  await channel.track({
    clientId,
    editingTaskId: null,
  })
}

export function unsubscribeFromEditingPresence() {
  if (channel) {
    supabase.removeChannel(channel)
    channel = null
  }
}