//js获取项目根路径，如： http://localhost:8080/battcn
function rootPath() {
  //获取当前网址，如： http://localhost:8083/battcn/index.html
  const curWwwPath = window.document.location.href;
  //获取主机地址之后的目录，如： battcn/index.html
  const pathName = window.document.location.pathname;
  const pos = curWwwPath.indexOf(pathName);
  //获取主机地址，如： http://localhost:8083
  const localhostPath = curWwwPath.substring(0, pos);
  return localhostPath;
}

function projectName() {
  //获取带"/"的项目名，如：/battcn
  const pathName = window.document.location.pathname;
  return pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
}

const SWAGGER_URL = process.env.SWAGGER_URL === "" ? rootPath() : process.env.SWAGGER_URL;
const PROJECT_NAME = projectName();

/* 获取单选框数据链接 */
const SWAGGER_RESOURCES = PROJECT_NAME + '/swagger-resources';

/* 判断是否需要账号验证接口链接 */
const SWAGGER_SECURITY = PROJECT_NAME + '/v2/swagger-security';
/*  账号登录验证 */
const SWAGGER_LOGIN = PROJECT_NAME + '/v2/swagger-login';

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

export {
  SWAGGER_URL,
  PROJECT_NAME,
  SWAGGER_SECURITY,
  SWAGGER_LOGIN,
  SWAGGER_RESOURCES,
  HTTP_STATUS,
  BG,
  MESSAGES,
  POPUPS_MESSAGES
}


