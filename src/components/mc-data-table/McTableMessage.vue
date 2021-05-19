<template>
  <div>
    <div class="w3-bar">
      <div v-if="itemFrom > 0 && itemTo >= itemFrom && dtDataTotal >= itemTo">
        <span class="w3-text-black">Showing {{ itemFrom }} to {{ itemTo }} of {{ dtDataTotal }} entries </span>
        <span v-if="dtDataTotal < dtInitialDataTotal"> (filtered from {{ dtInitialDataTotal }} total entries) </span>
        <span class="w3-blue"><strong>[ Page {{ dtCurrentPage }} ]</strong></span>
      </div>
      <div v-else>
        <span class="w3-text-black">Page (from/to) information missing</span>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, inject } from "vue"

export default {
  name: "McTableMessage",
  setup() {
    const dtInitialDataTotal = inject("initialDataTotal", 0)
    const dtDataTotal        = inject("dataTotal", 0)
    const dtPageLimit        = inject("pageLimit", 10)
    const dtCurrentPage      = inject("currentPage", 1)

    // compute per page itemFrom and itemTo records/items
    const itemFrom = computed(() => dtPageLimit.value * (dtCurrentPage.value - 1) + 1)
    const itemTo   = computed(() => {
      if (dtDataTotal.value < dtPageLimit.value * dtCurrentPage.value) {
        return dtDataTotal.value
      }
      return dtPageLimit.value * dtCurrentPage.value
    })
    return {dtInitialDataTotal, dtDataTotal, dtCurrentPage, itemFrom, itemTo}
  },
}
</script>

<style scoped>

</style>
