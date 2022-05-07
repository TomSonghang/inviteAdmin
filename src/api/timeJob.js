import $axios from "./index";

export function WithGroupList(data) {
  //炒更团列表
  const url = "/api/Enterprise/WithGroupList";
  return $axios.get(url, data);
}

export function GetWithGroupDetails(data) {
  //炒更团详情
  const url = "/api/Enterprise/GetWithGroupDetails";
  return $axios.get(url, data);
}

export function WithGroupPtaway(data) {
  //炒更团上架
  const url = "/api/Enterprise/WithGroupPtaway";
  return $axios.post(url, data);
}

export function FinishRecruit(data) {
  //完成招募
  const url = "/api/Enterprise/FinishRecruit";
  return $axios.post(url, data);
}

export function CloseWithGroup(data) {
  //关闭招募
  const url = "/api/Enterprise/CloseWithGroup";
  return $axios.post(url, data);
}

export function HireResume(data) {
  //关闭招募
  const url = "/api/Enterprise/HireResume";
  return $axios.post(url, data);
}
