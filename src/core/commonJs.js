/*
* @Author: dxx
* @Email: dxxtalking@163.com
* @Date:   2020-12-31 10:11:11
* @Last Modified by:   dxx
* @Last Modified time: 2021-02-04 15:05:33
*/
let commonJs = {
  isEmpty(v) {
    switch (typeof v) {
    case 'undefined':
        return true;
    case 'string':
        if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
        break;
    case 'boolean':
        if (!v) return true;
        break;
    case 'number':
        if (0 === v || isNaN(v)) return true;
        break;
    case 'object':
        if (null === v || v.length === 0) return true;
        for (var i in v) {
            return false;
        }
        return true;
    }
    return false;
  },
	// 验证密码不含特殊字符
	checkSpecialKey(str) {
	  var specialKey = "[`~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";
	  for (var i = 0; i < str.length; i++) {
	    if (specialKey.indexOf(str.substr(i, 1)) != -1) {
	      return false;
	    }
	  }
	  return true;
	},

  // 验证座机和传真
	checkTel(rule, value, callback){
    if (!value) {
      return callback(new Error('座机或传真不能为空'));
    } else {
    	const reg = /^(\d{3,4}-)?\d{7,8}$/;//座机和传真格式是一样的：区号-号码
      if (reg.test(value)) {
        callback();
      } else {
        return callback(new Error('请输入座机或传真'));
      }
    }
  },

	// 验证手机号
	checkPhone(rule, value, callback){
    // if (!value) {
    //   return callback(new Error('手机号不能为空'));
    // } else {
    //   const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
    //   if (reg.test(value)) {
    //     callback();
    //   } else {
    //     return callback(new Error('请输入正确的手机号'));
    //   }
    // }
    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
    if (reg.test(value)) {
      callback();
    } else {
      return callback(new Error('请输入正确的手机号'));
    }
  },

  // 验证邮箱
	checkEmail(rule, value, callback){
    // if (!value) {
    //   return callback(new Error('邮箱不能为空'));
    // } else {
    //   const reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
    //   if (reg.test(value)) {
    //     callback();
    //   } else {
    //     return callback(new Error('请输入正确的邮箱格式'));
    //   }
    // }
    const reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
    if (reg.test(value)) {
      callback();
    } else {
      return callback(new Error('请输入正确的邮箱格式'));
    }
  },

  // 验证身份证号码
	checkIdentityCard(rule, value, callback){
    if (!value) {
      return callback(new Error('身份证号不能为空'));
    } else {
    	const reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[0-2])(([0-2][1-9])|10|20|30|31)\d{3}(\d|X|x)$/;
      if (reg.test(value)) {
        callback();
      } else {
        return callback(new Error('请输入正确的身份证格式'));
      }
    }
  },

  // 验证价格
	checkPrice(rule, value, callback){
    if (!value) {
      return callback(new Error('价格不能为空'));
    } else {
    	var reg = /^-?\d{1,4}(?:\.\d{1,2})?$/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("数字格式:0-9999或小数点后可加1到2位"));//如:1 或1.8 或1.85
      }
    }
  },

  // 验证密码
  checkPassword(rule, value, callback){
    var passwordreg = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,16}/
    if (!passwordreg.test(value)) {
      callback(new Error('密码必须由数字、字母、特殊字符组合,请输入6-16位'))
    }else{
      callback()
    }
  }

};
export default commonJs;
