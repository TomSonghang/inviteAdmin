import $axios from "./index";

export function GetAccess_token(data) {
  //账号登录
  let url = "/api/Enterprise/Login";
  return $axios.post(url, data);
}

export function GetLoginSecurityCode(data) {
  //账号登录
  let url = "/api/Enterprise/GetLoginSecurityCode";
  return $axios.post(url, data);
}
