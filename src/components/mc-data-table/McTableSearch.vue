<template>
  <div>
    <div>
      <label for="mc-table-search-key" hidden><span class="w3-text-black">Search</span></label>
      <input class="w3-input mc-bold-label" type="text" id="mc-table-search-key" name="mc-table-search-key"
             placeholder="Enter Search Keywords" v-model="dtSearchKey" @keyup="updateSearchKey">
    </div>
  </div>
</template>

<script>
import { ref, inject } from "vue"

export default {
  name: "McTableSearch",
  setup() {
    const dtSearchKey    = ref("")
    const dtSetSearchKey = inject("setSearchKeyValue")

    // methods: set searchKey
    const updateSearchKey = () => dtSetSearchKey(dtSearchKey.value)

    return {dtSearchKey, updateSearchKey}
  },
}
</script>

<style scoped>

</style>
