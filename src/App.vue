<script setup lang="ts">
import ROSBridgeConnection from '@/components/ROSBridgeConnection.vue'
import PoseManager from '@/components/PoseManager.vue'
import PoseSequencer from '@/components/PoseSequencer.vue'

import { ref } from 'vue'

/// Connected to ROS bridge
const isConnected = ref(true)

/// Recording of all poses.
const poses = ref<Record<string, string>>({})

/// Ordered pose names.
const sequence = ref<string[]>([])

// TODO: convert to pose type
function addPose(name: string, pose: string) {
  // Ignore on blank name.
  if (name === '') return

  poses
}
function deletePose(name: string) {
  delete poses.value[name]
}
</script>

<template>
  <div class="container mx-auto">
    <Menubar>
      <template #start>
        <h1 class="text-2xl">Lab 13: Programming by Demonstration</h1>
      </template>
    </Menubar>
    <br />
    <ROSBridgeConnection @connected="isConnected = true" @disconnected="isConnected = false" />
    <br />
    <div v-if="isConnected">
      <PoseManager />
      <br />
      <PoseSequencer :sequence="poses" @onDeletePose="deletePose" />
    </div>
  </div>
</template>
