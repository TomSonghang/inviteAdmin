<template>
  <div class="contextWrap">
    <el-dialog :title="interviewTag ? '修改面试时间' : '邀请面试'" :visible.sync="outerVisible">
      <el-form :model="formInfo" class="demo-form-inline">
        <el-form-item label="面试职位">
          <template v-if="!interviewTag">
            <el-select v-model="formInfo.post" placeholder="选择面试职位">
              <el-option :label="item.postName" :value="item.id" v-for="item in postTypeArray"></el-option>
            </el-select>
          </template>
          <template v-else>
            <div>{{ formInfo.post }}</div>
          </template>
        </el-form-item>
        <el-form-item label="面试时间">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="formInfo.time"
            type="datetime"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
        <div class="mianshi">
          <span>面试信息</span>
          <p @click="handleInterviewInfo" v-show="!interviewTag">新增面试信息</p>
        </div>
        <el-form-item>
          <template v-if="interviewTag">
            <div class="radioBox">
              <span>{{ fixIndoInner.interViewContact }}</span>
              <span>{{ fixIndoInner.interViewContactPhone }}</span>
              <span>{{ fixIndoInner.interViewAddress }}</span>
            </div>
          </template>
          <template v-else>
            <div v-for="item in interviewData" :key="item.id" class="radioBox">
              <el-radio @change="changeRadio" v-model="radio" :label="item.id" border>
                <span>{{ item.interViewContact }}</span>
                <span>{{ item.interViewContactPhone }}</span>
                <span>{{ item.interViewAddress }}</span>
              </el-radio>
              <span @click="delCard(item.id)" class="delCard">删除</span>
            </div>
          </template>
        </el-form-item>
      </el-form>

      <el-button
        v-if="interviewTag"
        type="primary"
        class="companyBg mar120"
        @click="handleChangeTime"
      >确定修改</el-button>
      <el-button v-else type="primary" class="companyBg mar120" @click="handleInvited">确定邀请</el-button>

      <el-dialog width="30%" title="新增面试时间" :visible.sync="innerVisible" append-to-body>
        <el-form :model="formInfoInner" class="demo-form-inline">
          <el-form-item label="联系人">
            <el-input v-model="formInfoInner.interViewContact" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input v-model="formInfoInner.interViewContactPhone" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="联系地址">
            <el-input v-model="formInfoInner.interViewAddress" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" class="companyBg mar120" @click="handleTrue">确定</el-button>
      </el-dialog>
    </el-dialog>

    <!--邀请面试-->

    <el-dialog title="举报" :visible.sync="reportVisible">
      <el-form :model="reportInfo" class="demo-form-inline">
        <el-form-item label="举报项目">
          <ul class="reportItem">
            <li
              @click="handleItem(index)"
              v-for="(item, index) in feedBackData"
              :key="item.id"
              :class="active == index ? 'active' : ''"
            >{{ item.content }}</li>
          </ul>
        </el-form-item>
        <el-form-item label="举报内容">
          <el-input v-model="reportInfo.value" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="companyBg mar120" @click="handleReportTure">确定</el-button>
    </el-dialog>
    <!--举报-->

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>是否需要淘汰该简历？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlePass">确 定</el-button>
      </span>
    </el-dialog>

    <!--不合适-->
    <tab-item :liItem="liItem" @checkStatu="checkStatu"></tab-item>
    <div class="main">
      <div class="filter">
        <div class="left">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{ postType }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                :command="item.postName"
                v-for="item in postTypeArray"
              >{{ item.postName }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-dropdown @command="handleCommand1">
            <span class="el-dropdown-link">
              {{ educationalBackground }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in fixAcademicRequirements" :command="item">{{ item }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!--学历-->
          <el-dropdown @command="handleCommand2">
            <span class="el-dropdown-link">
              {{ workYears }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in fixExperienceYea" :command="item">{{ item }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!--工作经验-->
          <el-dropdown @command="handleCommand3">
            <span class="el-dropdown-link">
              {{ jobType }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in fixJobStatus" :command="item">{{ item }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!--求职状态-->
          <el-dropdown @command="handleCommand4">
            <span class="el-dropdown-link">
              {{ jobStatus }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in fixWorkType" :command="item">{{ item }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!--工作状态-->

          <span class="reset" @click="handleReset">重置</span>
        </div>
        <div class="right">
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
      </div>
      <div class="table">
        <el-table
          :data="tableData"
          :header-cell-style="{ background: '#F8FAFB', color: '#4D586A' }"
        >
          <el-table-column prop="status" label="头像/姓名" width="180px">
            <template slot-scope="scope">
              <div
                class="realText pointer"
                @click="handleView({ id: scope.row.userId, row: scope.row.row, status: scope.row.status, resumeId: scope.row.resumeId })"
              >
                <div class="heardImg">
                  <img src="@/assets/images/boy.png" class="gander" v-if="scope.row.gender == '1'" />
                  <img src="@/assets/images/girl.png" class="gander" v-else />
                  <el-image :src="scope.row.path" width="46px" height="46px" class="imgPath"></el-image>
                </div>
                <div>{{ scope.row.realName }}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="基本信息" width="250px">
            <template slot-scope="scope">
              <div class="realText">
                <span>{{ scope.row.age }}岁 ·</span>
                <span>{{ scope.row.educationalBackground }} ·</span>
                <span>{{ scope.row.workYears }} ·</span>
                <span>{{ scope.row.maritalStatus }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="最近工作经历" width="300px">
            <template slot-scope="scope">
              <div class="realText" v-if="scope.row.workExperienceInfo.length > 0">
                <span>{{ scope.row.workExperienceInfo[0].experienceCompany }}</span> ·
                <span>{{ scope.row.workExperienceInfo[0].position }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="phone" label="联系方式" width="150px"></el-table-column>

          <el-table-column prop="postName" label="应聘职位" width="150px"></el-table-column>

          <el-table-column label="快捷操作">
            <template slot-scope="scope">
              <!--1投递成功、2收藏、3已查看、4面试邀请、5拒绝面试、6录用、7简历不适合、8面试后不适合、9录用后不适合-->
              <div class="btnsBox">
                <span
                  v-show="scope.row.status == 4"
                  @click="handleHire({ id: scope.row.resumeId, statu: '', positionId: scope.row.positionId })"
                >录用</span>
                <el-tooltip class="item" effect="dark" content="邀请TA来面试" placement="top-start">
                  <span
                    v-show="scope.row.status == 1 || scope.row.status == 2 || scope.row.status == 3"
                    @click="handleInterview(scope.row.userId)"
                  >面试</span>
                </el-tooltip>

                <span
                  v-show="scope.row.status == 5 || scope.row.status == 6"
                  @click="handleReport(scope.row.userId)"
                >举报</span>
                <el-tooltip class="item" effect="dark" content="简历状态改为待处理" placement="top-start">
                  <span
                    @click="handleReturn({ id: scope.row.resumeId, statu: '', positionId: scope.row.positionId })"
                    v-show="scope.row.status == 7 || scope.row.status == 8 | scope.row.status == 9"
                  >待定</span>
                </el-tooltip>

                <el-dropdown @command="handleMore">
                  <span class="el-dropdown-link">
                    <i class="el-icon-more"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      :command="{ title: '不合适', id: scope.row.resumeId, statu: scope.row.status, positionId: scope.row.positionId }"
                    >不合适</el-dropdown-item>
                    <el-dropdown-item :command="{ title: '举报', id: scope.row.userId }">举报</el-dropdown-item>
                    <el-dropdown-item
                      v-show="scope.row.isCollection == 0"
                      :command="{ title: '收藏', id: scope.row.userId }"
                    >收藏</el-dropdown-item>
                    <el-dropdown-item
                      v-show="scope.row.isCollection != 0"
                      :command="{ title: '取消收藏', id: scope.row.userId }"
                    >取消收藏</el-dropdown-item>
                    <el-dropdown-item
                      v-show="scope.row.status == 4"
                      :command="{ title: '修改面试时间', id: scope.row.resumeId, positionId: scope.row.positionId }"
                    >修改面试时间</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="pageIndex"
          :total="total"
          class="fyDiv"
          @current-change="handlePage"
        ></el-pagination>
      </div>
    </div>
    <resume-details
      :maskClose="show"
      @closedView="closedView"
      @nextPrv="nextPrv"
      :detailsData="detailsDataObj"
    ></resume-details>
  </div>
</template>


<script>
import tabItem from '@/components/tabItem/index'
import Code from "@/api/statusCode";
import { GetResumemanagement } from '@/api/resume'
import resumeDetails from '@/components/resumeDetails'
import details from '@/mixins/resumeDetails'
import fixData from '@/mixins/getfixData'
import resumeFun from '@/mixins/resumeFun'
export default {
  data() {
    return {

      liItem: [{
        id: 3,
        name: "全部简历",
      },
      {
        id: 4,
        name: "新简历",
      },
      {
        id: 1,
        name: "待处理",
      }, {
        id: 2,
        name: "面试",
      },
      {
        id: 5,
        name: "录用",
      },
      {
        id: 6,
        name: "不合适",
      }],

      total: 0,




      tableData: [],  //列表数据
      resumeType: 3,    //简历状态：1待处理，2面试，3简历库,4新简历,5录用,6不合适
      pageIndex: 1,
      key: '',
      postType: '应聘岗位',   //应聘岗位
      educationalBackground: '学历',    //学历
      workYears: '工作经验',
      jobType: '求职状态',
      jobStatus: '工作类型',







      type: 1,//1：表示简历管理的面试邀请 2：表示海量搜索简历的面试邀请

      searchType: 1,   //(1简历搜索，2人才搜索)
    }
  },
  mixins: [fixData, resumeFun, details],
  components: {
    tabItem,
    resumeDetails
  },
  mounted() {

    this._GetResumemanagement();  //简历管理


  },

  methods: {



    clearSearch() {   //清空搜索
      this._GetResumemanagement()
    },
    confirmSearch() {     //确认搜索
      this._GetResumemanagement()
    },
    handleReset() {    //重置
      this.postType = '应聘岗位';   //应聘岗位
      this.educationalBackground = '学历';    //学历
      this.workYears = '工作经验';
      this.jobType = '求职状态';
      this.jobStatus = '工作类型';
      this._GetResumemanagement()
    },
    handlePage(e) {
      this.pageIndex = e;
      this._GetResumemanagement();
    },
    handleCommand(e) {    //应聘岗位
      this.postType = e;
      this._GetResumemanagement();
    },
    handleCommand1(e) {  //学历
      this.educationalBackground = e;
      this._GetResumemanagement();
    },
    handleCommand2(e) {//工作经验
      this.workYears = e;
      this._GetResumemanagement();
    },
    handleCommand3(e) {//求职状态
      this.jobType = e;
      this._GetResumemanagement();
    },
    handleCommand4(e) {//工作状态
      this.jobStatus = e;
      this._GetResumemanagement();
    },
    checkStatu(e) {   //切换TAB
      this.resumeType = e;
      this._GetResumemanagement()
    },


    _GetResumemanagement() {      //列表数据
      let data = {
        resumeType: this.resumeType,
        pageIndex: this.pageIndex,
        key: this.key,
        postType: this.postType == '应聘岗位' ? '' : this.postType,    //应聘岗位
        educationalBackground: (this.educationalBackground == '学历' || this.educationalBackground == '不限') ? '' : this.educationalBackground,
        workYears: (this.workYears == '工作经验' || this.workYears == '不限') ? '' : this.workYears,
        jobType: (this.jobType == '求职状态' || this.jobType == '不限') ? '' : this.jobType,
        jobStatus: (this.jobStatus == '工作类型' || this.jobStatus == '不限') ? '' : this.jobStatus,
      }
      GetResumemanagement(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.total = res.data.totalCount;
          this.tableData = res.data.resumeList;
        }
      })
    }

  }
}
</script>
<style lang="less" scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #333;
  margin-right: 40px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.main {
  background: #fff;
  box-sizing: border-box;
  padding: 20px;
  margin-top: 20px;
}
.filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .right {
    flex-basis: 250px;
  }
}
.table {
  margin-top: 20px;
  overflow: hidden;
}
.heardImg {
  width: 46px;
  height: 46px;
  border-radius: 100%;
  margin-right: 5px;
  position: relative;
  .imgPath {
    width: 46px;
    height: 46px;
    overflow: hidden;
    display: block;
    border-radius: 50px;
  }
}
.realText {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.btnsBox {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  font-size: 14px;
}
.btnsBox > span {
  cursor: pointer;
  margin-right: 20px;
  color: #13b5b1;
}
.reset {
  font-size: 12px;
  color: #999;
  cursor: pointer;
  &:hover {
    color: #13b5b1;
  }
}
.mianshi {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  span {
    font-size: 16px;
  }
  p {
    padding: 5px 10px;
    border: 1px solid #13b5b1;
    border-radius: 20px;
    color: #13b5b1;
    cursor: pointer;
  }
}

.reportItem {
  display: flex;
  align-items: center;
  li {
    margin-right: 10px;
    padding: 2px 20px;
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
.radioBox {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  span {
    margin-right: 30px;
  }
}
.delCard {
  color: #13b5b1;
  cursor: pointer;
}
.pointer {
  cursor: pointer;
}
.gander {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 10;
  width: 16px;
  background-color: #fff;
  border-radius: 50px;
}
</style>