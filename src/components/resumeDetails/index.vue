<template>
  <div id="app">
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
      <el-button type="primary" class="companyBg mar120" @click="handleInvited">确定邀请</el-button>

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
    <!--弹窗-->
    <div class="main"></div>
    <div class="mask_sh" id="mask_sh" v-show="maskClose">
      <div class="mask_closed" @click="closeMask">
        <img src="@/assets/images/mask_closed.png" alt />
      </div>
      <div class="mask_left" @click="handleNextPrv('up')">
        <img src="@/assets/images/mask_left.png" alt />
      </div>
      <div class="mask_right" @click="handleNextPrv('down')">
        <img src="@/assets/images/mask_right.png" alt />
      </div>
    </div>
    <!--遮罩层-->
    <div
      class="details_wrap"
      id="details_wrap"
      v-show="maskClose"
      :style="{
        height: screenHeight + 'px'
      }"
    >
      <div class="d_top_wrap_sh">
        <div class="d_img_box_sh">
          <img :src="detailsData.headPath" alt="头像" class="img_box_sh" />
          <img src="auth_icon.png" class="auth_img_sh" alt="认证" />
        </div>
        <!--头部左-->
        <div class="d_main_box_sh">
          <div class="d_top_one_sh">
            <div class="name_sex_age_sh">
              <span class="name_sh">{{ detailsData.realName }}</span>
            </div>
            <div class="last_time_sh">更新时间: {{ detailsData.modifyTime }}</div>
          </div>
          <div class="d_top_two_sh">
            <div>居住地:{{ detailsData.living }}</div>
            <div class="checkPhone_sh">
              <span
                v-if="detailsData.mobile == 'none'"
                @click="checkPhone(detailsData.userId)"
              >点击查看手机号</span>
              <span v-else>{{ detailsData.mobile }}</span>
            </div>
          </div>
          <div class="d_top_three_sh">
            <div>籍贯: {{ detailsData.nativeLand }} | {{ detailsData.age }} | 经验: {{ detailsData.workYears }} | 学历: {{ detailsData.educationalBackground }} | 婚姻: {{ detailsData.maritalStatus }}</div>
          </div>
          <div class="d_top_four_sh">{{ detailsData.signature }}</div>
        </div>
        <!--头部右-->
      </div>
      <!--头部结束-->
      <div class="second_wrap_sh">
        <div class="d_qz_wrap_sh">
          <div class="title_wrap_sh">
            <div class="title_line_sh"></div>
            <span>求职意向</span>
          </div>
          <div class="yx_item_sh">
            <p>
              意向职位:
              <span>{{ detailsData.postName }}</span>
            </p>
            <p>
              工作类型:
              <span>{{ detailsData.jobType }}</span>
            </p>
            <p>
              意向地区:
              <span>{{ detailsData.area }}</span>
            </p>
            <p>
              期望薪资:
              <span>{{ detailsData.salary }}</span>
            </p>
            <p>
              到岗时间:
              <span>{{ detailsData.dutyTime }}</span>
            </p>
          </div>
        </div>
        <!--求职结束-->
        <div class="d_js_wrap_sh" v-if="detailsData.selfIntroduction">
          <div class="title_wrap_sh">
            <div class="title_line_sh"></div>
            <span>自我介绍</span>
          </div>
          <div class="zw_description_sh">{{ detailsData.selfIntroduction }}</div>
        </div>
        <!--自我介绍结束-->
        <div
          class="d_jl_wrap_sh"
          v-if="detailsData.workExperiencelist && detailsData.workExperiencelist.length > 0"
        >
          <div class="title_wrap_sh">
            <div class="title_line_sh"></div>
            <span>工作经历</span>
          </div>
          <div class="jl_wrap_sh" v-for="item in detailsData.workExperiencelist">
            <div class="jl_top_sh">
              <div class="gszw_sh">{{ item.experienceCompany }} - {{ item.position }}</div>
              <div class="gztime_sh">{{ item.time }}</div>
            </div>
            <div class="zwjs_sh">{{ item.position }}</div>
          </div>
        </div>
        <!--工作经历结束-->
        <div
          class="d_jl_wrap_sh"
          v-if="detailsData.educationInfo && detailsData.educationInfo.length > 0"
        >
          <div class="title_wrap_sh">
            <div class="title_line_sh"></div>
            <span>教育经历</span>
          </div>
          <div class="jl_wrap_sh" v-for="item in detailsData.educationInfo">
            <div class="jl_top_sh">
              <div class="gszw_sh">{{ item.educationalInstitutions }}</div>
              <div class="gztime_sh">{{ item.time }}</div>
            </div>
            <div class="zwjs_sh">{{ item.specialty }}</div>
          </div>
        </div>
        <!--教育经历结束-->
      </div>
      <div class="btns_bottom_sh">
        <div class="auto_btns_box">
          <ul class="btns_left_sh ul_sh">
            <li class="btns_sh" @click="handleMore({ title: '举报', id: detailsData.resumeId })">举报</li>
            <li
              class="btns_sh"
              @click="handleMore({ title: '不合适', id: detailsData.resumeId, statu: detailsData.status, positionId: detailsData.positionId })"
            >不合适</li>
            <li
              class="btns_sh"
              v-if="detailsData.isCollection === 0"
              @click="handleMore({ title: '收藏', id: detailsData.userId })"
            >收藏</li>
            <li
              class="btns_sh"
              v-else
              @click="handleMore({ title: '取消收藏', id: detailsData.userId })"
            >取消收藏</li>
            <li
              class="btns_sh"
              v-show="detailsData.status == 4"
              @click="handleMore({ title: '修改面试时间', id: detailsData.resumeId })"
            >修改面试时间</li>
          </ul>
          <ul class="btns_right_sh ul_sh">
            <li
              class="btns_sh"
              @click="checkPhone(detailsData.userId)"
              v-if="detailsData.mobile == 'none'"
            >查看手机号</li>
            <li class="btns_sh active_sh" @click="handleInterview(detailsData.userId)">邀请面试</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import resumeDet from '@/mixins/resumeDetails'
