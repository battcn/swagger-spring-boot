/**
 * json数据格式化缩进(带dom标签，字体颜色)
 * @param json数据
 * @returns {} 缩进后的json数据
 */
const syntaxHighlight = function (json) {
  if (json === undefined) {
    return undefined;
  }
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    var cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}
/**
 * 显示提示
 * @param hint 显示的提示语内容
 */
const promptPopUpShow = function (hint) {/*  */
  this.$layer.msg(hint, {time: 2});
}
/**
 * 对象拷贝
 * @param source 对象类型数据
 * @returns {*} 深层拷贝生成的对象类型数据
 */
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

  /**
   * 对象类型数据的复制
   * @param source  对象类型数据
   * @returns {*} 深层拷贝生成的单个对象类型数据
   */
  function treatObj(source) { //
    result = {};
    for (let key in source) {
      result[key] = deepCopy(source[key]);
      // result[key] = val?val:{};
    }
    return result;
  }

  /**
   * list数组类型数据的拷贝
   * @param source list数组类型数据
   * @returns [] 深层拷贝生成的单个list数组类型数据
   */
  function treatArray(source) { //处理
    result = [];
    for (let key in source) {
      result.push(deepCopy(source[key]));
    }
    return result;
  }

  /**
   * 处理基本类型拷贝
   * @param source 基本类型数据
   * @returns string || Boolean || Number 拷贝生成的单个基本类型数据
   */
  function treatBasic(source) { //
    result = source;
    return result;
  }
};
/**
 * 传入参数类型名字，返回该类型初始化的值
 * @param type 参数类型名字
 * @returns {*} 该类型初始化的值
 */
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
/**
 * JSON数据格式化(将其以 上下展开形式 返回，不带dom标签及颜色)
 * @param text_value JSON数据
 * @returns string 格式化缩进后的json字符串
 */
const formatterJson = function (text_value) {/* */
  if (text_value === undefined) {
    return undefined;
  }
  let res = "";
  for (let i = 0, j = 0, k = 0, ii, ele; i < text_value.length; i++) {//k:缩进，j:""个数
    ele = text_value.charAt(i);
    if (j % 2 === 0 && (ele === "}" || ele === "]")) {
      k--;
      for (ii = 0; ii < k; ii++) ele = "    " + ele;
      ele = "\n" + ele;
    }
    else if (j % 2 === 0 && (ele === "{" || ele === "[")) {
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
  deepCopy, basicTypeInit, formatterJson, promptPopUpShow, syntaxHighlight
}
