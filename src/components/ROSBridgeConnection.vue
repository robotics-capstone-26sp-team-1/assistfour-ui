<script setup lang="ts">
import { Ros } from 'roslib'
import { ref } from 'vue'

// Connection state.
const { ros } = defineProps<{ ros: Ros }>()
const rosConnected = ref(false)
const rosIp = ref('localhost')
const emit = defineEmits(['connected', 'disconnected'])

// Connection handlers.
ros.on('connection', () => {
  console.log('Connected to ROS bridge!')
  rosConnected.value = true
  emit('connected')
})
ros.on('error', (err) => {
  console.error(`ROS bridge connection error: ${err}`)
  rosConnected.value = false
  emit('disconnected')
})
ros.on('close', () => {
  console.log('ROS bridge connection closed!')
  rosConnected.value = false
  emit('disconnected')
})

// Functions.
function connectToRos() {
  // Ignore if already connected.
  if (rosConnected.value) return

  // Trim URL.
  const trimmedIp = rosIp.value.trim()
  if (trimmedIp === '') {
    return
  }

  const rosUrl = `ws://${trimmedIp}:9090`
  ros.connect(rosUrl)
}

function disconnectFromRos() {
  // Ignore if already disconnected.
  if (!rosConnected.value) return

  // Disconnect.
  ros.close()
}
</script>

<template>
  <Panel header="ROS Bridge Connection">
    <div class="flex gap-4 mb-4">
      <Button label="Slinky" severity="secondary" @click="rosIp = 'slinky.hcrlab.cs.washington.edu'" />
      <Button label="Weird-Stretch" severity="secondary" @click="rosIp = 'weird-stretch.cs.washington.edu'" />
      <Button label="Rocky" severity="secondary" @click="rosIp = 'rocky.hcrlab.cs.washington.edu'" />
    </div>
    <div class="flex gap-4">
      <IftaLabel>
        <InputText id="ros-bridge-ip" v-model="rosIp" />
        <label for="ros-bridge-ip">IP address</label>
      </IftaLabel>
      <Button v-if="rosConnected" label="Disconnect" severity="warn" @click="disconnectFromRos" />
      <Button v-else label="Connect" @click="connectToRos" />
    </div>
  </Panel>
</template>
