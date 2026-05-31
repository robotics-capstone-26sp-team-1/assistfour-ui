<script setup lang="ts">
</script>

<template>
  <Button v-for="num in 7" :key="num" :label="String(num)" size="large" class="grow h-32" />
</template>