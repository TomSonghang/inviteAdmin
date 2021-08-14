export default {
  methods: {
    handleClickItem() {
      // 获取遮罩层dom
      this.$nextTick(() => {
        let domImageMask = document.querySelector(".el-image-viewer__mask");
        if (!domImageMask) {
          return;
        }
        domImageMask.addEventListener("click", () => {
          // 点击遮罩层时调用关闭按钮的 click 事件
          document.querySelector(".el-image-viewer__close").click();
        });
      });
    }
  }
};
