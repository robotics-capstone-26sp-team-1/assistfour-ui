<script setup lang="ts">
import { Action, type Ros } from 'roslib'
import type { GotoMarkerFeedback, GotoMarkerGoal, GotoMarkerResult } from '@/types/messages.ts'

/// Props.
const { ros } = defineProps<{ ros: Ros }>()
const emit = defineEmits(['moving', 'done'])

/// Action client.
const returnToStartAction = new Action<GotoMarkerGoal, GotoMarkerFeedback, GotoMarkerResult>({
  ros,
  name: '/return_to_start',
  actionType: 'assistfour/action/GotoMarker',
})

/// Functions.
function callReturnToStart() {
  returnToStartAction.sendGoal(
    {},
    (result: GotoMarkerResult) => {
      emit('done')
      if (result.result !== '') {
        console.error('Returning to Start ended with error: ', result.result)
      }
    },
    (feedback: GotoMarkerFeedback) => {
      console.log('Return to Start feedback: ', feedback)
    },
  )
  emit('moving')
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
