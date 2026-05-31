<script setup lang="ts">
import { Action, type Ros } from 'roslib'
import type { GotoMarkerFeedback, GotoMarkerGoal, GotoMarkerResult } from '@/types/messages.ts'

/// Props.
const { ros } = defineProps<{ ros: Ros }>()
const emit = defineEmits<{
  (e: 'moving', action: Action): void
  (e: 'done'): void
}>()

/// Action client.
const getTokenAction = new Action<GotoMarkerGoal, GotoMarkerFeedback, GotoMarkerResult>({
  ros,
  name: '/get_token',
  actionType: 'assistfour/action/GotoMarker',
})

/// Functions.
function callGetToken() {
  getTokenAction.sendGoal(
    {},
    (result: GotoMarkerResult) => {
      emit('done')
      if (result.result !== '') {
        console.error('Get Token ended with error: ', result.result)
      }
    },
    (feedback: GotoMarkerFeedback) => {
      console.log('Get Token feedback: ', feedback)
    },
  )
  emit('moving', getTokenAction)
}
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
