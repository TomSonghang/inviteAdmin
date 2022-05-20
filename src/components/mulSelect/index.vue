<template>
  <div>
    <el-dialog title="福利待遇" :visible.sync="dialogVisible" width="50%">
      <div class="mulWrap">
        <el-checkbox-group v-model="selectedArr" size="small">
          <el-checkbox
            :label="item.name"
            border
            v-for="item in mulData"
            class="todo"
            @change="handleChange"
          ></el-checkbox>
        </el-checkbox-group>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleTrue">确 定</el-button>
      </span>-->
    </el-dialog>
    <div class="mulBox" @click="handleCheckItem">
      <div class="mulLeft">
        <span class="holdTitle" v-show="selectedArr.length == 0">添加福利待遇</span>
        <div v-show="selectedArr.length != 0" class="itemsBox">
          <div v-for="item in selectedArr" class="itemlist">
            <span>{{ item }}</span>
            <i class="el-icon-error" @click.stop="removeItem(item)"></i>
          </div>
        </div>
      </div>
      <div class="mulRight">
        <i class="el-icon-arrow-down" v-show="selectedArr.length == 0"></i>
        <i class="el-icon-close" v-show="selectedArr.length != 0" @click.stop="handleClear"></i>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      selectedArr: this.welfare
    }
  },
  props: {
    mulData: {      //福利数据
      type: Array,
      default() {
        return []
      }
    },

    welfare: {      //选中的福利待遇
      type: Array,
      default() {
        return []
      }
    },
  },
  // model: { // 自定义v-model的格式
  //   prop: 'welfare',
  //   event: 'update:welfare'
  // },
  watch: {
    welfare(newVal) {
      this.selectedArr = newVal
    }
  },
  methods: {
    removeItem(name) {

      this.selectedArr.forEach((item, index) => {
        item === name ? this.selectedArr.splice(index, 1) : ''
      });
      this.$emit('update:welfare', this.selectedArr)
    },
    handleChange() {  //多选框改变状态时
      this.$emit('update:welfare', this.selectedArr)
    },
    handleClear() {   //移除
      this.welfare = []
      this.$emit('update:welfare', [])
    },
    handleCheckItem() {    //打开弹窗
      this.dialogVisible = true
    }
  }
}
</script>
<style lang="less">
.mulBox {
  width: 500px;
  border: 1px solid #c0c4cc;
  min-height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  box-sizing: border-box;
  color: #606266;
  padding: 5px;
}
.mulLeft {
}
.mulRight {
  flex-basis: 20px;
}
.holdTitle {
  font-size: 14px;
  color: #bcc1ca;
  padding-left: 10px;
}
.itemsBox {
  display: flex;
  align-items: center;
  flex: 1;
  flex-wrap: wrap;
  font-size: 12px;
}
.itemlist {
  border-radius: 2px;
  border: 1px solid #e9e9eb;
  padding: 2px 5px;
  color: #909399;
  background: #f4f4f5;
  margin-right: 5px;
  margin-bottom: 3px;
  margin-top: 3px;
  span {
    margin-right: 2px;
  }
}
.mulWrap {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
}
.todo {
  margin-bottom: 5px;
  width: 100px;
}
.is-bordered {
  margin-left: 0 !important;
}
</style>