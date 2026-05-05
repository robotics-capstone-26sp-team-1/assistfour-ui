<script setup lang="ts">
import { computed, ref } from 'vue'

const frames = [
  { name: 'Robot', frame: 'base_link' },
  { name: 'World', frame: 'odom' },
  { name: 'AruCo', frame: 'column_4' },
]

// State.
const poses = ref<Record<string, string[]>>({})
const poseOptions = computed(() => Object.keys(poses.value))
const poseName = ref('')
const selectedPose = ref<string | undefined>()
const selectedFrame = ref('base_link')
const emit = defineEmits<{ (e: 'poseSent', name: string, frame: string): void }>()

// Functions.
function addPose() {
  // Ignore on blank name.
  if (poseName.value === '') return

  poses.value[poseName.value] = []
}
function deletePose() {
  delete poses.value[selectedPose.value!]
  selectedPose.value = undefined
}
function sendPose() {
  emit('poseSent', selectedPose.value!, selectedFrame.value)
}
</script>

<template>
  <Panel header="Pose Manager">
    <h3 class="text-lg">Add a Pose</h3>
    <div class="flex gap-4">
      <IftaLabel>
        <InputText id="pose-name" v-model="poseName" />
        <label for="pose-name">Pose name</label>
      </IftaLabel>
      <Button label="Save" @click="addPose" />
    </div>
    <br />
    <h3 class="text-lg">Select a Pose</h3>
    <Listbox v-model="selectedPose" :options="poseOptions" filter />
    <br />
    <Button
      label="Delete Pose"
      severity="danger"
      :disabled="!selectedPose"
      @click="deletePose"
    />
    <br />
    <br />
    <div class="flex gap-4">
      <Select v-model="selectedFrame" :options="frames" optionLabel="name" optionValue="frame" />
      <Button label="Add to Sequence" :disabled="!selectedPose" @click="sendPose" />
    </div>
  </Panel>
</template>
