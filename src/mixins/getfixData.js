import { JobtypeList } from "@/api/resume";
import { EnterpriseWelfare } from "@/api/postJob";
/**
 * 后台有些固定的数据（基本不会变）存在本地了，每次需要用到的地方引用一下mixin即可
 */
export default {
  data() {
    return {
      fixWorkType: [], //工作类型
      fixJobtypeList: [], //职位类型
      fixJobStatus: [], //工作状态
      fixExperienceYea: [], //工作经验
      fixAcademicRequirements: [], //学历
      fixWelfareOption: [], //福利待遇
    };
  },
  mounted() {
    this.getFixData();
  },
  methods: {
    async getFixData() {
      let fixData;
      if (!localStorage.getFixData) {
        //是否有固定数据
        let data = {};
        let res1 = await JobtypeList({});
        Object.assign(data, {
          fixWorkType: res1.data.workType,
          fixJobtypeList: res1.data.jobtypeList,
          fixJobStatus: res1.data.jobStatus,
          fixExperienceYea: res1.data.experienceYear,
          fixAcademicRequirements: res1.data.academicRequirements,
        });
        let res2 = await EnterpriseWelfare({ welfare: "" });
        Object.assign(data, {
          fixWelfareOption: res2.data.allData,
        });
        //获取福利待遇

        localStorage.setItem("getFixData", JSON.stringify(data));
      }

      fixData = localStorage.getItem("getFixData");
      fixData = JSON.parse(fixData);
      this.fixWorkType = fixData.fixWorkType;
      this.fixJobtypeList = fixData.fixJobtypeList;
      this.fixJobStatus = fixData.fixJobStatus;
      this.fixExperienceYea = fixData.fixExperienceYea;
      this.fixAcademicRequirements = fixData.fixAcademicRequirements;
      this.fixWelfareOption = fixData.fixWelfareOption;
    },
  },
};
