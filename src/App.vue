<script setup lang="ts">
import ROSBridgeConnection from '@/components/ROSBridgeConnection.vue'

import { ref } from 'vue'
import { Action, Ros } from 'roslib'
import GetToken from './components/GetToken.vue'
import PlayColumn from './components/PlayColumn.vue'
import ReturnToStart from './components/ReturnToStart.vue'

/// ROS instance.
const ros = new Ros()

/// Connected to ROS bridge.
const isConnected = ref(true)

/// Action in progress.
const actionInProgress = ref<Action>()

/**
 * Set the action in progress.
 * @param action Action to set as being active.
 */
function setActionInProgress(action: Action): void {
  actionInProgress.value = action
}

/**
 * Cancel all goals on the active action.
 */
function stopActionInProgress(): void {
  if (!actionInProgress.value) return

  actionInProgress.value.cancelAllGoals()
  actionInProgress.value = undefined
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
      <div v-if="!actionInProgress" class="flex gap-4">
        <GetToken :ros="ros" @done="actionInProgress = undefined" @moving="setActionInProgress" />
        <div />
        <PlayColumn :ros="ros" @done="actionInProgress = undefined" @moving="setActionInProgress" />
        <div />
        <ReturnToStart
          :ros="ros"
          @done="actionInProgress = undefined"
          @moving="setActionInProgress"
        />
      </div>
      <Button
        v-else
        class="h-32 w-full"
        label="STOP"
        severity="danger"
        @click="stopActionInProgress"
      />
    </Panel>
  </div>
</template>
