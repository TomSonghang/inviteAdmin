import $axios from "./index";

export function CreateWithGroup(data) {
  //创建炒更团
  const url = "/api/Enterprise/CreateWithGroup";
  return $axios.post(url, data);
}
