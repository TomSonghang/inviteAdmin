import $axios from "./index";

export function GetResumemanagement(data) {
  //列表
  const url = "/api/Enterprise/GetResumemanagement";
  return $axios.get(url, data);
}

export function JobtypeList(data) {
  //获取简历，工作类型等固定数据
  const url = "/api/Enterprise/JobtypeList";
  return $axios.get(url, data);
}

export function GetPositionDropDownList(data) {
  //获取筛选职位
  const url = "/api/Enterprise/GetPositionDropDownList";
  return $axios.get(url, data);
}

export function SaveIVInfo(data) {
  //保存面试信息
  const url = "/api/Enterprise/SaveIVInfo";
  return $axios.post(url, data);
}

export function Invited(data) {
  //邀请面试
  const url = "/api/Enterprise/Invited";
  return $axios.post(url, data);
}

export function OutResume(data) {
  //简历不合适
  const url = "/api/Enterprise/OutResume";
  return $axios.post(url, data);
}

export function GetFeedBackData(data) {
  //获取举报项目
  const url = "/api/Enterprise/GetFeedBackData";
  return $axios.get(url, data);
}

export function ResumeDetailsFeedback(data) {
  //确定举报
  const url = "/api/Enterprise/ResumeDetailsFeedback";
  return $axios.post(url, data);
}

export function CollectResume(data) {
  //简历收藏
  const url = "/api/Enterprise/CollectResume";
  return $axios.post(url, data);
}

export function CloseCollectResume(data) {
  //取消收藏
  const url = "/api/Enterprise/CloseCollectResume";
  return $axios.post(url, data);
}

export function GetInterviewerInfo(data) {
  //获取面试信息
  const url = "/api/Enterprise/GetInterviewerInfo";
  return $axios.get(url, data);
}

export function DelInterViewInfo(data) {
  //删除面试记录信息
  const url = "/api/Enterprise/DelInterViewInfo";
  return $axios.post(url, data);
}

export function HireResume(data) {
  //录用
  const url = "/api/Enterprise/HireResume";
  return $axios.post(url, data);
}

export function UpdateInterviewTime(data) {
  //修改面试时间
  const url = "/api/Enterprise/UpdateInterviewTime";
  return $axios.post(url, data);
}
export function GetInterviewInfo(data) {
  //修改面试时间-获取数据
  const url = "/api/Enterprise/GetInterviewInfo";
  return $axios.get(url, data);
}

export function ReturnPending(data) {
  //返回待处理
  const url = "/api/Enterprise/ReturnPending";
  return $axios.post(url, data);
}
