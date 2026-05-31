<script setup lang="ts">
import ROSBridgeConnection from '@/components/ROSBridgeConnection.vue'

import { ref } from 'vue'
import { Ros } from 'roslib'
import GetToken from './components/GetToken.vue'
import PlayColumn from './components/PlayColumn.vue'
import ReturnToStart from './components/ReturnToStart.vue'

/// ROS instance.
const ros = new Ros()

/// Connected to ROS bridge.
const isConnected = ref(true)

/// Action in progress.
const isActionInProgress = ref(false)
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
      <div class="flex gap-4" v-if="!isActionInProgress">
        <GetToken />
        <div />
        <PlayColumn />
        <div />
        <ReturnToStart />
      </div>
      <Button label="STOP" severity="danger" class="h-32 w-full" v-else />
    </Panel>
  </div>
</template>
