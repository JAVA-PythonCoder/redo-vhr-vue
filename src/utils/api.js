// axios是vue主流网络请求工具，用于处理前后端网络交互。
import axios from "axios";
// element-ui的message对象用于处理弹框信息。统一解决不同页面网络请求弹框差异，避免在不同页面获取DOM处理。
import { Message } from 'element-ui';


// 本api用于封装全局的前后端网络交互（前端请求、后端响应），同时统一网络交互成功与否的弹框位置和显示的信息

// axios.interceptors用于添加网络拦截器（适用于request、response）,use()方法有两个回调函数，第一个参数为success的匿名回调函数表示成功回调、第二个参数为error的匿名回调函数表示失败回调

// 定义响应拦截器
// axios.interceptors用于拦截网络请求/响应，所以其成功、失败是根据html响应码来区分的。所以在html 200响应码中也可能存在业务失败（业务操作失败），html响应码只是服务器对请求的响应，而不涉及服务端业务层面，但错误一定是服务出错了
axios.interceptors.response.use(success => {
	// success.status表示html响应状态码，而success.data是后端响应的JSON对象，status、msg都是JSON对象的属性
	if (success.status && success.status == 200 && success.data.status == 500) {
		// 服务器响应成功，但返回的JSON对象里的响应码为失败，表示业务处理失败，并弹框
		Message.error({message: success.data.msg});
		// 存在业务失败，无任何返回，则在请求调用的地方将拿不到任何数据
		return;
	}
	// 无业务失败，则返回后端返回的JSON对象，在请求调用的地方就能拿到后端返回的数据
	return success.data;

}, error => {
	// 错误响应，即html状态码非200的。
	// error.response获取错误响应对象，错误响应对象也是后端返回的JSON字符串
	if (error.response.status == 504) {
		Message.error({message: '充当网关或代理的服务器，未及时从远端服务器获取请求'})
	} else if (error.response.status == 404) {
		Message.error({message: '服务器无法根据客户端的请求找到资源'})
	} else if (error.response.status == 403) {
		Message.error({message: '服务器理解请求客户端的请求，但是拒绝执行此请求'})
	}else if (error.response.status == 401) {
		Message.error({message: '请求要求用户的身份认证'})
	} else {
		if (error.response.data.msg) {
			Message.error({message: error.response.data.msg});
		} else {
			Message.error({message: '未知错误'})
		}
	}
	return;

});

// 定义post请求封装
let base = '';

// 导出请求封装模块，因为spring security默认仅支持key-value形式的传参登录认证方式。url指定请求地址，params请求传递的参数（JSON对象）
export const postKeyValueRequest = (url, params) => {
	// 利用axios封装请求
	return axios({
		// method指定请求方式
		method: 'post',
		// url指定请求地址
		url: `${base}${url}`,
		// url: url，以上是参数拼接格式
		// data指定请求传递的参数，默认是JSON格式
		data: params,
		// transformRequest对请求的数据格式做转换，transformRequest和transformResponse必须要返回一个字符串，或 ArrayBuffer，或 Stream
		transformRequest: [
			function (data) {
				let ret = '';
				for (let i in data) {
					// encodeURIComponent()将一个 string、number、boolean、null，undefined 或者任何 object作为URI组件进行编码，其只会对特殊字符进行编码，以便后台能正确接收
					// 将data JSON对象拼接为key1=value1$key2=value2...的形式
					ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&';
				}
				return ret;
			}
		],
		// header定义请求头
		header: {
			// Content-Type指定网络文件的类型和网页的编码
			'Content-Type': 'application/x-www-form-urlencoded'
			
		}
		
	});
}
