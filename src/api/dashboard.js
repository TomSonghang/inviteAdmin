import $axios from "./index";

export function EnterpriseWorkStand() {
  //工作台
  const url = "/api/Enterprise/EnterpriseWorkStand";
  return $axios.get(url);
}

export function InterviewMore() {
  //获取更多日历
  const url = "/api/Enterprise/InterviewMore";
  return $axios.get(url);
}
