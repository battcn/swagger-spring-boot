/* 对象拷贝 */
const deepCopy = function (source) {
  let result = "";
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
}
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
}
export {
  deepCopy, basicTypeInit
}
