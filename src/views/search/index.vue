<template>
  <div class="contextWrapCope">
    <div class="searchBox">
      <div class="search">
        <div class="city" @click="checkCity">
          <el-button plain>
            {{ cityName }}
            <i class="el-icon-arrow-down"></i>
          </el-button>
        </div>
        <div class="block">
          <el-cascader
            @change="handleChange"
            placeholder="职位分类，可搜索"
            :options="postArray"
            filterable
          ></el-cascader>
        </div>
        <el-input
          @clear="clearSearch"
          placeholder="请输入搜索关键字"
          v-model="key"
          clearable
          class="input-with-select"
        >
          <!--prepend-->
        </el-input>
        <el-button icon="el-icon-search" class="companyBg" type="primary" @click="confirmSearch"></el-button>
      </div>
    </div>
    <div class="recommend">
      <span>推荐</span>
      <ul class="hotPosition" @click="handleCheckItem">
        <li v-for="item in popularPosition" :key="item.id">{{ item.postName }}</li>
      </ul>
    </div>

    <div class="filter">
      <div class="selectBox">
        <div class="checkItem">
          <span class="labelTitle">工作经验</span>
          <el-select v-model="workYears" placeholder="不限" class="input" @change="handleChange1">
            <el-option v-for="item in fixExperienceYea" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </div>

        <div class="checkItem">
          <span class="labelTitle">学历要求</span>
          <el-select
            v-model="educationalBackground"
            placeholder="不限"
            class="input"
            @change="handleChange2"
          >
            <el-option
              v-for="item in fixAcademicRequirements"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </div>

        <div class="checkItem">
          <span class="labelTitle">工作类型</span>
          <el-select v-model="jobType" placeholder="不限" class="input" @change="handleChange3">
            <el-option v-for="item in fixWorkType" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </div>

        <div class="checkItem">
          <span class="labelTitle">性别</span>
          <el-select v-model="gender" placeholder="不限" class="input" @change="handleChange4">
            <el-option v-for="item in genders" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </div>
      </div>
      <div class="btnsFilter" @click="handleFilter">
        <div class="btn" :class="active === '1' ? 'active' : ''">默认</div>
        <div class="btn" :class="active === '2' ? 'active' : ''">时间</div>
      </div>
    </div>
    <div class="table">
      <div class="listWrap" v-for="item in tableData" :key="item.fromUserId">
        <div class="imgBox">
          <div class="imgUrl">
            <img src="@/assets/images/boy.png" class="gander" v-if="item.gender == '1'" />
            <img src="@/assets/images/girl.png" class="gander" v-else />
            <el-image :src="item.headPortraitPath" height="46px" width="46px" class="imgPath"></el-image>
          </div>
          <div class="payment">{{ item.salary }}</div>
        </div>

        <div class="descriptContext">
          <div class="userTop">
            <span class="realName">{{ item.realName }}</span>
            <span class="jobStatus">{{ item.jobStatus }}</span>
          </div>

          <div class="baseInfo">
            <span v-show="item.age">{{ item.age }}</span>
            <span v-show="item.workYears">{{ item.workYears }}</span>
            <span v-show="item.educationalBackground">{{ item.educationalBackground }}</span>
            <span v-show="item.maritalStatus">{{ item.maritalStatus }}</span>
            <span v-show="item.nativeLand">{{ item.nativeLand }}</span>
          </div>

          <div class="hope">
            <span class="title">求职期望：</span>
            <span>{{ item.postName }}·{{ item.jobType }}</span>
          </div>

          <div class="descript">{{ item.selfIntroduction }}</div>
        </div>

        <div class="timeLine">
          <div class="workTime" v-if="item.workExperiencelist.length > 0">
            <el-timeline class="timeBox">
              <el-timeline-item
                :timestamp="todo.time"
                placement="top"
                v-for="todo in item.workExperiencelist"
                :key="todo.time"
              >
                <p>{{ todo.experienceCompany }} - {{ todo.position }}</p>
              </el-timeline-item>
            </el-timeline>
          </div>
          <div class="eductionTime" v-if="item.educationList.length > 0">
            <el-timeline class="timeBox">
              <el-timeline-item
                :timestamp="todo.time"
                placement="top"
                v-for="todo in item.educationList"
                :key="todo.time"
              >
                <p>{{ todo.educationalInstitutions }} - {{ todo.specialty }}</p>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>

        <div class="btnsBox">
          <!-- <el-button type="primary" v-if="item.isSecrecy" class="companyBg">拨打电话</el-button> -->
          <el-button
            type="primary"
            class="companyBg"
            @click="handleView({ id: item.fromUserId, row: item.row })"
          >查看简历</el-button>
        </div>
      </div>

      <el-pagination
        background
        layout="total, prev, pager, next"
        :current-page="pageNo"
        :total="total"
        class="fyDiv"
        @current-change="handlePage"
      ></el-pagination>
    </div>
    <resume-details
      :maskClose="show"
      @closedView="closedView"
      @nextPrv="nextPrv"
      :detailsData="detailsDataObj"
      :type="type"
    ></resume-details>
  </div>
