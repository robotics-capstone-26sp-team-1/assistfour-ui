<script setup lang="ts">
import type { Action } from 'roslib'
import { ref } from 'vue'
import {
  createPlayColumnGoal,
  type PlayColumnFeedback,
  type PlayColumnGoal,
  type PlayColumnResult
} from '@/types/messages.ts'

/// Props: receive action client from App.vue
const props = defineProps<{
  action: Action<PlayColumnGoal, PlayColumnFeedback, PlayColumnResult>
  onMoving?: (column: number) => void
  onDone?: () => void
}>()
const buttonRefs = ref<any[]>([])

/// Functions.
function callPlayColumn(column: number) {
  console.log('Playing column', column)
  props.onMoving?.(column)

  try {
    props.action.sendGoal(
      createPlayColumnGoal(column),
      (result: PlayColumnResult) => {
        console.log('Done')
        if (result.result && result.result !== '') {
          console.error('Play Column ended with error:', result.result)
        }
        props.onDone?.()
      },
      (feedback: PlayColumnFeedback) => {
        console.log('Play Column feedback:', feedback)
      }
    )
  } catch (err) {
    console.error('Failed to send PlayColumn goal', err)
    // Ensure UI state is restored if sending the goal fails immediately
    props.onDone?.()
  }
}

function clickPlayColumn(column: number): void {
  buttonRefs.value[column - 1]?.$el?.click()
}

defineExpose({ callPlayColumn, clickPlayColumn })

</script>

<template>
  <Button
    v-for="num in 7"
    :key="num"
    ref="buttonRefs"
    :label="String(num)"
    class="grow h-32"
    size="large"
    @click="callPlayColumn(num)"
  />
</template>
