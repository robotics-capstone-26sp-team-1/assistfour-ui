<script setup lang="ts">
</script>

<template>
  <Panel header="ROS Bridge Connection">
    <div class="flex gap-4">
      <IftaLabel>
        <InputText id="ros-bridge-ip"/>
        <label for="ros-bridge-ip">IP address</label>
      </IftaLabel>
      <Button label="Connect"/>
    </div>
  </Panel>
</template>