</template>


<script>

import Code from "@/api/statusCode";
import fixData from '@/mixins/getfixData'
import details from '@/mixins/resumeDetails'
import { ResumeSearch } from '@/api/search'

import resumeDetails from '@/components/resumeDetails'
export default {
  name: "Search",
  data() {
    return {

      value: '',

      searchType: 2,   //(1简历搜索，2人才搜索)
      type: 2,//1：表示简历管理的面试邀请 2：表示海量搜索简历的面试邀请

      orderby: "ModiDateTime",  //排序规则

      pageNo: 1,
      cityName: "全国",

      tableData: [],
      total: 0,
      popularPosition: [],  //推荐职位
      genders: [
        '不限', '男', '女'
      ],
      active: '1',

    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.cityName = to.query.name || '全国'
      vm._ResumeSearch()
    })
  },
  mounted() {
    this._ResumeSearch();
  },
  computed: {
    postArray() {
      let data = JSON.stringify(this.fixJobtypeList)
      data = data.replace(/name/g, 'label').replace(/dataId/g, 'value').replace(/jobtype/g, 'children')
      return JSON.parse(data)
    }
  },
  mixins: [fixData, details],
  components: {
    resumeDetails
  },
  methods: {

    closedView() {
      //详情关闭
      this.show = false
      this._ResumeSearch()
    },

    checkCity() {    //选择城市
      this.$router.push({ name: "CheckCity" })
    },
    handlePage(e) {   //分页
      this.pageNo = e;
      this._ResumeSearch(true);
    },
    clearSearch() {   //清空搜索
      this._ResumeSearch()
    },
    confirmSearch() {     //确认搜索
      this._ResumeSearch()
    },
    handleCheckItem(e) {  //点击了推荐职位
      this.key = e.target.innerText;
      this._ResumeSearch()
    },

    handleChange(value) {     //职位分类
      let val = ''
      for (let i = 0; i < this.postArray.length; i++) {
        if (this.postArray[i].value == value[0]) {
          for (let j = 0; j < this.postArray[i].children.length; j++) {
            if (this.postArray[i].children[j].value === value[1]) {
              val = this.postArray[i].children[j].label
              break;
            }
          }
        }
      }
      this.postType = val;
      this._ResumeSearch()
    },
    handleChange1(value) {  //工作经验
      this.workYears = value;
      this._ResumeSearch()
    },
    handleChange2(value) {  //学历要求
      this.educationalBackground = value;
      this._ResumeSearch()
    },
    handleChange3(value) {  //工作类型
      this.jobType = value;
      this._ResumeSearch()
    },
    handleChange4(value) {  //性别
      this.gender = value;
      this._ResumeSearch()
    },
    handleFilter(e) {     //默认和时间筛选
      if (e.target.innerText == '时间') {
        this.active = '2'
        this.orderby = 'CreateDateTime'
      } else {
        this.active = '1'
        this.orderby = 'ModiDateTime'
      }
      this._ResumeSearch()
    },
    _ResumeSearch(reset) {
      let data = {
        key: this.key,
        gender: this.gender,
        educationalBackground: this.educationalBackground == '不限' ? "" : this.educationalBackground,
        workYears: this.workYears == '不限' ? "" : this.workYears,
        jobType: this.jobType == '不限' ? "" : this.jobType,
        orderby: this.orderby,
        postType: this.postType,
        pageNo: reset ? this.pageNo : 1,
        cityName: this.cityName == '全国' ? '' : this.cityName,
      }
      ResumeSearch(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.tableData = res.data.datas;
          this.total = res.data.totalCount;
          this.popularPosition = res.data.popularPosition;
        }
      })
    },


  },


}

