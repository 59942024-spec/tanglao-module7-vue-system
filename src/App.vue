<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex flex-col">
    <AppHeader />
    <main class="flex-grow"></main>
    <AppFooter />
  </div>
</template>

<style>
html { scroll-behavior: smooth; }
body { margin: 0; }
</style>