import $axios from "./index";

export function CreateWithGroup(data) {
  //创建炒更团
  const url = "/api/Enterprise/CreateWithGroup";
  return $axios.post(url, data);
}

export function GetJobOffers(data) {
  //获取职位信息
  const url = "/api/Enterprise/GetJobOffers";
  return $axios.get(url, data);
}

export function GetWithGroupPriceByEndDateTime(data) {
  //获取职位信息
  const url = "/api/Enterprise/GetWithGroupPriceByEndDateTime";
  return $axios.get(url, data);
}
