<script setup lang="ts">
import ROSBridgeConnection from '@/components/ROSBridgeConnection.vue'
import PoseManager from '@/components/PoseManager.vue'
import PoseSequencer from '@/components/PoseSequencer.vue'

import { ref } from 'vue'
import { Ros } from 'roslib'
import type { RosTransformStamped } from '@/types/ros.ts'
import type { NamedLink } from '@/types/messages.ts'

/// ROS instance.
const ros = new Ros()

/// Connected to ROS bridge
const isConnected = ref(true)

/// Recording of all poses.
const poses = ref<Record<string, RosTransformStamped>>({})

/// Ordered pose names.
const sequence = ref<NamedLink[]>([])

function addPose(name: string, pose: RosTransformStamped) {
  poses.value[name] = pose
}
function deletePose(name: string) {
  delete poses.value[name]
}
function addPoseToSequence(pose: NamedLink) {
  sequence.value.push(pose)
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
    <ROSBridgeConnection
      :ros="ros"
      @connected="isConnected = true"
      @disconnected="isConnected = false"
    />
    <br />
    <div v-if="isConnected">
      <PoseManager
        :poses="poses"
        @onPoseSave="addPose"
        @onDeletePose="deletePose"
        @onPoseSent="addPoseToSequence"
      />
      <br />
      <PoseSequencer :sequence="poses" @onDeletePose="deletePose" />
    </div>
  </div>
</template>