import resumeFun from '@/mixins/resumeFun'
export default {
  name: "ResumeDetail",
  data() {
    return {
      height: null,
      screenHeight: null,
    }
  },
  mixins: [resumeDet, resumeFun],
  props: {
    maskClose: {
      type: Boolean,
      default: false
    },
    detailsData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  mounted() {
    // 在调用显示层时加上这句js代码就可以了：
    //document.documentElement.style.overflow = "hidden";
    //关闭层的时间别忘了在加上这句：
    //document.documentElement.style.overflow = "scroll";
    this.height = document.body.clientWidth;
    this.screenHeight = window.screen.availHeight - 200;
  },

  methods: {

    closeMask() {
      document.documentElement.style.overflow = "scroll";
      this.$emit('closedView')
    },
    handleNextPrv(flag) {
      this.$emit('nextPrv', flag)

    },
    he() { }
  },
}
</script>
<style scoped lang="less">
#app {
  position: relative;
}

.mask_sh {
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
}

.mask_closed {
  width: 44px;
  height: 44px;
  position: absolute;
  right: 250px;
  top: 100px;
  z-index: 1;
  cursor: pointer;
}

.mask_left {
  width: 28px;
  height: 54px;
  position: absolute;
  left: 250px;
  top: 40%;
  z-index: 1;
  cursor: pointer;
}

.mask_right {
  width: 28px;
  height: 54px;
  position: absolute;
  right: 250px;
  top: 40%;
  z-index: 1;
  cursor: pointer;
}

.details_wrap {
  position: fixed;
  background: #fff;
  box-shadow: 0 0 20px #333;
  border-radius: 10px;
  width: 910px;
  z-index: 100;
  left: 50%;
  top: 100px;
  margin-left: -460px;
  overflow-y: auto;
}

