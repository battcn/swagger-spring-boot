/* 对象拷贝 */
const deepCopy = function (source) {
  let result = "";
  if (source === undefined || source === null) {
    return undefined;
  }
  if (typeof source === 'object') {
    if (source.constructor === Array) {
      return treatArray(source);
    }
    return treatObj(source);
    // return JSON.parse(JSON.stringify(source));
  } else {
    return source;
  }

  function treatObj(source) { //处理对象类型
    result = {};
    for (let key in source) {
      result[key] = deepCopy(source[key]);
      // result[key] = val?val:{};
    }
    return result;
  }

  function treatArray(source) { //处理list数组类型
    result = [];
    for (let key in source) {
      result.push(deepCopy(source[key]));
    }
    return result;
  }

  function treatBasic(source) { //处理基本类型
    result = source;
    return result;
  }
};
/* 传入参数类型名字，返回该类型初始化的值 */
const basicTypeInit = function (type) {
  if (type === 'integer' || type === 'number') {
    return 0;
  }
  if (type === 'boolean') {
    return 'false'
  }
  if (type === 'string') {
    return ""
  }
  if (type === 'array') {
    return []
  }
  if (type === 'file') {
    return {type: "file", in: "formData"}
  }
};
const formatterJson=function (text_value) {/*JSON数据格式化(将其以 上下展开形式 返回) */
  let res = "";
  for (let i = 0, j = 0, k = 0, ii, ele; i < text_value.length; i++) {//k:缩进，j:""个数
    ele = text_value.charAt(i);
    if (j % 2 === 0 && ele === "}") {
      k--;
      for (ii = 0; ii < k; ii++) ele = "    " + ele;
      ele = "\n" + ele;
    }
    else if (j % 2 === 0 && ele === "{") {
      ele += "\n";
      k++;
      //debugger;
      for (ii = 0; ii < k; ii++) ele += "    ";
    }
    else if (j % 2 === 0 && ele === ",") {
      ele += "\n";
      for (ii = 0; ii < k; ii++) ele += "    ";
    }
    else if (ele === "\"") j++;
    res += ele;
  }
  return res;
};
export {
  deepCopy, basicTypeInit,formatterJson
}
