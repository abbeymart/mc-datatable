<template>
  <div>
    <div v-if="recordTotal > 0 && dataFieldsCount > 0 && dataItemsCount > 0" class="w3-container">
      <div class="w3-row-padding">
        <div class="w3-half w3-left">
          <mc-page-limit id="mc-page-limit"></mc-page-limit>
        </div>
        <div class="w3-half w3-right">
          <mc-table-search id="mc-table-search"></mc-table-search>
        </div>
      </div>
      <div class="w3-panel">
        <mc-table id="mc-table"></mc-table>
      </div>
      <div class="w3-row-padding">
        <div class="w3-half w3-left">
          <mc-table-message id="mc-table-message"></mc-table-message>
        </div>
        <div class="w3-half w3-right">
          <mc-page-nav id="mc-page-nav"></mc-page-nav>
        </div>
      </div>
    </div>
    <div v-else>
      <mc-table-no-data></mc-table-no-data>
    </div>
  </div>
</template>

<script>
// sub-components
import McPageLimit from "./McPageLimit";
import McTableSearch from "./McTableSearch";
import McTable from "./McTable";
import McTableMessage from "./McTableMessage";
import McPageNav from "./McPageNav";
import McTableNoData from "./McTableNoData";

import { computed, provide, ref, reactive } from "vue"

export default {
  name      : "McDataTable",
  props     : {
    dataFields     : {
      type    : Array,
      required: true,
    },
    dataItems      : {
      type    : Array,
      required: true
    },
    dataTotal      : {
      type   : Number,
      default: 0,
    },
    paging         : {
      type   : Boolean,
      default: true,
    },
    pageStart      : {
      type   : Number,
      default: 1,
    },
    pageLimits     : {
      type   : Array,
      default: () => [10, 20, 30, 50, 100, 200],
    },
    tableStyle     : {
      type   : Object,
      default: () => {
        return {
          table      : "w3-table w3-striped w3-border w3-bordered w3-hoverable",
          tableHeader: "w3-red",
          tableBody  : "w3-hover",
        }
      },
    },
    sortStyle      : {
      type   : Object,
      default: () => {
        return {
          asc : "fa fa-caret-up",
          desc: "fa fa-caret-down",
        }
      },
    },
    permittedEvents: {
      type   : Array,
      default: () => ["click", "mouseover", "mouseleave", "mouseenter"],
    },
  },
  setup(props) {
    // reactive params for datatable (previous vuex-stored values)
    const tableStyle       = reactive(props.tableStyle)
    const sortStyle        = reactive(props.sortStyle)
    const dataFields       = reactive(props.dataFields)
    const dataItems        = reactive(props.dataItems)
    const paging           = ref(props.paging)
    const pageStart        = ref(props.pageStart)
    const pageLimit        = ref(10)
    const currentPage      = ref(1)
    const searchKey        = ref("")
    const dataCount        = ref(0)
    const dataTotal        = ref(props.dataTotal)
    const initialDataTotal = ref(0)
    const pageLimits       = reactive(props.pageLimits)
    const permittedEvents  = reactive(props.permittedEvents)

    // instance computed values, methods, lifecycles etc. | dataCount => dataItemsCount
    const dataItemsCount  = computed(() => dataItems.length)
    const recordTotal     = computed(() => dataTotal.value ? dataTotal.value : dataItemsCount.value)
    const dataFieldsCount = computed(() => dataFields.length)

    const setPageLimit = (val) => {
      pageLimit.value = val
    }

    const setSearchKeyValue = (val) => {
      searchKey.value = val
    }

    const setCurrentPage = (val) => {
      currentPage.value = val
    }

    const setDataItemsValue = (val) => {
      dataItems.value = val.map(item => ({...item}))
      // console.log('set-data-items: ', dataItems, dataItems.value)
    }

    const setDataItemsTotal = (val) => {
      dataTotal.value = val
    }

    // publish (provide) values, computed values, methods/mutable-methods
    provide("tableStyle", tableStyle)
    provide("sortStyle", sortStyle)
    provide("dataFields", dataFields)
    provide("dataItems", dataItems)
    provide("paging", paging)
    provide("pageStart", pageStart)
    provide("currentPage", currentPage)
    provide("searchKey", searchKey)
    provide("dataCount", dataCount)
    provide("dataTotal", dataTotal)
    provide("pageLimit", pageLimit)
    provide("pageLimits", pageLimits)
    provide("permittedEvents", permittedEvents)
    provide("initialDataTotal", initialDataTotal)

    // computed values
    provide("dataItemsCount", dataItemsCount)
    provide("recordTotal", recordTotal)

    // mutable methods
    provide("setPageLimit", setPageLimit)
    provide("setSearchKeyValue", setSearchKeyValue)
    provide("setCurrentPage", setCurrentPage)
    provide("setDataItemsValue", setDataItemsValue)
    provide("setDataItemsTotal", setDataItemsTotal)

    // return/expose component instance params
    return {dataFieldsCount, dataItemsCount, recordTotal}

  },
  components: {
    McTableNoData,
    McPageLimit,
    McTableSearch,
    McTable,
    McTableMessage,
    McPageNav,
  },
}
</script>

<style scoped>

</style>
