<template>
  <div>
    <!-- <nav aria-label="Page navigation">
      <ul class="pagination">
        <li class="page-item"
            :class="{'disabled': !newPages.has_pre}"
            @click="getProducts(newPages.current_page - 1)">
          <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li class="page-item"
            v-for="(page) in newPages.total_pages"
            :key="page"
            :class="{'active': page === newPages.current_page}"
            @click="getProducts(page)">
            <a class="page-link" href="#">{{page}}</a>
        </li>
        <li class="page-item"
            :class="{'disabled': !newPages.has_next}"
            @click="getProducts(newPages.current_page + 1)">
          <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav> -->
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    sentPage: {
      type: Object,
    },
  },
  data() {
    return {
      newPages: Object.assign({}, this.sentPage),
      // newPages: { ttts: 'a' },
      // newPages: {},
      // test: this.sentPage.total_pages,
    };
  },
};
</script>
