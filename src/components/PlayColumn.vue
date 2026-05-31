<script setup lang="ts">
import { Action, type Ros } from 'roslib'
import {
  createGotoColumnGoal,
  type GotoColumnFeedback,
  type GotoColumnGoal,
  type GotoColumnResult,
} from '@/types/messages.ts'

/// Props.
const { ros } = defineProps<{ ros: Ros }>()
const emit = defineEmits<{
  (e: 'moving', action: Action): void
  (e: 'done'): void
}>()

/// Action client.
const gotoColumnAction = new Action<GotoColumnGoal, GotoColumnFeedback, GotoColumnResult>({
  ros,
  name: '/goto_column',
  actionType: 'assistfour/action/GotoColumn',
})

/// Functions.
function callGotoColumn(column: number) {
  console.log('Goto column', column)
  gotoColumnAction.sendGoal(
    createGotoColumnGoal(column),
    (result: GotoColumnResult) => {
      emit('done')
      if (result.result !== '') {
        console.error('Get Token ended with error: ', result.result)
      }
    },
    (feedback: GotoColumnFeedback) => {
      console.log('Get Token feedback: ', feedback)
    },
  )
  emit('moving', gotoColumnAction)
}
</script>

<template>
  <Button
    v-for="num in 7"
    :key="num"
    :label="String(num)"
    class="grow h-32"
    size="large"
    @click="callGotoColumn(num)"
  />
</template>
