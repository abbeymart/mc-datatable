<template>
  <div>
    <div v-if="tableFields.length && tableItems.length">
      <table :class="dtTableStyle.table" id="mc-table-content">
        <thead id="mc-table-header" :class="dtTableStyle.tableHeader">
        <tr>
          <th scope="col" v-for="field in tableFields" @click.prevent="sortDataByField(field)"
              :key="field.name" class="mc-tool-cursor">
            <span class="w3-left-align">{{ field.label }} </span>
            <span v-if="field.sort" class="w3-right-align"><i :class="sortStyleAsc"> </i> <i
                :class="sortStyleDesc"/>
            </span>
          </th>
        </tr>
        </thead>
        <tbody id="mc-table-body" :class="dtTableStyle.tableBody">
        <tr v-for="item in tableRecords" :key="item._id">
          <td v-for="fieldItem in item.fieldsInfo" :key="fieldItem.fieldName + item._id">
            <input v-if="fieldItem.fieldType === 'checkbox'" type="checkbox" class="w3-check"
                   :value="item._id" v-model="itemsIds"
                   @change="fieldItem.fieldTask(itemsIds)">
            <update v-else-if="fieldItem.fieldType === 'custom'"
                    :item-task="fieldItem.fieldTask" :item-label="fieldItem.fieldLabel" :item-data="item"/>
            <update v-else-if="fieldItem.fieldType === 'taskLink' && (fieldItem.fieldLabel === 'Update')"
                    :item-task="fieldItem.fieldTask" :item-label="fieldItem.fieldLabel" :item-data="item"/>
            <delete v-else-if="fieldItem.fieldType === 'taskLink' && fieldItem.fieldLabel === 'Delete'"
                    :item-task="fieldItem.fieldTask" :item-label="fieldItem.fieldLabel" :item-id="item._id"/>
            <span v-else-if="fieldItem.fieldSource.domComp" v-html="fieldItem.fieldValue"/>
            <span v-else v-on="eventHandler(item, fieldItem.fieldEvents)">
              {{ fieldItem.fieldValue }}
            </span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <mc-table-no-data/>
    </div>
  </div>
</template>

<script>
import McTableNoData from "./McTableNoData";
import Update from "./templates/Update";
import Delete from "./templates/Delete";
import { sortBy } from "lodash"; // TODO: extract/use sortBy as standalone function
import { ref, inject, computed } from "vue"

