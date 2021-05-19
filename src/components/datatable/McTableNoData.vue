<template>
  <div>
    <div v-if="dtDataItemsCount < 1" class="w3-container w3-yellow">
      <h4>... Loading or No data available / Ensure that you're logged in ...</h4>
    </div>
    <div v-else>
      <h4>... Loading or Unable to process data / Ensure that you're logged in ...</h4>
    </div>
  </div>
</template>

<script>
import { inject } from "vue"

export default {
  name: "McTableNoData",
  setup() {
    const dtDataItemsCount = inject("dataItemsCount", 0)

    return {dtDataItemsCount}
  },
}
</script>

<style scoped>

</style>
