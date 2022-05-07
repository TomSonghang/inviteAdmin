<template>
  <ul class="tabTop">
    <li
      v-for="(item, index) in liItem"
      :key="item.id"
      @click="handleChange(item.id, index)"
      :class="index == active ? 'active' : ''"
    >{{ item.name }}</li>
  </ul>
</template>
<script>
export default {
  data: function () {
    return {
      active: 0
    }
  },
  props: {
    liItem: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    handleChange(e, index) {
      this.active = index
      this.$emit('checkStatu', e)
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