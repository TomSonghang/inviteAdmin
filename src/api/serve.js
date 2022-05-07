import $axios from "./index";

export function GetPackageService(data) {
  //获取套餐服务
  const url = "/api/Enterprise/GetPackageService";
  return $axios.get(url, data);
}

export function GetMyGoldInfo(data) {
  //金币明细
  const url = "/api/Enterprise/GetMyGoldInfo";
  return $axios.get(url, data);
}

export function GetMyPackageService(data) {
  //我的可用服务
  const url = "/api/Enterprise/GetMyPackageService";
  return $axios.get(url, data);
}

export function BuyServiceRecord(data) {
  //购买服务记录
  const url = "/api/Enterprise/BuyServiceRecord";
  return $axios.get(url, data);
}

export function GetMyCardTicketList(data) {
  //优惠券列表
  const url = "/api/Enterprise/GetMyCardTicketList";
  return $axios.get(url, data);
}

export function GetServiceInitData(data) {
  //服务获取初始化数据
  const url = "/api/Enterprise/GetServiceInitData";
  return $axios.get(url, data);
}

export function ServiceOrGoldPayment(data) {
  //服务获取支付信息-二维码
  const url = "/api/Enterprise/ServiceOrGoldPayment";
  return $axios.post(url, data);
}

export function GetCardTicketList(data) {
  //可用的优惠券
  const url = "/api/Enterprise/GetCardTicketList";
  return $axios.get(url, data);
}
