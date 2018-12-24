//js获取项目根路径，如： http://localhost:8080/battcn
const getBaseURL = () => {
  const urlMatches = /(.*)\/swagger-ui.html.*/.exec(window.location.href);
  return urlMatches[1];
};

const SWAGGER_URL = getBaseURL();


//const SWAGGER_URL = getBaseURL();
/* 获取单选框数据链接 */
const SWAGGER_RESOURCES = SWAGGER_URL + '/swagger-resources';

/* 判断是否需要账号验证接口链接 */
const SWAGGER_SECURITY = SWAGGER_URL + '/v3/swagger-security';
/*  账号登录验证 */
const SWAGGER_LOGIN = SWAGGER_URL + '/v3/swagger-login';

/* 响应码 */
const HTTP_STATUS = {min: 200, max: 299, logCode: 401};
/* 颜色 */
const BG = {GET: '#D1EAFF', POST: '#D1FED3', PATCH: '#FFE2D2', DELETE: '#FFD1D1', PUT: "#F0E0CA"}
/* 消息提示语 */
const MESSAGES = {
  ERROR: "请求发送失败",
  SUCCESS: "请求发送成功  ",
  PERMISSION_ERROR: '身份验证失败啦,请进行身份验证后使用！',
  LOAD_STATUS: '加载失败'
};
/* 弹窗提示语 */
const POPUPS_MESSAGES = {
  SUCCESS: "修改 X-Authorization 成功",
  REQUIRED: "为必选字段",
  FORMAT_JSON: "   不为JSON格式，请重新输入！"
}
/* 对象色阶 */
const BGFORM = ["#FFFFFF", "#F5F5F5", "#E6E6E6", "#CCCCCC", "#C9C9C9", "#C2C2C2"];

export {
  SWAGGER_URL,
  SWAGGER_SECURITY,
  SWAGGER_LOGIN,
  SWAGGER_RESOURCES,
  HTTP_STATUS,
  BG,
  MESSAGES,
  POPUPS_MESSAGES,
  BGFORM
}