export default {
  name      : "McTable",
  data() {
    return {
      itemsIds: [],
    }
  },
  setup() {
    const sortAsc  = ref(false)
    const sortDesc = ref(false)

    const dtDataItems       = inject("dataItems")
    const dtDataFields      = inject("dataFields")
    const dtPageLimit       = inject("pageLimit")
    const dtCurrentPage     = inject("currentPage")
    const dtTableStyle      = inject("tableStyle")
    const dtSortStyle       = inject("sortStyle")
    const dtSearchKey       = inject("searchKey")
    const dtSetDataItems    = inject("setDataItemsValue")
    const dtSetDataTotal    = inject("setDataItemsTotal")
    const dtPermittedEvents = inject("permittedEvents")

    // methods
    const updateDataItemsStore = (val) => dtSetDataItems(val)
    const updateDataTotal      = (val) => dtSetDataTotal(val)
    const sortDataByField      = (field = {}) => {
      field = {...field};
      // toggle sort order, for dataItems
      if (field.sort) {
        if (sortAsc.value) {
          // sort in descending order
          const dItems = sortBy(dtDataItems, [field.name]).reverse();
          updateDataItemsStore(dItems)
          // updateDataItemsStore(dItems)
          sortAsc.value  = false;
          sortDesc.value = true;
        } else {
          // sort in ascending order
          const dItems = sortBy(dtDataItems, [field.name]);
          updateDataItemsStore(dItems)
          // updateDataItemsStore(dItems)
          sortAsc.value  = true;
          sortDesc.value = false;
        }
      }
    }

    // computed values
    const tableFields       = computed(() => sortBy(dtDataFields, ["order"]))
    const dataItemsStore    = computed(() => {
      return dtDataItems
    })
    const computedDataItems = computed(() => {
      // transform data-items for complete table-items search
      const dItems = dtDataItems.value ? dtDataItems.value : dataItemsStore.value
      return dItems.map(item => {
        // clone the item
        const itemData = Object.assign({}, item);
        tableFields.value.forEach(field => {
          if (field.source.type && field.source.type === "provider") {
            if (field.source.params) {
              let fieldParams;
              const fieldSourceParams = field.source.params;
              if (fieldSourceParams && Array.isArray(fieldSourceParams) && fieldSourceParams.length > 0) {
                if (fieldSourceParams.includes("all") || fieldSourceParams.includes("item")) {
                  fieldParams = item;
                } else {
                  fieldParams = fieldSourceParams.map(param => item[param]).join(", ");
                }
              }
              if (field.source.transform && typeof field.source.transform === "function") {
                itemData[field.name] = field.source.transform(fieldParams);
              }
            } else if (field.source.transform && typeof field.source.transform === "function") {
              itemData[field.name] = field.source.transform(itemData[field.name]);
            }
          }
        });
        return itemData;
      });
    })
    const itemsTotal        = computed(() => computedDataItems.value.length)
    // extract/get value from Proxy object
    const sortStyleCopy     = {...dtSortStyle}
    const sortStyleAsc      = computed(() => sortAsc.value ? `${sortStyleCopy.asc} mc-table-sort-style` : `${sortStyleCopy.asc}`)
    const sortStyleDesc     = computed(() => sortDesc.value ? `${sortStyleCopy.desc} mc-table-sort-style` : `${sortStyleCopy.desc}`)
    const dataItemsSearch   = computed(() => {
      // search data-items by search-key: from tableFields => Proxy[Proxy...] array-of-proxy-objects
      const dataItemKeys = [...tableFields.value].map(item => ({...item}).name);
      // filter the dataItems, by the data-item-keys
      return computedDataItems.value.filter(item => dataItemKeys.some(key => {
            return item[key] ? item[key].toString().toLowerCase().includes(dtSearchKey.value.toString().toLowerCase()) : false;
          }
      ));
    })
    const tableItems        = computed(() => {
      // determine tableData for the currentPage by pageLimit
      let tableData  = [];
      // scenarios for calculating tableData for the currentPage  >> mcTableBody
      const dataSize = dataItemsSearch.value.length;
      // 1. if dataSize <= pageLimit: display all items for the currentPage(1)
      if (dataSize <= dtPageLimit.value) {
        tableData = dataItemsSearch.value;
      }
      // update dataTotal store-value
      updateDataTotal(dataSize)
      // this.$store.dispatch("mcDataTable/setDataTotal", dataSize);
      // 2. if dataSize > pageLimit:
      if (dataSize > dtPageLimit.value) {
        // currentPage === 1
        if (dtCurrentPage.value === 1) {
          // slice records from the start of currentPage up to pageLimit
          tableData = dataItemsSearch.value.slice(0, dtPageLimit.value)
        }
        // dataSize is less than the total records up to the end of the currentPage
        else if (dataSize <= dtCurrentPage.value * dtPageLimit.value) {
          // slice records from the start of the currentPage to end of dataItems
          tableData = dataItemsSearch.value.slice(((dtCurrentPage.value - 1) * dtPageLimit.value));
        } else {
          // slice records from the start of the currentPage to end of currentPage
          tableData = dataItemsSearch.value.slice(((dtCurrentPage.value - 1) * dtPageLimit.value), (dtCurrentPage.value * dtPageLimit.value));
        }
      }
      return tableData;
    })
    const tableRecords      = computed(() => {
      try {
        // transform table-items, by data-fields
        return tableItems.value.map(item => {
          // clone the item/record
          const itemData          = Object.assign({}, item);
          // include / initialise the itemData fieldsInfo
          itemData ["fieldsInfo"] = [];
          // sort by table-field order
          tableFields.value.forEach((field) => {
            // compose the table field/column
            // column/field value
            const fieldSource = field.source,
                  fieldName   = field.name,
                  fieldType   = field.source.type,
                  fieldLabel  = field["label"];
            let fieldTask     = "",
                fieldParams   = "",
                fieldValue    = "N/A";

            if (fieldType === "provider") {
              // field-value already transformed from dataItems computed values
              fieldValue = item[fieldName];
            } else {
              fieldTask               = field.source.task ? field.source.task : "";
              const fieldSourceParams = field.source.params;
              if (fieldSourceParams && Array.isArray(fieldSourceParams) && fieldSourceParams.length > 0) {
                if (fieldSourceParams.includes("all") || fieldSourceParams.includes("item")) {
                  fieldParams = item;
                } else {
                  fieldParams = fieldSourceParams.map(param => item[param]).join(", ");
                }
              }
            }

            itemData ["fieldsInfo"].push({
              fieldValue : fieldValue,
              fieldSource: fieldSource,
              fieldType  : fieldType,
              fieldName  : fieldName,
              fieldTask  : fieldTask,
              fieldParams: fieldParams,
              fieldLabel : fieldLabel,
              fieldEvents: field.events ? field.events : [],
            });
          });

          return itemData;
        });
      } catch (e) {
        console.log("error rendering table: ", e.message);
        return [];
      }
    })
    // permitted events handler for item/record-fields
    const eventHandler      = (item, fieldEvents) => {
      if (fieldEvents && fieldEvents.length > 0) {
        let fieldParams;
        for (const ev of fieldEvents) {
          // check permitted events
          if (dtPermittedEvents.includes(ev.type)) {
            // params
            if (ev.params && Array.isArray(ev.params) && ev.params.length > 0) {
              if (ev.params.includes("all") || ev.params.includes("item")) {
                fieldParams = item
              } else {
                fieldParams = ev.params.map(param => item[param]).join(", ");
              }
            }
            if (ev.task) {
              ev.task(fieldParams);
            }
          }
        }
      }
    }

    return {
      sortAsc, sortDesc, tableFields, dataItemsStore,
      computedDataItems, itemsTotal, sortStyleAsc, sortStyleDesc, dataItemsSearch,
      tableItems, tableRecords, dtTableStyle, dtSortStyle, dtPageLimit,
      dtCurrentPage, sortDataByField, eventHandler,
    }
  },
  components: {
    McTableNoData,
    Update,
    Delete,
  },
}
</script>

<style scoped>
.mc-table-sort-style {
  font-weight: bolder;
  background-color: #0D47A1;
}

</style>
