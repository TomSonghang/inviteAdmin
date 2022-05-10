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

export function SetApplyStatus(data) {
  //录用，淘汰
  const url = "/api/Enterprise/SetApplyStatus";
  return $axios.post(url, data);
}

export function ReplyEstimate(data) {
  //评价
  const url = "/api/Enterprise/ReplyEstimate";
  return $axios.post(url, data);
}

export function GetFeedBackDataBase(data) {
  //获取评价数据
  const url = "/api/Enterprise/GetFeedBackDataBase";
  return $axios.post(url, data);
}

export function ServicePayInit(data) {
  //炒更初始化内容
  const url = "/api/Enterprise/ServicePayInit";
  return $axios.get(url, data);
}

export function PartTimePayment(data) {
  //兼职支付(预支付)
  const url = "/api/Enterprise/PartTimePayment";
  return $axios.post(url, data);
}

export function PayStatus(data) {
  //订单支付状态查询
  const url = "/api/Enterprise/PayStatus";
  return $axios.post(url, data);
}
