<script setup lang="ts">
import type { Action } from 'roslib'
import {
  createPlayColumnGoal,
  type PlayColumnFeedback,
  type PlayColumnGoal,
  type PlayColumnResult,
} from '@/types/messages.ts'

/// Props: receive action client from App.vue
const props = defineProps<{
  action: Action<PlayColumnGoal, PlayColumnFeedback, PlayColumnResult>
}>()
const emit = defineEmits(['moving', 'done'])

/// Functions.
function callPlayColumn(column: number) {
  console.log('Playing column', column)
  emit('moving')

  try {
    props.action.sendGoal(
      createPlayColumnGoal(column),
      (result: PlayColumnResult) => {
        emit('done')
        if (result.result && result.result !== '') {
          console.error('Play Column ended with error:', result.result)
        }
      },
      (feedback: PlayColumnFeedback) => {
        console.log('Play Column feedback:', feedback)
      },
    )
  } catch (err) {
    console.error('Failed to send PlayColumn goal', err)
    // Ensure UI state is restored if sending the goal fails immediately
    emit('done')
  }
}
</script>

<template>
  <Button
    v-for="num in 7"
    :key="num"
    :label="String(num)"
    class="grow h-32"
    size="large"
    @click="callPlayColumn(num)"
  />
</template>
