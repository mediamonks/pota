<template>
  <span v-html="logo" />
</template>

<script setup>
const props = defineProps({ name: String });

const logo = (await import(`../../assets/icons/${props.name}.svg`)).default;
</script>

<style scoped lang="scss">
span {
  display: inline-block;
  vertical-align: middle;
}
</style>
