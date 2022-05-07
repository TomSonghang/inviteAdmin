import $axios from "./index";

export function ResumeSearch(data) {
  //搜索人才
  const url = "/api/Enterprise/ResumeSearch";
  return $axios.get(url, data);
}

export function CityList(data) {
  //获取城市
  const url = "/api/Enterprise/CityList";
  return $axios.get(url, data);
}

export function GetPositionDropDownList(data) {
  //获取职位
  const url = "/api/Enterprise/GetPositionDropDownList";
  return $axios.get(url, data);
}
