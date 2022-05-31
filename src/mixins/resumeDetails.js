import {
  ResumeUpOrDownDetails,
  CompanySeeContactWay,
  GetServiceLevel,
} from "@/api/resumeDetails";
import { GetPositionDropDownList } from "@/api/resume";
import Code from "@/api/statusCode";
export default {
  data() {
    return {
      show: false, //详情是否显示
      detailsDataObj: {}, //简历详情
      userId: "", //以后可能需要打开详情
      activeIndex: 1, //行标
      flag: "", //详情左右标识

      key: "",
      gender: "不限",
      educationalBackground: "不限",
      workYears: "不限",
      jobType: "不限",
      orderby: "",
      postType: "",
      cityName: "全国",
      postTypeArray: [], //应聘岗位

      //验证
      rulesReport: {
        //举报
        value: [{ required: true, message: "请输入举报内容", trigger: "blur" }],
      },
      rulesInner: {
        //添加面试信息
        interViewContact: [
          { required: true, message: "请输入联系人", trigger: "blur" },
        ],
        interViewContactPhone: [
          { required: true, message: "请输入联系方式", trigger: "blur" },
          { min: 11, max: 11, message: "11位的手机号哦", trigger: "blur" },
        ],
        interViewAddress: [
          { required: true, message: "请输入联系地址", trigger: "blur" },
        ],
      },
      resumeType: 3,
      interViewTime: "",
    };
  },
  mounted() {
    this._GetPositionDropDownList(); //发布的职位列表
  },
  methods: {
    _GetPositionDropDownList() {
      //筛选职位
      GetPositionDropDownList({}).then((res) => {
        if (res.status === Code.SUCCESS_CODE) {
          this.postTypeArray = res.data;
        }
      });
    },
    checkPhone(id) {
      //查看手机号
      this.userId = id;
      this._GetServiceLevel();
    },
    _GetServiceLevel() {
      let data = {
        userId: this.userId,
      };
      GetServiceLevel(data).then((res) => {
        if (res.status === Code.SUCCESS_CODE) {
          this.$confirm(`${res.data[0].tipText}`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this._CompanySeeContactWay();
            })
            .catch(() => {});
        }
      });
    },
    _CompanySeeContactWay() {
      let data = {
        userId: this.userId,
      };
      CompanySeeContactWay(data).then((res) => {
        if (res.status === Code.SUCCESS_CODE) {
          this.$message({
            type: "success",
            message: "购买成功",
          });
          this.detailsData.mobile = res.data.phone;
          this.detailsData.realName = res.data.realName;
        } else if (res.status === 1007) {
          this.$confirm(`${res.message}`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.$router.push({
                name: "Serve",
              });
            })
            .catch(() => {});
        } else {
          this.$message({
            type: "warning",
            message: res.message,
          });
        }
      });
    },
    closedView() {
      //关闭详情
      this.show = false;
    },
    nextPrv(data) {
      //详情上一页下一页
      console.log(data);
      this.flag = data;
      if (data == "up") {
        if (this.activeIndex === 1) {
          //第一个了
          this.$message({
            message: "该简历已经是第一位了，不能再往上了",
            type: "warning",
          });
          return;
        }
        this.activeIndex = this.activeIndex - 1;
      } else {
        if (this.activeIndex === this.total) {
          //第一个了
          this.$message({
            message: "该简历已经是最后一位了，不能再往下了",
            type: "warning",
          });
          return;
        }

        this.activeIndex = this.activeIndex + 1;
      }
      this._ResumeUpOrDownDetails();
    },
    handleView(data) {
      debugger
      let {
        id,
        row,
        status,
        resumeId,
        interViewTime,
        jobType,
        workYears,
        educationalBackground,
        resumeType,
        orderby,
      } = data;
      this.interViewTime = interViewTime || "";
      this.jobType = jobType || "";
      this.workYears = workYears || "";
      this.educationalBackground = educationalBackground || "";
      this.resumeType = resumeType || 0;

      this.orderby = orderby || "";

      //查看简历
      this.resumeId = resumeId || ""; //简历ID
      this.statusStr = status || ""; //简历状态
      this.userId = id;
      this.activeIndex = row;
      this.flag = ""; //初始化
      this._ResumeUpOrDownDetails();
    },
    _ResumeUpOrDownDetails() {
      //获取简历详情

      let data = {
        //为什么写了很多 || ，那是因为搜索人才和简历人才共用方法
        userId: this.flag ? "" : this.userId, //flag有值代表是点击了左右键
        key: this.key, //推荐关键字        //cnm
        strGender: this.gender, //strGender
        strEducationalBackground:
          this.educationalBackground == "学历" ||
          this.educationalBackground == "不限"
            ? ""
            : this.educationalBackground, //学历要求
        strWorkYears:
          this.workYears == "工作经验" || this.workYears == "不限"
            ? ""
            : this.workYears, //工作经验
        strJobType:
          this.jobType == "工作类型" || this.jobType == "不限"
            ? ""
            : this.jobType, //工作类型
        cityName: this.cityName == "全国" ? "" : this.cityName, //城市名称
        postType: this.postType == "应聘岗位" ? "" : this.postType, //职位分类
        upOrDown: this.flag, //up"为向左 "down"为向右
        row: this.activeIndex,
        searchType: this.searchType, //(1简历搜索，2人才搜索)
        jobStatus: this.jobStatus == "求职状态" ? "" : this.jobStatus, //求职状态(只有简历管理才需要传递)
        resumeId: this.flag ? "" : this.resumeId, //简历ID(只有简历管理才需要传递)

        //后期需要新增的
        orderby: this.orderby,

        interViewTime: this.interViewTime,
        resumeType: this.resumeType,
      };
      ResumeUpOrDownDetails(data).then((res) => {
        if (res.status === Code.SUCCESS_CODE) {
          this.detailsDataObj = res.data;
          this.show = true;
          document.documentElement.style.overflow = "hidden"; //禁止背面滚动
        } else {
          this.$message({
            message: res.message,
            type: "warning",
          });
        }
      });
    },
  },
};
