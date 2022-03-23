<template>
	<div>
		<!-- display: flex容器内组件水平分布，justify-content: space-between表示组件之间两边对其分布	-->
		<div style="display: flex; justify-content: space-between">
			<div style="display: flex">
				<!-- el-input的clearable属性表示输入信息搜索后显示清空图标，clear事件绑定点击清空图标会触发的动作 -->
				<el-input
						placeholder="通过员工姓名搜索员工，可回车搜索..."
						prefix-icon="el-icon-search" style="width: 300px; margin-right: 10px"
						clearable
						@clear="clear"
						v-model="keywords"
						@keydown.enter.native="searchEmployee"></el-input>
				<el-button icon="el-icon-search" type="primary" @click="searchEmployee">搜索</el-button>
				<el-button type="primary">
					<!-- i元素是font awesome的图标元素，需要项目中引入font awesome -->
					<i class="fa fa-angle-double-down" aria-hidden="true"></i>
					高级搜索</el-button>
			</div>
			<div style="display: flex">
				<el-button type="success">
					<i class="fa fa-arrow-circle-up" aria-hidden="true"></i>
					导入数据</el-button>
				<el-button type="success">
					<i class="fa fa-arrow-circle-down" aria-hidden="true"></i>
					导出数据</el-button>
				<el-button type="primary">
					<i class="fa fa-plus" aria-hidden="true"></i>
					添加员工</el-button>
			</div>
			
		</div>
		<div style="margin-top: 10px">
			<!-- max-height规定表格的高度，当数据高度大于表格高度时会有移动条浏览	-->
			<el-table
					:data="emps"
					v-loading="loading"
					element-loading-text="拼命加载中"
					element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(0, 0, 0, 0.8)"
					stripe
					border
					max-height="800px"
					style="width: 100%">
				<!-- el-table-column的属性fixed表示列固定方式，align表示列数据排列方式（左对齐、居中、右对齐）-->
				<el-table-column
						type="selection"
						fixed="left"
						align="center"
						width="40">
				</el-table-column>
				<el-table-column
						prop="name"
						fixed="left"
						align="center"
						label="姓名"
						width="100px">
				</el-table-column>
				<el-table-column
						prop="workId"
						fixed="left"
						align="center"
						label="工号"
						width="90">
				</el-table-column>
				<el-table-column
						prop="gender"
						align="center"
						label="性别"
						width="50">
				</el-table-column>
				<el-table-column
						prop="birthday"
						align="center"
						label="出生日期"
						width="120">
				</el-table-column>
				<el-table-column
						prop="idCard"
						align="center"
						label="身份证号码"
						width="180">
				</el-table-column>
				<el-table-column
						prop="wedlock"
						align="center"
						label="婚姻状况"
						width="80">
				</el-table-column>
				<el-table-column
						prop="nation.name"
						align="center"
						label="民族"
						width="80">
				</el-table-column>
				<el-table-column
						prop="nativePlace"
						align="center"
						label="籍贯"
						width="50">
				</el-table-column>
				<el-table-column
						prop="politicsstatus.name"
						align="center"
						label="政治面貌"
						width="90">
				</el-table-column>
				<el-table-column
						prop="email"
						align="center"
						label="电子邮件"
						width="180">
				</el-table-column>
				<el-table-column
						prop="phone"
						align="center"
						label="电话号码"
						width="120">
				</el-table-column>
				<el-table-column
						prop="address"
						align="center"
						label="联系地址"
						width="250">
				</el-table-column>
				<el-table-column
						prop="department.name"
						align="center"
						label="所属部门"
						width="100px">
				</el-table-column>
				<el-table-column
						prop="position.name"
						align="center"
						label="职位"
						width="120">
				</el-table-column>
				<el-table-column
						prop="jobLevel.name"
						align="center"
						label="职称"
						width="120">
				</el-table-column>
				<el-table-column
						prop="engageForm"
						align="center"
						label="聘用形式"
						width="90">
				</el-table-column>
				<el-table-column
						prop="beginDate"
						align="center"
						label="入职日期"
						width="120">
				</el-table-column>
				<el-table-column
						prop="conversionTime"
						align="center"
						label="转正日期"
						width="120">
				</el-table-column>
				<el-table-column
						prop="beginContract"
						align="center"
						label="合同起始日期"
						width="120">
				</el-table-column>
				<el-table-column
						prop="endContract"
						align="center"
						label="合同截止日期"
						width="120">
				</el-table-column>
				<el-table-column
						prop="contractTerm"
						align="center"
						label="合同期限"
						width="90">
				</el-table-column>
				<el-table-column
						prop="tiptopDegree"
						align="center"
						label="最高学历"
						width="90">
				</el-table-column>
				<el-table-column
						label="操作"
						fixed="right"
						align="center"
						width="300px">
					<template slot-scope="scope">
						<el-button
								size="mini"
								@click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button
								size="mini"
								type="primary"
								@click="handleEdit(scope.$index, scope.row)">查看高级资料</el-button>
						<el-button
								size="mini"
								type="danger"
								@click="handleDelete(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div style="display: flex; justify-content: flex-end; margin-top: 2px">
				<!-- layout定义分页默认的子组件布局，如果需要客户化则必须定义相关属性 -->
				<!-- el-pagination事件：current-change当前页改变（跳转去其他页）时触发，默认传递一个新页的页码；size-change pageSize即页的记录数改变时会触发，默认传递一个新的页记录数。total属性表示当前表格有多少页 -->
				<el-pagination
						background
						@size-change="sizeChange"
						@current-change="currentChange"
						layout="sizes, prev, pager, next, jumper, ->, total, slot"
						:total="total">
				</el-pagination>
			</div>
		
		</div>
	</div>
</template>

<script>
export default {
	name: "EmpBasic",
	data() {
		return {
			emps: [],
			page: 1,
			size: 10,
			total: 0,
			loading: false,
			keywords: ''
		}
	},
	mounted() {
		this.initEmps();
	},
	methods: {
		clear() {
			this.initEmps();
		},
		searchEmployee() {
			this.initEmps();
		},
		// 表格页记录数改变时触发，回调参数val是新记录数
		sizeChange(val) {
			console.log(val);
			this.size = val;
			this.initEmps();
		},
		// 表格当前页页码发生变化时触发，回调参数val是新页的页码
		currentChange(val) {
			console.log(val);
			this.page = val;
			this.initEmps();
		},
		initEmps() {
			this.loading = true;
			// 因为page、size前端设置了默认值，所以可直接请求
			this.getRequest('/emp/basic/?page=' + this.page + '&size=' + this.size + '&keywords=' + this.keywords).then(resp => {
				this.loading = false;
				if (resp) {
					this.emps = resp.data;
					this.total = resp.total;
				}
			})
		}
	}
}
</script>

<style scoped>

</style>
