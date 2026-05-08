<script setup lang="ts"></script>

<template>
  <article class="page-stub">
    <h1 class="page-stub__title">For Advertisers</h1>
    <p class="page-stub__text">Page is being rebuilt from Figma.</p>
  </article>
</template>

<style scoped lang="scss">
.page-stub {
  min-height: calc(100vh - var(--header-offset));
  padding: var(--header-offset) 16px 96px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background-color: var(--color-bg-page);
  color: var(--color-text-primary);
  text-align: center;
}

.page-stub__title {
  margin: 0;
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: clamp(2rem, 4vw + 1rem, 4rem);
  line-height: 1.1;
  letter-spacing: -0.01em;
}

.page-stub__text {
  margin: 0;
  font-family: var(--font-sans);
  font-size: 1rem;
  color: var(--color-text-tertiary);
}
</style>
