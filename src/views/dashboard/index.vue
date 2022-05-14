<template>
  <div class="contextWrap">
    <el-dialog title="面试安排" :visible.sync="dialogTableVisible">
      <el-calendar>
        <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
        <template slot="dateCell" slot-scope="{date, data}">
          <p>{{ data.day.split('-').slice(1).join('-') }}</p>
          <div v-for="(item, index) in dateArr" :key="index">
            <div v-if="item.indexOf(data.day) != -1">
              <p class="is-selected">今日有面试 ✔️</p>
              <el-button size="mini" round @click="hanldeInviewMore(3)">查看详情</el-button>
            </div>
          </div>
        </template>
      </el-calendar>
    </el-dialog>

    <div class="left">
      <div class="top" @click="handleBanner">
        <el-image :src="bannerImg" width="100%" height="100%"></el-image>
      </div>
      <div class="bottom">
        <div class="title">
          <div>招聘进展</div>
          <el-button type="primary" icon="el-icon-plus" @click="handlePost" class="companyBg">发布职位</el-button>
        </div>
        <div class="table">
          <el-table
            height="500px"
            :header-cell-style="{ background: '#F8FAFB', color: '#13b5b1' }"
            :data="tableData"
            style="width: 100%"
            stripe
          >
            <el-table-column align="center" prop="postName">
              <template slot="header">
                <div @click="handleOpen(0)" class="cursor">
                  <p class="table-name">在招岗位</p>
                  <p>{{ publishPosition.publishCount }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="newresumeCount">
              <template slot="header">
                <div @click="handleOpen(1)" class="cursor">
                  <p class="table-name">新简历</p>
                  <p>{{ publishPosition.newresumeCount }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="undisposedCount">
              <template slot="header">
                <div @click="handleOpen(2)" class="cursor">
                  <p class="table-name">待处理</p>
                  <p>{{ publishPosition.undisposedCount }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="intervieCount">
              <template slot="header">
                <div @click="handleOpen(3)" class="cursor">
                  <p class="table-name">面试</p>
                  <p>{{ publishPosition.intervieCount }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="hireCount">
              <template slot="header">
                <div @click="handleOpen(4)" class="cursor">
                  <p class="table-name">录用</p>
                  <p>{{ publishPosition.hireCount }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="notSuitableCount">
              <template slot="header">
                <div @click="handleOpen(5)" class="cursor">
                  <p class="table-name">不合适</p>
                  <p>{{ publishPosition.notSuitableCount }}</p>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="resume">
        <div class="resumeTitle">新投递简历({{ newResume.count }})</div>
        <div class="user_list" v-if="newResume.count != 0">
          <div v-for="(item, index) in newResume.datas" class="userBox">
            <div class="u_left">
              <div class="userImg">
                <!-- <el-image :src="item.headPath" width="42px" height="42px"></el-image> -->
              </div>
              <div>
                <p class="userName">{{ item.realName }}</p>
                <p class="userPost">{{ item.postName }}</p>
              </div>
            </div>
            <el-button round plain size="small" @click="handleDoit(item.id)">去处理</el-button>
          </div>
        </div>
        <div class="user_list">
          <span>今天没有新投递简历可处理哦</span>
        </div>
      </div>
      <div class="interview" v-if="todayInterview.count > 0">
        <div class="interviewTitle">
          <div>今日面试安排({{ todayInterview.count }})</div>
          <div class="more" @click="handleMore">
            <span>查看更多</span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="block">
          <el-timeline>
            <el-timeline-item
              :timestamp="item.interviewTime"
              placement="top"
              v-for="(item,index) in todayInterview.datas"
              :key="index"
            >
              <el-card>
                <p class="interviewName">面试人:{{ item.realName }}</p>
                <p class="positionC">岗位:{{ item.postName }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  EnterpriseWorkStand,
  InterviewMore
} from "@/api/dashboard";
import Code from "@/api/statusCode";
import PageMain from "../../layout/components/pageMain/index.vue";
export default {
  name: "Dashbord",
  data: () => {
    return {
      tableData: [],
      bannerImg: "",
      publishPosition: {},
      newResume: {},
      todayInterview: {},
      dialogTableVisible: false,  //日历
      moreInterview: [],   //面试安排
    }
  },
  computed: {
    dateArr() {
      return this.moreInterview.reduce((a, b) => {
        if (!a.includes(b.interviewTime)) {
          a.push(b.interviewTime)
        }
        return a
      }, [])
    }
  },
  methods: {
    hanldeInviewMore() {
      this.dialogTableVisible = false
      this.$router.push({
        name: "Resume", query: {
          status: 3
        }
      })
    },
    handleOpen(e) {      //跳转

      if (e === 0) {      //岗位招聘
        this.$router.push({ name: "Position" })
      } else {
        this.$router.push({
          name: "Resume", query: {
            status: e
          }
        })
      }
    },
    handleBanner() {     //点击广告图
      this.$router.push({ name: "Serve" })
    },
    handlePost() {      //发布职位
      this.$router.push({ name: "PostJob" })
    },
    handleMore() {     //查看更多
      this.dialogTableVisible = true
    },
    _InterviewMore() {
      InterviewMore({}).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          //面试安排
          this.moreInterview = res.data
        }
      })
    },
    _EnterpriseWorkStand() {
      EnterpriseWorkStand().then(res => {
        if (res.status === Code.SUCCESS_CODE) {

          this.tableData = res.data.publishPosition.datas;
          this.bannerImg = res.data.imageUrl;
          this.publishPosition = res.data.publishPosition;
          this.newResume = res.data.newResume;
          this.todayInterview = res.data.todayInterview
        }
      })
    },
  },
  components: {
    PageMain
  },
  mounted() {
    this._EnterpriseWorkStand()
    this._InterviewMore()
  }
};

</script>

<style scoped lang="less">
.contextWrap {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 1200px;
  margin: 0 auto;
  .left {
    font-size: 16px;
    color: #4d586a;
    box-sizing: content-box;
    flex-basis: 890px;
    .bottom {
      margin-top: 20px;
      background: #fff;
      padding-bottom: 30px;
    }
    .title {
      padding: 20px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .table {
      padding: 0 20px;
      box-sizing: border-box;
      width: 890px;
    }
  }
  .right {
    width: 290px;
    .resume {
      box-sizing: border-box;
      padding: 20px;
      font-size: 16px;
      background-color: #fff;
      .resumeTitle {
        display: flex;
        padding-bottom: 20px;
        color: #38393f;
      }
    }
  }
  .top {
    height: 130px;
    cursor: pointer;
  }
  .user_list {
    max-height: 280px;
    span {
      font-size: 14px;
      color: #999;
    }
  }
  .table-name {
    color: #4d586a;
  }
  .userBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .u_left {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .userImg {
    width: 42px;
    height: 42px;
    border-radius: 100%;
    background-color: #000;
    margin-right: 12px;
  }
  .userName {
    color: #38393f;
    font-size: 16px;
  }
  .userPost {
    color: #999;
    font-size: 14px;
    padding-top: 5px;
  }
  .interview {
    background-color: #fff;
    margin-top: 20px;
    box-sizing: border-box;
    padding: 20px;
  }
  .interviewTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 20px;
  }
  .more {
    font-size: 12px;
    color: #999;
    cursor: pointer;
  }
  .block {
    max-height: 280px;
    overflow-y: auto;
  }
  .is-selected {
    color: #13b5b1;
    padding: 5px 0;
  }
  .cursor {
    cursor: pointer;
  }
  .positionC {
    color: #999;
    font-size: 14px;
  }
  .interviewName {
    font-size: 16px;
    color: #333;
    padding-bottom: 10px;
  }
}
.dateBox {
  width: 100%;
  height: 100%;
  background: #13b5b1;
}
</style>

