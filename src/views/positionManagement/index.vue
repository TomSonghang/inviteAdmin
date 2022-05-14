<template>
  <div class="contextWrap">
    <tab-item :liItem="liItem" @checkStatu="checkStatu" :active="activeItem"></tab-item>
    <div class="search">
      <div class="searchBox">
        <el-input
          placeholder="请输入内容"
          v-model="key"
          class="input-with-select"
          clearable
          @clear="clearSearch"
        >
          <el-button slot="append" icon="el-icon-search" @click="confirmSearch"></el-button>
        </el-input>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="handlePost" class="companyBg">发布职位</el-button>
      </div>
    </div>

    <div class="list">
      <position-list :arrayData="listData" @refresh="refresh"></position-list>
      <el-pagination
        background
        layout="total, prev, pager, next"
        :current-page="pageNo"
        :total="total"
        :page-size="5"
        class="fyDiv"
        @current-change="handlePage"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import positionList from '@/components/positionList/index'
import tabItem from '@/components/tabItem/index'
import Code from "@/api/statusCode";
import { PositionManagementList } from '@/api/positionManagement'
export default {
  name: "Position",
  data: () => {
    return {
      key: "",
      pageNo: 1,
      postStatus: -1,
      total: 0,  //总数据
      listData: [],
      liItem: [{
        id: -1,
        name: "全部职位",
      },
      {
        id: 1,
        name: "发布中",
      },
      {
        id: 2,
        name: "已下线",
      }],
      activeItem: 0
    }
  },
  components: {
    positionList,
    tabItem
  },
  mounted() {
    this._PositionManagementList()
  },
  methods: {
    clearSearch() {   //清空搜索
      this._PositionManagementList()
    },
    confirmSearch() {     //确认搜索
      this._PositionManagementList()
    },
    refresh() {    //刷新职位
      
      this._PositionManagementList()
    },
    handlePost() {      //发布职位
      this.$router.push({ name: "PostJob" })
    },
    checkStatu({ inx, id }) { //切换TAB
      this.activeItem = inx
      this.postStatus = id;
      this.pageNo = 1
      this._PositionManagementList()
    },
    handlePage(e) {   //分页
      this.pageNo = e;
      this._PositionManagementList();
    },
    _PositionManagementList() {
      let data = {
        postStatus: this.postStatus,
        key: this.key,
        pageNo: this.pageNo
      }
      PositionManagementList(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.total = res.data.allCount;
          this.listData = res.data.datas
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.fyDiv {
  float: right;
  margin-top: 30px;
  padding-bottom: 20px;
}
.contextWrap {
  width: 1200px;
  margin: 0 auto;
  background-color: #fff !important;
  box-sizing: border-box;
}

.list {
  overflow: hidden;
}
.search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  .searchBox {
    flex-basis: 250px;
  }
}
</style>