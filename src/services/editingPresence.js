import { supabase } from '../lib/supabaseclient'

const clientId = crypto.randomUUID()

let channel = null
let onChangeCallback = null
const editingTasks = {}

export function subscribeToEditingPresence(onChange) {
  onChangeCallback = onChange

  channel = supabase
    .channel('teamboard-editing-presence')
    .on(
      'broadcast',
      { event: 'editing' },
      ({ payload }) => {
        if (!payload) return

        if (payload.clientId === clientId) {
          return
        }

        if (payload.editingTaskId) {
          editingTasks[payload.clientId] = payload.editingTaskId
        } else {
          delete editingTasks[payload.clientId]
        }

        const currentEditingTasks = {}

        Object.values(editingTasks).forEach((taskId) => {
          currentEditingTasks[taskId] = true
        })

        if (onChangeCallback) {
          onChangeCallback(currentEditingTasks)
        }
      }
    )
    .subscribe()

  return channel
}

export async function startEditingTask(taskId) {
  if (!channel) return

  await channel.send({
    type: 'broadcast',
    event: 'editing',
    payload: {
      clientId,
      editingTaskId: taskId,
    },
  })
}

export async function stopEditingTask() {
  if (!channel) return

  await channel.send({
    type: 'broadcast',
    event: 'editing',
    payload: {
      clientId,
      editingTaskId: null,
    },
  })
}

export function unsubscribeFromEditingPresence() {
  if (channel) {
    supabase.removeChannel(channel)
    channel = null
    onChangeCallback = null
  }
}