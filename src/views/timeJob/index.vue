<template>
  <div class="contextWrap">
    <tab-item :liItem="liItem" @checkStatu="checkStatu"></tab-item>
    <div class="search">
      <div class="searchBox">
        <el-input placeholder="请输入内容" v-model="key" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <div>
        <el-button
          type="primary"
          icon="el-icon-search"
          class="companyBg"
          @click="hanldlePostTime"
        >发布兼职</el-button>
      </div>
    </div>

    <div class="list">
      <position-list :arrayData="listData" :flag="false" @openJz="handlejz" @refresh="refresh"></position-list>
      <el-pagination
        background
        layout="total, prev, pager, next"
        :current-page="pageNo"
        :total="total"
        class="fyDiv"
        @current-change="handlePage"
      ></el-pagination>
    </div>
    <el-dialog title="评价" :visible.sync="dialogReply">
      <el-form :model="reportInfo" class="demo-form-inline">
        <el-form-item label="回复评分" style="display: flex;align-items: center;">
          <el-rate v-model="replayNum" show-text></el-rate>
        </el-form-item>
        <el-form-item label="评价项目">
          <ul class="reportItem">
            <li
              @click="handleItem(index)"
              v-for="(item, index) in replyData"
              :key="item.id"
              :class="active === index ? 'active' : ''"
            >{{ item.content }}</li>
          </ul>
        </el-form-item>
        <el-form-item label="评价内容">
          <el-input v-model="reportInfo.value" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="companyBg mar120" @click="handleReportTure">确定</el-button>
    </el-dialog>
    <el-dialog title="炒更详情" :visible.sync="dialogTableVisible">
      <div class="partDetails">
        <div class="partL">
          <div class="partItem">
            <span>炒更名称:</span>
            <p>{{ detailsData.hiringPost }}</p>
          </div>

          <div class="partItem">
            <span>薪资待遇:</span>
            <p>{{ detailsData.minPay }}-{{ detailsData.maxPay }}{{ detailsData.wageType }}</p>
          </div>
          <div class="partItem">
            <span>用工周期:</span>
            <p>{{ detailsData.startRecruitmentCycle }} 至 {{ detailsData.endRecruitmentCycle }}</p>
          </div>

          <div class="partItem">
            <span>需要人数:</span>
            <p>{{ detailsData.needHiringNumber }}</p>
          </div>

          <div class="partItem">
            <span>截止时间:</span>
            <p>{{ detailsData.endDateTime }}</p>
          </div>

          <div class="partItem">
            <span>结算方式:</span>
            <p>{{ detailsData.clearingForm }}</p>
          </div>

          <div class="partItem">
            <span>联系电话:</span>
            <p>{{ detailsData.phone }}</p>
          </div>

          <div class="partItem">
            <span>工作地址:</span>
            <p>{{ detailsData.detailedAddress }}</p>
          </div>

          <div class="partItem">
            <span>用工要求:</span>
            <p>{{ detailsData.laborRequire }}</p>
          </div>
        </div>
        <div class="partR">
          <div class="userBox">
            <p class="userTitle">发起人</p>
            <div class="user">
              <div class="imgBox">
                <img :src="detailsData.portraitPath" alt />
              </div>
              <div class="userDes">
                <div>{{ detailsData.companyName }}</div>
                <div class="userInfo">
                  <span>等级：{{ detailsData.levelName }}</span>
                  <span>发起次数:{{ detailsData.sponsorCount }}</span>
                  <span>得分:{{ detailsData.groupGrade }}</span>
                </div>
              </div>
            </div>
            <div class="pjBox">
              <p class="userTitle">申请人（{{ detailsData.applyCount }}）</p>
              <div class="pjItem">
                <!--用户列表-->
                <div class="userList" v-for="item in detailsData.applyList" :key="item.id">
                  <div class="user">
                    <div class="imgBox">
                      <img :src="item.portraitPath" alt />
                    </div>
                    <div class="userDes">
                      <div class="userNameBox">
                        <span>{{ item.realName }}</span>
                      </div>
                      <div class="userInfo">
                        <span>等级：{{ item.levelName }}</span>
                        <span>发起次数:{{ item.applyCount }}</span>
                        <span>得分:{{ item.groupGrade }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="pjContext">
                    <p v-if="item.estimateList" class="replay">
                      <span>{{ item.estimateList.estimateType }}：</span>
                      <span
                        v-show="item.estimateList.optionContent"
                      >【{{ item.estimateList.optionContent }}】</span>
                      <span class="textDes">{{ item.estimateList.estimateContent }}</span>
                    </p>
                    <div v-if="item.replyList" class="repalyBox">
                      <span>{{ item.replyList.estimateType }}：</span>
                      <span
                        v-show="item.replyList.optionContent"
                      >【{{ item.replyList.optionContent }}】</span>
                      <span class="textDes">{{ item.replyList.estimateContent }}</span>
                    </div>

                    <p class="btnsBox">
                      <span
                        v-show="detailsData.status != '招募完成'"
                        @click="handleHire({ status: 1, applyid: item.id, withGroupId: detailsData.id })"
                      >录用</span>
                      <span
                        v-show="detailsData.status != '招募完成'"
                        style="color: #b52613;"
                        @click="handleHire({ status: 2, applyid: item.id, withGroupId: detailsData.id })"
                      >不合适</span>
                      <span
                        style="color: #b55c13;"
                        v-show="detailsData.status == '招募完成'"
                        @click="handleReplay({ withGroupId: detailsData.id, estimateId: item.applyUserId })"
                      >评价</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import positionList from '@/components/positionList/index'
import tabItem from '@/components/tabItem/index'
import Code from "@/api/statusCode";
import { WithGroupList, GetWithGroupDetails, SetApplyStatus, ReplyEstimate, GetFeedBackDataBase } from '@/api/timeJob'
export default {
  name: "Position",
  data: () => {
    return {
      dialogTableVisible: false,    //详情
      dialogReply: false,    //评价
      reportInfo: {
        value: ""
      },
      key: "",
      pageNo: 1,
      statusText: '',
      total: 0,  //总数据
      listData: [],
      liItem: [{
        id: '',
        name: "全部兼职",
      },
      {
        id: 1,
        name: "招募中",
      },
      {
        id: 2,
        name: "已完成",
      },
      {
        id: 3,
        name: "待上架",
      },
      {
        id: 4,
        name: "已关闭",
      }],
      groupId: "",  //兼职详情id

      estimateId: "",    //企业ID
      detailsData: {},    //兼职数据
      replyData: [],
      active: '',
      replayNum: 0,//评分

    }
  },
  components: {
    positionList,
    tabItem
  },
  mounted() {
    this._WithGroupList()
    this._GetFeedBackDataBase()
  },
  methods: {
    handleReportTure() {     //确认评价
      this._ReplyEstimate()
    },
    handleItem(index) {     //切换评价选项
      this.active = index
    },
    _GetFeedBackDataBase() {     //获取评价项目
      let data = {
        dataType: 6
      }
      GetFeedBackDataBase(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.replyData = res.data
        }
      })
    },
    handleReplay(data) {    //评价

      let { withGroupId, estimateId } = data;
      this.groupId = withGroupId;
      this.estimateId = estimateId
      this.dialogReply = true
    },
    _ReplyEstimate() {
      let data = {
        withGroupId: this.groupId,
        estimateId: this.estimateId,
        grade: this.replayNum,
        estimateContent: this.reportInfo.value,
        optionContent: this.replyData[this.active].content || '',
      }
      ReplyEstimate(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.dialogReply = false;
          this.replayNum = 0;
          this.reportInfo.value = '';
          this.active = '';
          this.$message({
            message: '评价成功',
            type: 'success'
          });
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          });
        }
      })
    },
    handleHire(arg) {     //录用
      this._SetApplyStatus(arg)
    },
    _SetApplyStatus(arg) {
      let { status, applyid, withGroupId } = arg
      let data = {
        status,
        applyid,
        withGroupId
      }
      SetApplyStatus(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          });
        }
      })
    },
    refresh() {    //刷新
      this._WithGroupList()
    },
    hanldlePostTime() {     //发布兼职
      this.$router.push({ name: "PostTime" })
    },
    handlejz(e) {   //打开兼职详情
      this.dialogTableVisible = true;
      this.groupId = e;
      this._GetWithGroupDetails()
    },
    _GetWithGroupDetails() {     //获取详情数据
      let data = {
        groupId: this.groupId
      }
      GetWithGroupDetails(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.detailsData = res.data[0]
        }
      })
    },
    checkStatu(e) {
      switch (e) {
        case -1:
          e = '';
          break;
        case 1:
          e = '招募中';
          break;
        case 2:
          e = '已完成';
          break;
        case 3:
          e = '待上架';
          break;
        case 4:
          e = '已关闭';
          break;
      }
      this.statusText = e;
      this.pageNo = 1
      this._WithGroupList()
    },
    handlePage(e) {
      this.pageNo = e;

      this._WithGroupList();
    },
    _WithGroupList() {
      let data = {
        statusText: this.statusText,
        key: this.key,
        pageNo: this.pageNo
      }
      WithGroupList(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.total = res.data.totalCount;
          this.listData = res.data.pageList
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

.partDetails {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .partL {
    padding-right: 20px;
    flex-basis: 500px;
    border-right: 1px solid #f5f5f5;
    .partItem {
      padding-bottom: 20px;
      display: flex;
      align-items: center;
      span {
        font-size: 14px;
        color: #999;
        margin-right: 10px;
        flex-basis: 60px;
      }
      p {
        flex: 1;
        font-size: 14px;
        color: #000;
      }
    }
  }
}
.partR {
  padding-left: 20px;
  flex: 1;
}
.user {
  display: flex;
  align-items: center;
  padding: 20px 0;
}
.imgBox {
  width: 42px;
  height: 42px;
  border-radius: 50px;
  overflow: hidden;
  margin-right: 12px;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.userDes {
  color: #333;
  flex: 1;
}
.userInfo {
  display: flex;
  align-items: center;
  margin-top: 8px;
  span {
    font-size: 14px;
    color: #999;
    margin-right: 10px;
  }
}
.userTitle {
  font-size: 16px;
}
.pjBox {
  border-top: 5px solid #f5f5f5;
  padding-top: 20px;
}
.replay {
  padding-bottom: 10px;
}
.repalyBox {
  background-color: #f5f5f5;
  padding: 10px;
}
.textDes {
  color: #333;
}
.pjContext {
  padding-bottom: 20px;
}
.userList {
  border-bottom: 1px solid #f5f5f5;
}
.userNameBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.btnsBox {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  span {
    margin-left: 10px;
    color: #13b5b1;
    cursor: pointer;
  }
}
.reportItem {
  display: flex;
  align-items: center;
  li {
    margin-right: 10px;
    padding: 0 20px;
    border: 1px solid #f5f5f5;
    color: #333;
    border-radius: 50px;
    cursor: pointer;
    &:hover {
      color: #13b5b1;
      border: 1px solid #13b5b1;
    }
  }
}
.active {
  color: #13b5b1 !important;
  border: 1px solid #13b5b1 !important;
}
</style>