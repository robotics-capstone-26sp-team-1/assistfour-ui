<script setup lang="ts">
</script>

<template>
  <Panel header="Pose Manager">
    <h3 class="text-lg">Add a Pose</h3>
    <div class="flex gap-4">
      <IftaLabel>
        <InputText id="pose-name"/>
        <label for="pose-name">Pose name</label>
      </IftaLabel>
      <Button label="Save"/>
    </div>
    <br/>
    <h3 class="text-lg">Select a Pose</h3>
    <Listbox filter/>
    <br/>
    <div class="flex gap-4">
      <Button label="Delete Pose" severity="danger"/>
      <Button label="Add to Sequence"/>
    </div>
  </Panel>
</template>