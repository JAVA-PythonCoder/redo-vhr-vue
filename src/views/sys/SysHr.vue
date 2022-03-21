<template>
	<div>
		<div style="display: flex; justify-content: center">
			<el-input v-model="hrName" placeholder="请通过用户名搜索" prefix-icon="el-icon-search" style="width: 400px; margin-right: 5px"></el-input>
			<el-button type="primary" icon="el-icon-search">搜索</el-button>
		</div>
		<div style="display: flex; flex-wrap: wrap; margin-top: 10px; justify-content: space-around">
			<el-card class="box-card" v-for="(hr, index) in hrs" :key="index" style="width: 350px; margin-bottom: 20px">
				<div slot="header" class="clearfix">
					<span>{{ hr.name }}</span>
					<el-button style="float: right; padding: 3px 0; color: red" icon="el-icon-delete"></el-button>
				</div>
				<div>
					<div style="width: 100%; display: flex; justify-content: center">
						<img :src="hr.userface" :alt="hr.name" :title="hr.name">
					</div>
					<div class="userinfo-container">
						<div>用户名：{{ hr.name }}</div>
						<div>手机号：{{ hr.phone }}</div>
						<div>电话号码：{{ hr.telephone }}</div>
						<div>地址：{{ hr.address }}</div>
						<div>用户状态：<el-switch
								v-model="hr.enabled"
								active-text="启用"
								inactive-text="禁用"
								@change="enabledChange(hr)">
						</el-switch></div>
						<div>用户角色：
							<el-tag v-for="(role, indexj) in hr.roles" :key="indexj" style="margin-left: 5px">{{role.nameZh}}</el-tag>
							<!-- show、hide是el-popover事件，前者表示显示popover时触发，后者表示popover隐藏时触发；trigger表示如何显示popover							-->
							<el-popover
									style="margin-left: 5px"
									@show="initOptions(hr)"
									@hide="updateHrRole(hr)"
									placement="right"
									title="用户角色"
									width="200"
									trigger="click">
								<!-- el-select中multiple属性表示下拉选项是否多选，如果多选则selectedRoles值为一个数组接收el-option的value属性值	-->
								<el-select v-model="selectedRoles" multiple placeholder="请选择角色">
									<!-- el-option下拉选项，value	表示选项的值通过传给selectedRoles，由其提交回服务器，label表示选项的标签 -->
									<el-option
											v-for="(item, indexk) in allRoles"
											:key="indexk"
											:label="item.nameZh"
											:value="item.id">
									</el-option>
								</el-select>
								<el-button slot="reference" type="text" icon="el-icon-more"></el-button>
							</el-popover>
						</div>
						<div>
							备注：
						</div>
					</div>
				</div>
			</el-card>
		</div>
	</div>

</template>

<script>
export default {
	name: "SysHr",
	data() {
		return {
			selectedRoles: [],
			selectedRolesBk: [],
			allRoles: [],
			hrName: '',
			hrs: []
		}
	},
	mounted() {
		this.initHrs();
	},
	methods: {
		arrSort(a, b) {
			return a - b;
		},
		// popover隐藏时触发更新hr的角色
		updateHrRole(hr) {
			let url = '/system/hr/role?hrId=' + hr.id;
			this.selectedRoles.forEach(id => {
				url += '&roleIds=' + id;
			});
			this.putRequest(url).then(resp => {
				if (resp) {
					this.initHrs();
				}
			})
		},
		initOptions(hr) {
			// 初始el-option的下拉选项
			this.initAllRoles();
			// 根据当前el-card的角色，初始化el-select里的selectedRoles用于预显示角色信息
			let roles = hr.roles;
			this.selectedRoles = [];
			roles.forEach(role => {
				this.selectedRoles.push(role.id);
				this.selectedRolesBk.push(role.id);
			})
			
		},
		initAllRoles() {
			this.getRequest('/system/hr/roles').then(resp => {
				if (resp) {
					this.allRoles = resp;
				}
			});
		},
		enabledChange(hr) {
			// 因为el-switch的状态绑定在hr.enabled上，所以传入hr获取最新的hr状态信息
			console.log(hr);
			// 后端返回的数据是hr的代理对象，多了一些权限认证相关属性，而roles属性后端更新hr是否启用时不需要，需要删除该属性
			delete hr.roles;
			this.putRequest('/system/hr/', hr);
		},
		initHrs() {
			this.getRequest('/system/hr/').then(resp => {
				if (resp) {
					this.hrs = resp;
				}
			})
		}
	}
}
</script>

<style>
	.userinfo-container div {
		font-size: 12px;
		color: #8d9fff;
	}
	.userinfo-container{
		margin-top: 20px;
	}

</style>
