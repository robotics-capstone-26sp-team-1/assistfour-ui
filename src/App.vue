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
import VoiceCommandPanel from './components/VoiceCommandPanel.vue'

type VoiceCommand =
  | { type: 'get-token' }
  | { type: 'play-column'; column: number }
  | { type: 'return-to-start' }
  | { type: 'stop' }

const getTokenButton = ref<{ callGetToken: () => void } | null>(null)
const playColumnButton = ref<{ callPlayColumn: (column: number) => void } | null>(null)
const returnToStartButton = ref<{ callReturnToStart: () => void } | null>(null)
const currentActionLabel = ref('none')

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
  currentActionLabel.value = 'none'
}

function startActionInProgress(label: string): void {
  currentActionLabel.value = label
  isActionInProgress.value = true
}

function startColumnAction(column: number): void {
  startActionInProgress(`Column ${column}`)
}

function finishActionInProgress(): void {
  isActionInProgress.value = false
  currentActionLabel.value = 'none'
}

function handleVoiceCommand(command: VoiceCommand): void {
  if (command.type === 'stop') {
    currentActionLabel.value = 'STOP'
    if (isActionInProgress.value) {
      stopActionInProgress()
    }
    return
  }

  if (isActionInProgress.value) {
    return
  }

  if (command.type === 'get-token') {
    currentActionLabel.value = 'Get Token'
    getTokenButton.value?.callGetToken()
    return
  }

  if (command.type === 'play-column') {
    currentActionLabel.value = `Column ${command.column}`
    playColumnButton.value?.callPlayColumn(command.column)
    return
  }

  if (command.type === 'return-to-start') {
    currentActionLabel.value = 'Return to Start'
    returnToStartButton.value?.callReturnToStart()
  }
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
      :is-action-in-progress="isActionInProgress"
      :current-action-label="currentActionLabel"
      @command="handleVoiceCommand"
    />
    <br />
    <Panel header="Game Controls" v-if="isConnected">
      <div class="flex gap-4" v-show="!isActionInProgress">
        <GetToken
          ref="getTokenButton"
          :action="getTokenAction"
          @moving="startActionInProgress('Get Token')"
          @done="finishActionInProgress"
        />
        <div />
        <PlayColumn
          ref="playColumnButton"
          :action="playColumnAction"
          @moving="startColumnAction"
          @done="finishActionInProgress"
        />
        <div />
        <ReturnToStart
          ref="returnToStartButton"
          :action="returnToStartAction"
          @moving="startActionInProgress('Return to Start')"
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
