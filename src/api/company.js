import $axios from "./index";

export function CompanyInformation(data) {
  //公司数据信息
  const url = "/api/Enterprise/CompanyInformation";
  return $axios.get(url, data);
}

export function UpdateHeadPortrait(data) {
  //修改头像
  const url = "/api/Enterprise/UpdateHeadPortrait";
  return $axios.post(url, data);
}

export function UpdateCompanyIntroduction(data) {
  //更新公司基础信息
  const url = "/api/Enterprise/UpdateCompanyIntroduction";
  return $axios.post(url, data);
}

export function UpdateCompanyInformation(data) {
  //更新公司介绍
  const url = "/api/Enterprise/UpdateCompanyInformation";
  return $axios.post(url, data);
}

export function UpdateTeamStyle(data, config) {
  //更新团队风采
  const url = "/api/Enterprise/UpdateTeamStyle";
  return $axios.post(url, data, config);
}

export function UpdateCompanyBusinesInfo(data, config) {
  //新增或修改公司业务信息
  const url = "/api/Enterprise/UpdateCompanyBusinesInfo";
  return $axios.post(url, data, config);
}

export function GetDjtCompanyClassifyInfo(data) {
  //获取公司经营模式信息
  const url = "/api/Enterprise/GetDjtCompanyClassifyInfo";
  return $axios.get(url, data);
}

export function GetCompanyBusinesInfoTag(data) {
  //获取公司企业标签
  const url = "/api/Enterprise/GetCompanyBusinesInfoTag";
  return $axios.get(url, data);
}
