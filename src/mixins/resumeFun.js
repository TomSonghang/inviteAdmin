import {
  GetFeedBackData,
  ResumeDetailsFeedback,
  OutResume,
  CollectResume,
  CloseCollectResume,
  GetInterviewerInfo,
  DelInterViewInfo,
  SaveIVInfo,
  Invited,
  HireResume,
  UpdateInterviewTime,
  GetInterviewInfo,
  ReturnPending,
} from "@/api/resume";
import Code from "@/api/statusCode";

export default {
  data() {
    return {
      feedBackData: [], //举报项目数据
      active: 88, //当前的确认项   如果为''，代表是0

      reportInfo: {
        //举报内容
        value: "",
        itemId: "",
      },

      formInfo: {
        //面试职位
        post: "",
        time: "",
      },

      formInfoInner: {
        //面试信息
        interViewContact: "",
        interViewAddress: "",
        interViewContactPhone: "",
      },
      fixIndoInner: {
        //修改面试信息时固定文字
        interViewContact: "",
        interViewAddress: "",
        interViewContactPhone: "",
      },

      radio: "", //面试信息选中ID
      userId: "", //简历用户的ID
      interviewData: [], //面试信息

      resumeId: "", //简历ID
      statusStr: "", //简历状态
      positionId: "", //职位ID

      interviewTag: 0, //0代表邀请面试  1代表修改面试

      outerVisible: false, //邀请面试外弹窗
      innerVisible: false, //内弹窗

      reportVisible: false, //举报
      dialogVisible: false, //不合适
    };
  },
  methods: {
    nextPrv(data) {
      //详情上一页下一页
      console.log(data);
      this.flag = data;
      if (data == "up") {
        this.activeIndex = this.activeIndex - 1;
      } else {
        this.activeIndex = this.activeIndex + 1;
      }
      this._ResumeUpOrDownDetails();
    },
    closedView() {
      //关闭详情
      this.show = false;
    },
    handleRefresh() {
      this._GetResumemanagement && this._GetResumemanagement();
    },
    handleReport(id) {
      this.userId = id;
      this.reportVisible = true;
    },
    handlePass() {
      //不合适
      this._OutResume();
    },

    handleInterviewInfo() {
      //新增面试信息
      this.innerVisible = true;
    },

    handleInterview(id) {
      //面试
      this.userId = id;
      this.outerVisible = true;
      this.interviewTag = 0;
    },
    handleMore(command) {
      //点击更多

      console.log(command);
      if (command.title == "不合适") {
        this.dialogVisible = true; //不合适弹窗
        this.resumeId = command.id;
        this.statusStr = command.statu;
        this.positionId = command.positionId;
      } else if (command.title == "举报") {
        this.userId = command.id;
        this.handleReport(command.id);
      } else if (command.title == "收藏") {
        this.userId = command.id;
        this._CollectResume();
      } else if (command.title == "取消收藏") {
        this.userId = command.id;
        this._CloseCollectResume();
      } else if ((command.title = "修改面试时间")) {
        this.interviewTag = 1;
        this.resumeId = command.id;
        this.positionId = command.positionId;
        this.outerVisible = true;
        this._GetInterviewInfo();
      }
    },
    _GetInterviewInfo() {
      //获取面试时间-用于修改
      let data = {
        resumeId: this.resumeId,
      };
      GetInterviewInfo(data).then((res) => {
        if (res.status === Code.SUCCESS_CODE) {
          this.formInfo.time = res.data.model.interViewTime;
          this.formInfo.post = res.data.model.postName;
          this.fixIndoInner.interViewContact = res.data.model.interViewContact;
          this.fixIndoInner.interViewContactPhone =
            res.data.model.interViewContactPhone;
          this.fixIndoInner.interViewAddress = res.data.model.interViewAddress;
        }
      });
    },
    /**111111 */
    changeRadio(e) {
      //选择面试信息
      this.radio = e;
    },
    handleChangeTime() {
      //修改面试时间
      if (!this.formInfo.time) {
        this.$message({
          message: "修改面试时间未选择哦",
          type: "warning",
        });
        return;
      }
      this._UpdateInterviewTime();
    },
    _UpdateInterviewTime() {
      let data = {
        type: this.type === 1 ? "jlgl" : "",
        resumeId: this.resumeId,
        time: this.formInfo.time,
        statusStr: "",
        positionId: this.positionId,
      };
      UpdateInterviewTime(data).then((res) => {
        if (res.status === Code.SUCCESS_CODE) {
          this.$message({
            message: res.message,
            type: "success",
          });
          this.userId = "";
          this.formInfo = {
            post: "",
            time: "",
          };
          this.outerVisible = false;
        } else {
          this.$message({
            message: res.message,
            type: "warning",
          });
        }
      });
    },
    handleInvited() {
      //确认邀请面试
      if (!this.radio || !this.formInfo.time || !this.formInfo.post) {
        this.$message({
          message: "必选项未选择哦",
          type: "warning",
        });
        return;
      }
      this._Invited();
    },
    _Invited() {
      let interViewContact, interViewAddress, interViewContactPhone;
      this.interviewData.forEach((item) => {
        if (item.id == this.radio) {
          interViewContact = item.interViewContact;
          interViewAddress = item.interViewAddress;
          interViewContactPhone = item.interViewContactPhone;
        }
      });
      let data = {
        userId: this.userId,
        positionId: this.formInfo.post,
        interViewContact,
        interViewAddress,
        interViewContactPhone,
        interViewDate: this.formInfo.time,
        type: this.type, //1：表示简历管理的面试邀请 2：表示海量搜索简历的面试邀请
      };
      Invited(data).then((res) => {
        if (res.status === Code.SUCCESS_CODE) {
          this.$message({
            message: res.message,
            type: "success",
          });
          this.userId = "";
          this.formInfo = {
            post: "",
            time: "",
          };
          this.radio = "";
          this.outerVisible = false;
        } else {
          this.$message({
            message: res.message,
            type: "warning",
          });
        }
      });
    },
    handleTrue() {
      //保存面试信息
      if (
        !this.formInfoInner.interViewContact ||
        !this.formInfoInner.interViewAddress ||
        !this.formInfoInner.interViewContactPhone
      ) {
        this.$message({
          message: "必填项需要输入内容",
          type: "warning",
        });
        return;
      }
      this._SaveIVInfo();
    },
    _SaveIVInfo() {
      //保存面试信息
      let data = {
        interViewContact: this.formInfoInner.interViewContact,
        interViewAddress: this.formInfoInner.interViewAddress,
        interViewContactPhone: this.formInfoInner.interViewContactPhone,
      };
      SaveIVInfo(data).then((res) => {
        if (res.status === Code.SUCCESS_CODE) {
          this.$message({
            message: "保存成功",
            type: "success",
          });
          this.innerVisible = false;
          this.formInfoInner = {
            interViewContact: "",
            interViewAddress: "",
            interViewContactPhone: "",
          };
          this._GetInterviewerInfo();
        }
      });
    },

    handleItem(index) {
      //举报时点击的项目
      this.active = index;
      this.reportInfo.itemId = this.feedBackData[index].id;
    },
    _GetFeedBackData() {
      //获取举报项目
      GetFeedBackData({}).then((res) => {
        if (res.status === Code.SUCCESS_CODE) {
          this.feedBackData = res.data;
        }
      });
    },
    _ResumeDetailsFeedback() {
      //确认举报
      let data = {
        objectId: this.userId,
        content: this.reportInfo.value,
        optionContent: this.reportInfo.itemId,
      };
      ResumeDetailsFeedback(data).then((res) => {
        if (res.status === Code.SUCCESS_CODE) {
          this.$message({
            message: "举报成功",
            type: "success",
          });
        } else {
          this.$message({
            message: res.message,
            type: "warning",
          });
        }
        this.reportInfo.value = "";
        this.active = 88;
        this.reportVisible = false;
        this.resumeId = "";
      });
    },
    handleReportTure() {
      //确认举报
      if (!this.reportInfo.value || this.active === 88) {
        this.$message({
          message: "必填项未输入内容或选择举报项目哦",
          type: "warning",
        });
        return;
      }

      this._ResumeDetailsFeedback();
    },
    _OutResume() {
      //不合适
      let data = {
        resumeId: this.resumeId,
        statusStr: "", //简历状态,新简历(1)待处理(2,3)面试(4)录用(6)不合适(5,7,8,9),注意需要带上小括号
        positionId: this.positionId,
      };
      OutResume(data).then((res) => {
        if (res.status === Code.SUCCESS_CODE) {
          this.$message({
            message: "操作成功",
            type: "success",
          });
        } else {
          this.$message({
            message: res.message,
            type: "warning",
          });
        }
        this.dialogVisible = false;
        this.resumeId = "";
        this.statusStr = ""; //简历状态
        this.positionId = ""; //职位ID
      });
    },
    _GetInterviewerInfo() {
      //获取面试信息
      GetInterviewerInfo({}).then((res) => {
        if (res.status === Code.SUCCESS_CODE) {
          this.interviewData = res.data;
        }
      });
    },
    delCard(id) {
      //删除面试信息
      let data = {
        id,
      };
      DelInterViewInfo(data).then((res) => {
        if (res.status === Code.SUCCESS_CODE) {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this._GetInterviewerInfo(); //获取面试信息
        }
      });
    },
    _CollectResume() {
      //收藏
      let data = {
        userId: this.userId,
      };
      CollectResume(data).then((res) => {
        if (res.status === Code.SUCCESS_CODE) {
          this.$message({
            message: "收藏成功",
            type: "success",
          });
          this.handleRefresh();

          this.detailsData.isCollection = 1; //修改详情数据
        } else {
          this.$message({
            message: res.message,
            type: "warning",
          });
        }
      });
    },
    _CloseCollectResume() {
      //取消收藏
      let data = {
        userId: this.userId,
      };
      CloseCollectResume(data).then((res) => {
        if (res.status === Code.SUCCESS_CODE) {
          this.$message({
            message: "取消收藏成功",
            type: "success",
          });
          this.handleRefresh();

          this.detailsData.isCollection = 0; //修改详情数据
        } else {
          this.$message({
            message: res.message,
            type: "warning",
          });
        }
      });
    },
    handleHire(data) {
      //录取
      debugger;
      let { id, statu, positionId } = data;
      this.resumeId = id;
      this.statusStr = statu;
      this.positionId = positionId;
      this._HireResume();
    },
    _HireResume() {
      let data = {
        resumeId: this.resumeId,
        statusStr: this.statusStr,
        positionId: this.positionId,
      };
      debugger;
      HireResume(data).then((res) => {
        if (res.status === Code.SUCCESS_CODE) {
          this.$message({
            message: "操作成功",
            type: "success",
          });
          this.handleRefresh();
        } else {
          this.$message({
            message: res.message,
            type: "warning",
          });
        }
      });
    },
    handleReturn(data) {
      debugger;
      let { id, statu, positionId } = data;
      this.resumeId = id;
      this.statusStr = statu;
      this.positionId = positionId;
      this._ReturnPending();
    },
    _ReturnPending() {
      let data = {
        resumeId: this.resumeId,
        statusStr: this.statusStr,
        positionId: this.positionId,
      };
      ReturnPending(data).then((res) => {
        if (res.status === Code.SUCCESS_CODE) {
          this.$message({
            message: "操作成功",
            type: "success",
          });
          this.handleRefresh();
        } else {
          this.$message({
            message: res.message,
            type: "warning",
          });
        }
      });
    },
  },

  mounted() {
    this._GetFeedBackData(); //获取举报选项
    this._GetInterviewerInfo(); //获取面试信息
  },
};
