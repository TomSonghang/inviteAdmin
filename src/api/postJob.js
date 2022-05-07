import $axios from "./index";

export function SaveJobOffers(data) {
  const url = "/api/Enterprise/SaveJobOffers";
  return $axios.post(url, data);
}

export function EnterpriseWelfare(data) {
  //福利待遇
  const url = "/api/Enterprise/EnterpriseWelfare";
  return $axios.get(url, data);
}

export function JobAddOrEditInit(data) {
  //职位详情  -   编辑
  const url = "/api/Enterprise/JobAddOrEditInit";
  return $axios.get(url, data);
}
