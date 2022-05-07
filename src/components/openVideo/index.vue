<template>
  <el-dialog
    :title="title"
    @close="close"
    :visible="videoShow"
    destroy-on-close
    class="diaTable"
    close-on-click-modal
  >

    </el-dialog>
</template>

<script>
import closeMask from "@/mixins/maskCloseImg";
export default {
  data() {
    return {};
  },
  mixins: [closeMask],
  props: {
    videoShow: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "视频播放",
    },
  },
  methods: {
    close() {
      //关闭弹窗
      this.$emit("close", false);
    },
  },
};
</script>