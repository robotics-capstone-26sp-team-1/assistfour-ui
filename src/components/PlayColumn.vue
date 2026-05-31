<script setup lang="ts">
import { Action, type Ros } from 'roslib'
import {
  createPlayColumnGoal,
  type PlayColumnFeedback,
  type PlayColumnGoal,
  type PlayColumnResult,
} from '@/types/messages.ts'

/// Props.
const { ros } = defineProps<{ ros: Ros }>()
const emit = defineEmits<{
  (e: 'moving', action: Action): void
  (e: 'done'): void
}>()

/// Action client.
const playColumnAction = new Action<PlayColumnGoal, PlayColumnFeedback, PlayColumnResult>({
  ros,
  name: '/play_column',
  actionType: 'assistfour/action/PlayColumn',
})

/// Functions.
function callPlayColumn(column: number) {
  console.log('Play column', column)
  playColumnAction.sendGoal(
    createPlayColumnGoal(column),
    (result: PlayColumnResult) => {
      emit('done')
      if (result.result !== '') {
        console.error('Play Column ended with error: ', result.result)
      }
    },
    (feedback: PlayColumnFeedback) => {
      console.log('Play Column feedback: ', feedback)
    },
  )
  emit('moving', playColumnAction)
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
