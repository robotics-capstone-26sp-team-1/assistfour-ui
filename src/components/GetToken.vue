<script setup lang="ts">
import type { Action } from 'roslib'
import {
  createGotoMarkerGoal,
  type GotoMarkerFeedback,
  type GotoMarkerGoal,
  type GotoMarkerResult
} from '@/types/messages.ts'

/// Props: receive action client from App.vue
const props = defineProps<{
  action: Action<GotoMarkerGoal, GotoMarkerFeedback, GotoMarkerResult>
}>()
const emit = defineEmits(['moving', 'done'])

/// Functions.
function callGetToken() {
  console.log('Getting token...')
  emit('moving')

  try {
    props.action.sendGoal(
      createGotoMarkerGoal(),
      (result: GotoMarkerResult) => {
        console.log('Done')
        if (result.result && result.result !== '') {
          console.error('Get Token ended with error: ', result.result)
        }

        // Revert UI.
        emit('done')
      },
      (feedback: GotoMarkerFeedback) => {
        console.log('Get Token feedback: ', feedback)
      }
    )
  } catch (err) {
    console.error('Failed to send GetToken goal', err)
  }
}

defineExpose({ callGetToken })
</script>

<template>
  <Button
    label="Get Token"
    icon="pi pi-cart-plus"
    size="large"
    class="h-32"
    severity="info"
    @click="callGetToken"
  />
</template>
