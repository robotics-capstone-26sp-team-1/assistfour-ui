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


const getTokenButton = ref<{ clickGetToken: () => void } | null>(null)
const playColumnButton = ref<{ clickPlayColumn: (column: number) => void } | null>(null)
const returnToStartButton = ref<{ clickReturnToStart: () => void } | null>(null)

/// ROS instance.
const ros = new Ros()

/// Connected to ROS bridge.
const isConnected = ref(true)

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

function startActionInProgress(): void {
  isActionInProgress.value = true
}

function startColumnAction(column: number): void {
  isActionInProgress.value = true
}

function triggerGetToken(): void {
  getTokenButton.value?.clickGetToken()
}

function triggerPlayColumn(column: number): void {
  playColumnButton.value?.clickPlayColumn(column)
}

function triggerReturnToStart(): void {
  returnToStartButton.value?.clickReturnToStart()
}

function finishActionInProgress(): void {
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
    <VoiceCommandPanel
      v-if="isConnected"
      :is-action-in-progress="isActionInProgress"
      @stop="stopActionInProgress"
      @get-token="triggerGetToken"
      @play-column="triggerPlayColumn"
      @return-to-start="triggerReturnToStart"
    />
    <br v-if="isConnected" />
    <Panel header="Game Controls" v-if="isConnected">
      <div class="flex gap-4" v-show="!isActionInProgress">
        <GetToken
          ref="getTokenButton"
          :action="getTokenAction"
          @moving="startActionInProgress"
          @done="finishActionInProgress"
        />
        <div />
        <PlayColumn
          ref="playColumnButton"
          :action="playColumnAction"
          :on-moving="startColumnAction"
          :on-done="finishActionInProgress"
        />
        <div />
        <ReturnToStart
          ref="returnToStartButton"
          :action="returnToStartAction"
          @moving="startActionInProgress"
          @done="finishActionInProgress"
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
