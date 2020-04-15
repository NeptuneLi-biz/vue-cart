<template>
  <div>
    <nav aria-label="Page navigation">
      <ul class="pagination">
        <li class="page-item"
            :class="{'disabled': !sentPage.has_pre}"
            @click="changePage(sentPage.current_page - 1)">
          <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li class="page-item"
            v-for="(page) in sentPage.total_pages"
            :key="page"
            :class="{'active': page === sentPage.current_page}"
            @click="changePage(page)">
            <a class="page-link" href="#">{{page}}</a>
        </li>
        <li class="page-item"
            :class="{'disabled': !sentPage.has_next}"
            @click="changePage(sentPage.current_page + 1)">
          <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
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
  methods: {
    changePage(page) {
      const vm = this;
      vm.$emit('change-page', page);
    },
  },
};
</script>
