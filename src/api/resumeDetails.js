import $axios from "./index";

export function ResumeUpOrDownDetails(data) {
  //简历详情
  const url = "/api/Enterprise/ResumeUpOrDownDetails";
  return $axios.get(url, data);
}

export function CompanySeeContactWay(data) {
  //企业查看联系方式
  const url = "/api/Enterprise/CompanySeeContactWay";
  return $axios.get(url, data);
}

export function GetServiceLevel(data) {
  //获取服务等级并提示
  const url = "/api/Enterprise/GetServiceLevel";
  return $axios.get(url, data);
}
