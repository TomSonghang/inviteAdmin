import $axios from "./index";

export function PositionManagementList(data) {
  //职位列表
  const url = "/api/Enterprise/PositionManagementList";
  return $axios.get(url, data);
}

export function UpdateJobStatus(data) {
  //上下线职位
  const url = "/api/Enterprise/UpdateJobStatus";
  return $axios.post(url, data);
}

export function CommonConvertBoutiqueJob(data) {
  //转精品
  const url = "/api/Enterprise/CommonConvertBoutiqueJob";
  return $axios.post(url, data);
}

export function RefreshJob(data) {
  //刷新
  const url = "/api/Enterprise/RefreshJob";
  return $axios.post(url, data);
}

export function GetPostNum(data) {
  //获取精品职位和普通职位
  const url = "/api/Enterprise/GetPostNum";
  return $axios.get(url, data);
}
