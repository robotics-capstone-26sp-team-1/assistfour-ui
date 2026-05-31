<script setup lang="ts">
import type { Action } from 'roslib'
import {
  createGotoMarkerGoal,
  type GotoMarkerFeedback,
  type GotoMarkerGoal,
  type GotoMarkerResult,
} from '@/types/messages.ts'

/// Props: receive action client from App.vue
const props = defineProps<{
  action: Action<GotoMarkerGoal, GotoMarkerFeedback, GotoMarkerResult>
}>()
const emit = defineEmits(['moving', 'done'])

/// Functions.
function callReturnToStart() {
  console.log('Returning to Start...')
  emit('moving')

  try {
    props.action.sendGoal(
      createGotoMarkerGoal(),
      (result: GotoMarkerResult) => {
        emit('done')
        if (result.result && result.result !== '') {
          console.error('Returning to Start ended with error:', result.result)
        }
      },
      (feedback: GotoMarkerFeedback) => {
        console.log('Return to Start feedback:', feedback)
      },
    )
  } catch (err) {
    console.error('Failed to send ReturnToStart goal', err)
    // Ensure UI state is restored if sending the goal fails immediately
    emit('done')
  }
}
</script>

<template>
  <Button
    class="h-32"
    icon="pi pi-home"
    label="Return to Start"
    severity="warn"
    size="large"
    @click="callReturnToStart"
  />
</template>
