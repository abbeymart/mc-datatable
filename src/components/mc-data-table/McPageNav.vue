<template>
  <div>
    <div class="w3-bar" id="mcPageNav">
      <span></span>
      <a href="#" v-if="dtCurrentPage > 1 && lastPage > 1" class="w3-button w3-border w3-round-medium w3-hover-blue"
         id="mc-page-nav-first" @click.prevent="pageNavFirst">First</a>
      <a href="#" v-if="dtCurrentPage > 1" class="w3-button w3-border w3-round-medium w3-hover-blue"
         id="mc-page-nav-previous"
         @click.prevent="pageNavPrevious">&laquo;Previous</a>
      <a href="#" class="w3-button w3-border w3-round-medium w3-hover-blue" v-for="page in pageList" :key="page"
         @click.prevent="pageNavNumber(page)">
        <span v-if="dtCurrentPage.toString() === page" class="mc-current-page">{{ page }}</span>
        <span v-else>{{ page }}</span>
      </a>
      <a href="#" v-if="dtCurrentPage < lastPage && lastPage > 1"
         class="w3-button w3-border w3-round-medium w3-hover-blue"
         id="mc-page-nav-next" @click.prevent="pageNavNext">Next&raquo;</a>
      <a href="#" v-if="dtCurrentPage < lastPage" class="w3-button w3-border w3-round-medium w3-hover-blue"
         id="mc-page-nav-last" @click.prevent="pageNavLast">Last</a>
    </div>
  </div>
</template>

<script>

import { ref, inject, computed } from "vue"

export default {
  name: "McPageNav",
  setup() {
    const pagePosition     = ref("")
    const dtDataTotal      = inject("dataTotal", 0)
    const dtPageLimit      = inject("pageLimit", 10)
    const dtCurrentPage    = inject("currentPage", 1)
    const dtSetCurrentPage = inject("setCurrentPage")

    // computed values
    const lastPage = computed(() => Math.ceil(dtDataTotal.value) / dtPageLimit.value)
    const pageList = computed(() => {
      let lastPage = 1;
      if (dtDataTotal.value > dtPageLimit.value) {
        lastPage = Math.ceil(dtDataTotal.value / dtPageLimit.value);
      }

      // pageNav scenarios
      // [First][Previous]...pages...[Next][Last]
      // show all pages, if lastPage <= 7 : i.e. 1...lastPage
      // render pages: show first(1) and last(30) pages, show first five pages if currentPage: 1 2 3 4
      // for currentPage: 5 to lastPage-4, i.e. 1 ... three pages from currentPage ... 30
      // show 1 ... 5 6 7 ... 30
      // for currentPage: lastPage-4, -3, -2, -1, lastPage
      // show: 1 ... 26 27 28 29 30
      let pageList = [];
      if (lastPage <= 7) {
        let i = 1;
        while (i <= lastPage) {
          pageList.push(i.toString());
          i++;
        }
      }
      if (lastPage > 7) {
        if ([1, 2, 3, 4].includes(dtCurrentPage.value)) {
          pageList = ["1", "2", "3", "4", "5", "....", lastPage.toString()];
        } else if (dtCurrentPage.value > 4 && dtCurrentPage.value < lastPage - 3) {
          pageList = ["1", "....", (dtCurrentPage.value - 1).toString(), (dtCurrentPage.value).toString(), (dtCurrentPage.value + 1).toString(), "...", lastPage.toString()];
        } else if (dtCurrentPage.value >= lastPage - 4) {
          pageList = ["1", "....", (lastPage - 4).toString(), (lastPage - 3).toString(), (lastPage - 2).toString(), (lastPage - 1).toString(), lastPage.toString()];
        }
      }
      return pageList;
    })

    // methods
    const setCurrentPage      = (val) => dtSetCurrentPage(val)
    const pageNavFirst    = () => {
      pagePosition.value = "first-page"
      setCurrentPage(1)
    }
    const pageNavPrevious = () => {
      pagePosition.value = "previous-page"
      setCurrentPage(dtCurrentPage.value - 1)
    }
    const pageNavNext     = () => {
      pagePosition.value = "next-page"
      setCurrentPage(dtCurrentPage.value + 1)
    }
    const pageNavLast     = () => {
      pagePosition.value = "last-page"
      setCurrentPage(Math.ceil(dtDataTotal.value / dtPageLimit.value))
    }
    const pageNavNumber   = (page) => {
      pagePosition.value = "page-number";
      setCurrentPage(parseInt(page));
    }

    // expose instance params
    return {
      dtCurrentPage, lastPage, pageList, pageNavFirst, pageNavPrevious, pageNavNext, pageNavLast, pageNavNumber,
    }
  },
}
</script>

<style scoped>
#mcPageNav a {
  color: #0D47A1;
}

#mcPageNav a:hover {
  font-weight: bolder;
  background-color: #0D47A1;
}

#mcPageNav a:active {
  font-weight: bolder;
  background-color: #0c5460;
}

.mc-current-page {
  font-weight: bolder;
  text-decoration: underline;
}
</style>
