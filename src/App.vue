<script setup lang="ts">
import ROSBridgeConnection from '@/components/ROSBridgeConnection.vue'
import PoseManager from '@/components/PoseManager.vue'
import Sequencer from '@/components/Sequencer.vue'
</script>

<template>
  <div class="container mx-auto">
    <Menubar>
      <template #start>
        <h1 class="text-2xl">Lab 13: Programming by Demonstration</h1>
      </template>
    </Menubar>
    <br />
    <ROSBridgeConnection />
    <br />
    <PoseManager />
    <br />
    <Sequencer />
  </div>
</template>
