<script setup lang="ts">
import ROSBridgeConnection from '@/components/ROSBridgeConnection.vue'

import { ref } from 'vue'
import { Ros } from 'roslib'

/// ROS instance.
const ros = new Ros()

/// Connected to ROS bridge
const isConnected = ref(false)
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
    </div>
  </div>
</template>