.details_wrap::-webkit-scrollbar {
  display: none;
}

.d_top_wrap_sh {
  padding: 37px 50px 30px;
  background-color: #f1f1f1;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  display: flex;
  align-items: center;
}

.d_img_box_sh {
  flex-basis: 78px;
  height: 78px;
  background: #f1f1f1;
  position: relative;
  overflow: hidden;
  margin-right: 25px;
  z-index: 102;
}

.img_box_sh {
  width: 100%;
  border-radius: 100%;
  display: block;
}

.auth_img_sh {
  position: absolute;
  bottom: 0;
  right: 10px;
}

.d_main_box_sh {
  flex: 1;
}

.d_top_one_sh {
  display: flex;
  justify-content: space-between;
  padding-bottom: 14px;
}

.name_sex_age_sh {
  font-size: 18px;
  color: #333;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
}

.name_sh {
  font-size: 22px;
  color: #1a1a1a;
  font-weight: bold;
  line-height: 26px;
  padding-right: 5px;
}

.last_time_sh {
  font-size: 14px;
  color: #999999;
}

.d_top_two_sh {
  color: #666;
  font-size: 14px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-bottom: 14px;
}

.checkPhone_sh {
  width: 147px;
  height: 26px;
  background-color: rgba(190, 240, 239, 0.4);
  border-radius: 13px;
  color: #13b5b1;
  text-align: center;
  line-height: 26px;
  font-size: 14px;
  cursor: pointer;
  margin-left: 20px;
}

.checkPhone_sh:hover {
  background-color: rgba(190, 240, 239, 0.6);
}

.d_top_three_sh {
  font-size: 14px;
  color: #666;
  padding-bottom: 14px;
}

.d_top_four_sh {
  font-size: 14px;
  color: #999;
}

.second_wrap_sh {
  padding: 0 50px 100px;
}

.d_qz_wrap_sh {
  margin-top: 40px;
}

.title_wrap_sh {
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #1a1a1a;
  font-weight: bold;
  line-height: 20px;
  padding-bottom: 20px;
}

.title_line_sh {
  height: 20px;
  width: 4px;
  background: #13b5b1;
  border-radius: 3px;
  margin-right: 10px;
}

.yx_item_sh {
  overflow: hidden;
  font-size: 14px;
  color: #999;
}

.yx_item_sh > p {
  float: left;
  width: 33%;
  padding-bottom: 15px;
}

.yx_item_sh > p > span {
  color: #333;
  padding-left: 3px;
}

.d_js_wrap_sh,
.d_jl_wrap_sh {
  margin-top: 40px;
}

.zw_description_sh {
  font-size: 14px;
  color: #666;
}

.jl_wrap_sh {
  font-size: 14px;
  margin-bottom: 40px;
}

.jl_top_sh {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 14px;
}

.gszw_sh {
  color: #333;
  font-weight: bold;
}

.gztime_sh {
  color: #999;
}

.zwjs_sh {
  color: #666;
}

.btns_bottom_sh {
  position: fixed;
  width: 100%;
  height: 80px;
  background: rgba(0, 0, 0, 1);
  bottom: 0;
  left: 0;
  z-index: 101;
}

.auto_btns_box {
  width: 910px;
  margin: 0 auto;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btns_left_sh {
  display: flex;
  align-items: center;
}

.btns_right_sh {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.ul_sh > li {
  display: inline-block;
  margin-left: 10px;
  width: 100px;
  height: 40px;
  border-radius: 20px;
  line-height: 40px;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
}

.btns_left_sh > li:first-child {
  margin-left: 0;
}

.btns_sh {
  background: #fff;
  border: 1px solid #13b5b1;
  color: #13b5b1;
}

.btns_sh:hover {
  opacity: 0.9;
}

.active_sh {
  background: #13b5b1;
  color: #fff;
}

/**弹窗 */
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
</style>