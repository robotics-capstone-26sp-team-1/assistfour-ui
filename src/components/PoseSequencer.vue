<script setup lang="ts">
import { computed, ref } from 'vue'
import type { GetPoseResponse, NamedLink } from '@/types/messages.ts'

// Props.
const { sequence } = defineProps<{
  poses: Record<string, GetPoseResponse>
  sequence: NamedLink[]
}>()

// State.
const selectedPose = ref<string | undefined>()
const sequenceOptions = computed(() => Object.keys(sequence))

// Events.
const emit = defineEmits<{ (e: 'onDeleteFromSequence', name: string): void }>()

// Functions.
function deletePose() {
  emit('onDeleteFromSequence', selectedPose.value!)
  selectedPose.value = undefined
}
</script>

<template>
  <Panel header="Sequencer">
    <Listbox v-model="selectedPose" :options="sequenceOptions" multiple />
    <br />
    <div class="flex gap-4">
      <Button label="Delete Pose" severity="danger" :disabled="!selectedPose" @click="deletePose" />
      <Button label="Run" />
    </div>
  </Panel>
</template>