</script>


<style lang="less" >
@padBot: 8px;
.contextWrapCope {
  overflow: hidden;
  width: 1200px;
  margin: 0 auto;
  .input {
    width: 130px;
  }
  .search {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .city {
    margin-right: 20px;
  }
  .block {
    width: 300px;
    margin-right: 10px;
  }

  .recommend {
    color: #999;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 24px;
    span {
      margin-right: 20px;
    }
  }
  .hotPosition {
    display: flex;
    align-items: center;
    & > li {
      padding: 5px 15px;
      background-color: #fff;
      border-radius: 20px;
      cursor: pointer;
      margin-right: 10px;
    }
    & > li:hover {
      color: #13b5b1;
    }
  }
  .filter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 38px;
  }
  .selectBox {
    display: flex;
    align-items: center;
  }
  .checkItem {
    margin-right: 20px;
    .labelTitle {
      margin-right: 12px;
      color: #333;
      font-size: 14px;
    }
  }

  .input {
    width: 150px;
  }
  .btnsFilter {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .btn {
      box-sizing: border-box;
      border: 1px solid #13b5b1;
      font-size: 14px;
      width: 65px;
      height: 40px;
      color: #13b5b1;
      text-align: center;
      line-height: 40px;
      cursor: pointer;
      background-color: #fff;
    }
    .active {
      color: #fff;
      background-color: #13b5b1;
    }
  }
  .table {
    background-color: #fff;
    padding: 20px;
    margin-top: 15px;
  }
  .listWrap {
    display: flex;
    align-items: center;
    padding: 30px 20px;
    border: 1px solid #f0f0f0;
    margin-top: 20px;
  }
  .imgBox {
    flex-basis: 80px;
    display: flex;
    margin-right: 30px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .descriptContext {
    flex-basis: 400px;
  }
  .timeLine {
    width: 500px;
    .el-timeline-item__wrapper {
      display: flex;
      align-items: center;
    }
    .is-top {
      margin: 0;
      width: 150px;
    }
    .el-timeline-item {
      padding-bottom: 10px;
    }
  }
  .btnsBox {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }
  .imgUrl {
    width: 46px;
    height: 46px;
    border-radius: 50%;

    background-color: #333;
    position: relative;
    .imgPath {
      width: 46px;
      height: 46px;
      overflow: hidden;
      display: block;
      border-radius: 50px;
    }
  }
  .payment {
    margin-top: 9px;
    padding: 3px 5px;
    border-radius: 20px;
    background-color: #fa6a43;
    color: #fff;
    display: inline-block;
    font-size: 12px;
  }

  .userTop {
    display: flex;
    align-items: center;
    padding-bottom: @padBot;
  }
  .realName {
    font-size: 16px;
    color: #333;
    padding-right: 10px;
  }
  .jobStatus {
    font-size: 14px;
    color: #999;
  }
  .baseInfo {
    display: flex;
    align-items: center;
    padding-bottom: @padBot;
    span {
      margin-right: 20px;
      font-size: 14px;
      color: #666;
    }
  }
  .hope {
    font-size: 14px;
    color: #333;
    padding-bottom: @padBot;
    .title {
      padding-right: 5px;
      color: #999;
    }
  }
  .descript {
    font-size: 14px;
    color: #333;
  }
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
