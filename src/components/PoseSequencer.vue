<script setup lang="ts">
import { computed, ref } from 'vue'

const { sequence } = defineProps<{
  sequence: Record<string, string>
}>()

const selectedPose = ref<string | undefined>()

defineEmits<{ (e: 'onDeletePose', name: string): void }>()

// State.
const sequenceOptions = computed(() => Object.keys(sequence))
</script>

<template>
  <Panel header="Sequencer">
    <Listbox v-model="selectedPose" :options="sequenceOptions" multiple />
    <br />
    <div class="flex gap-4">
      <Button
        label="Delete Pose"
        severity="danger"
        :disabled="!selectedPose"
        @click="$emit('onDeletePose', selectedPose!)"
      />
      <Button label="Run" />
    </div>
  </Panel>
</template>
