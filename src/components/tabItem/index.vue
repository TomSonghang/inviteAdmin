<template>
  <ul class="tabTop">
    <li
      v-for="(item, index) in liItem"
      :key="item.id"
      @click="handleChange(index, item.id)"
      :class="index == checkActive ? 'active' : ''"
    >{{ item.name }}</li>
  </ul>
</template>
<script>
export default {
  data: function () {
    return {
      checkActive: this.active
    }
  },
  props: {
    liItem: {
      type: Array,
      default: () => {
        return []
      }
    },
    active: {
      type: Number,
      default: 0
    }
  },

  methods: {
    handleChange(e, id) {
      this.checkActive = e
      this.$emit('checkStatu', { inx: e, id })
    }
  }
}
</script>
<style lang="less" scoped>
.tabTop {
  font-size: 14px;
  color: #333;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  & > li {
    width: 86px;
    height: 30px;
    background: #fff;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
    border-radius: 4px;
    margin-right: 8px;
  }
  .active {
    background-color: rgba(19, 181, 177, 0.2);
    color: #13b5b1;
  }
}
</style>