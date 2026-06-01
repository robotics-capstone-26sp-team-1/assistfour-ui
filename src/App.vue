<script setup lang="ts">
import ROSBridgeConnection from '@/components/ROSBridgeConnection.vue'

import { ref } from 'vue'
import { Action, Ros } from 'roslib'
import type {
  GotoMarkerGoal,
  GotoMarkerFeedback,
  GotoMarkerResult,
  PlayColumnFeedback,
  PlayColumnResult,
  PlayColumnGoal
} from './types/messages.ts'
import GetToken from './components/GetToken.vue'
import PlayColumn from './components/PlayColumn.vue'
import ReturnToStart from './components/ReturnToStart.vue'

/// ROS instance.
const ros = new Ros()

/// Connected to ROS bridge.
const isConnected = ref(false)

/// Action clients.
const getTokenAction = new Action<GotoMarkerGoal, GotoMarkerFeedback, GotoMarkerResult>({
  ros,
  name: '/get_token',
  actionType: 'assistfour_interfaces/action/GotoMarker'
})
const playColumnAction = new Action<PlayColumnGoal, PlayColumnFeedback, PlayColumnResult>({
  ros,
  name: '/play_column',
  actionType: 'assistfour_interfaces/action/PlayColumn'
})
const returnToStartAction = new Action<GotoMarkerGoal, GotoMarkerFeedback, GotoMarkerResult>({
  ros,
  name: '/return_to_start',
  actionType: 'assistfour_interfaces/action/GotoMarker'
})

/// Action in progress flag.
const isActionInProgress = ref(false)

/**
 * Cancel all goals on the action clients.
 */
function stopActionInProgress(): void {
  try {
    getTokenAction.cancelAllGoals()
  } catch (err) {
    console.error('Failed to cancel goals on getTokenAction:', err)
  }
  try {
    playColumnAction.cancelAllGoals()
  } catch (err) {
    console.error('Failed to cancel goals on playColumnAction:', err)
  }
  try {
    returnToStartAction.cancelAllGoals()
  } catch (err) {
    console.error('Failed to cancel goals on returnToStartAction:', err)
  }
  isActionInProgress.value = false
}
</script>

<template>
  <div class="container mx-auto">
    <Menubar>
      <template #start>
        <h1 class="text-2xl">AssistFour</h1>
      </template>
    </Menubar>
    <br />
    <ROSBridgeConnection
      :ros="ros"
      @connected="isConnected = true"
      @disconnected="isConnected = false"
    />
    <br />
    <Panel header="Game Controls" v-if="isConnected">
      <div class="flex gap-4" v-show="!isActionInProgress">
        <GetToken
          :action="getTokenAction"
          @moving="isActionInProgress = true"
          @done="isActionInProgress = false"
        />
        <div />
        <PlayColumn
          :action="playColumnAction"
          @moving="isActionInProgress = true"
          @done="isActionInProgress = false"
        />
        <div />
        <ReturnToStart
          :action="returnToStartAction"
          @moving="isActionInProgress = true"
          @done="isActionInProgress = false"
        />
      </div>
      <Button
        v-if="isActionInProgress"
        class="h-32 w-full"
        label="STOP"
        severity="danger"
        @click="stopActionInProgress"
      />
    </Panel>
  </div>
</template>
