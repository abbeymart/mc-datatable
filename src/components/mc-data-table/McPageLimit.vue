<template>
  <div>
    <div>
      <label for="mc-page-limit-value" disabled></label>
      <span>Show </span>
      <select id="mc-page-limit-value" name="mc-page-limit-value" class="w3-round"
              v-model="pageLimit" @change="updatePageLimit">
        <option v-for="(item, index) in dtPageLimits" :value="item" :key="index">
          {{ item }}
        </option>
      </select>
      <span> items</span>
    </div>
  </div>
</template>

<script>
import { inject, ref } from "vue"

export default {
  name: "McPageLimit",
  setup() {
    const pageLimit      = ref(10)
    const dtPageLimits   = inject("pageLimits", [10, 20, 30, 50, 100, 200])
    const dtSetPageLimit = inject("setPageLimit")

    // update pageLimit
    const updatePageLimit = () => dtSetPageLimit(pageLimit.value)

    return {pageLimit, dtPageLimits, updatePageLimit}

  },
}
</script>

<style scoped>

</style>
