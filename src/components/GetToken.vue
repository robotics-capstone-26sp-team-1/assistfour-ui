<script setup lang="ts">
import { Action, type Ros } from 'roslib'
import type { GotoMarkerFeedback, GotoMarkerGoal, GotoMarkerResult } from '@/types/messages.ts'

/// Props.
const { ros } = defineProps<{ ros: Ros }>()
const emit = defineEmits(['moving', 'done'])


/// Action client.
const getTokenAction = new Action<GotoMarkerGoal, GotoMarkerFeedback, GotoMarkerResult>({
  ros,
  name: '/get_token',
  actionType: 'assistfour/action/GotoMarker'
})
</script>

<template>
  <Button label="Get Token" size="large" class="h-32" severity="info" />
</template>