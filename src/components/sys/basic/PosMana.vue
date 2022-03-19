<template>
	<!-- vue的模板中只能有一个div容器，其他的容器必须嵌套在容器内	-->
	<div>
		<div>
			<!-- 带图标的输入框，通过v-model双向绑定值。对输入框绑定触发事件，需要添加native表示调用原始的方法	-->
			<el-input class="addPosInput"
			          size="small"
			          placeholder="请输入内容"
			          prefix-icon="el-icon-plus"
			          @keydown.enter.native="addPosition"
			          v-model="pos.name">
			</el-input>
			<el-button icon="el-icon-plus" size="small" type="primary" @click="addPosition">添加</el-button>
		</div>
		<div class="posManaMain">
			<!-- el-table表格，表格里的数据由data属性绑定的Vue实例属性数组positions提供，数组元素是{key: value}对象，el-table-column通过prop匹配key的方式获取value。表的宽度由style提供
					 @selection-change绑定回调函数handleSelectionChange(val)，所有选中行数据通过val传递给函数处理。
			-->
			<el-table
					:data="positions"
					border
					size="small"
					stripe
					@selection-change="handleSelectionChange"
					style="width: 70%">
				<!-- 表格的多选框由type="selection"提供，且多选框被选中时，这行值val会传给el-table属性selection-change中绑定的方法处理 	-->
				<el-table-column
						type="selection"
						width="55">
				</el-table-column>
				<el-table-column
						prop="id"
						label="编号"
						width="55">
				</el-table-column>
				<el-table-column
						prop="name"
						label="职位名称"
						width="250">
				</el-table-column>
				<el-table-column
						prop="createDate"
						label="创建日期"
						width="150">
				</el-table-column>
				<el-table-column
						prop="enabled"
						label="是否启用"
						width="150">
					<template slot-scope="scope">
						<el-tag size="small" type="success" v-if="scope.row.enabled">启用</el-tag>
						<el-tag size="small" type="danger" v-else>禁用</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<!-- vue中插槽slot分为匿名插槽、具名插槽和作用域插槽（本例）。插槽即为slot元素，有name属性的为具名插槽。插槽的显示与不显示、怎么显示由父组件决定，而插槽位置由子组件决定，因为slot定义在子组件中，slot显示
							 内容由父组件提供。父组件里template模板里有slot-scope定义作用域插槽，作用域插槽会引用父组件数据。
					-->
					<template slot-scope="scope">
						<!-- 点击事件中的参数scope.$index表示当前表格第几行，scope.row表示当前行的JSON数据 -->
						<el-button
								size="mini"
								@click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button
								size="mini"
								type="danger"
								@click="handleDelete(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- disabled表示按钮是否隐藏，通过v-bind绑定属性值的方式实现条件判断	-->
			<el-button style="margin-top: 8px" size="small" type="danger" :disabled="this.multipleSelection.length == 0" @click="deletePositions">批量删除</el-button>
		
		</div>
		<!-- 在el-dialog中属性visible.sync值为true显示对话框，false关闭对话框	-->
		<div>
			<el-dialog
					title="修改职位"
					:visible.sync="dialogVisible"
					width="30%">
				<div>
					<el-tag>职位名称</el-tag>
					<el-input size="small" class="updatePosInput" v-model="updatePos.name"></el-input>
				</div>
				<div style="margin-top: 5px">
					<el-tag>是否启用</el-tag>
					<el-switch
							style="margin-left: 10px"
							v-model="updatePos.enabled"
							active-text="启用"
							inactive-text="禁用">
					</el-switch>
				</div>
				<span slot="footer" class="dialog-footer">
    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    <el-button size="small" type="primary" @click="updateConfirm">确 定</el-button>
  </span>
			</el-dialog>
		</div>
		
	</div>
	
</template>

<script>
export default {
	name: "PosMana",
	data() {
		return {
			pos: {
				name: ''
			},
			multipleSelection: [],
			dialogVisible: false,
			updatePos: {
				name: '',
				enabled: false
			},
			// positions用来接收JSON数据
			positions: []
		}
	},
	// mounted()组件的钩子函数，表示组件被挂载完成时触发
	mounted() {
		this.initPosition();
	},
	methods: {
		deletePositions() {
			this.$confirm('此操作将永久删除【' + this.multipleSelection.length + '】条数据, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let ids = '?';
				this.multipleSelection.forEach(item => {
					// 后端从前端接收的数据方式：1、参数拼接在url里/?key=value&key=value&...；2、后端利用@PathVariable时，value直接拼接在url里；3、利用JSON传递
					ids += 'ids=' + item.id + '&';
				});
				this.deleteRequest('/system/basic/pos/' + ids).then(resp => {
					if (resp) {
						this.initPosition();
						
					}
				});
			}).catch(() => {
						this.$message({
							type: 'info',
							message: '取消删除'
						});
					}
			);
			
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
			console.log(val);
			
		},
		updateConfirm() {
			if (this.updatePos.name != this.pos.name || this.updatePos.enabled != this.pos.name) {
				this.putRequest('/system/basic/pos/', this.updatePos).then(resp => {
					if (resp) {
						this.dialogVisible = false;
						this.updatePos.name = '';
						this.initPosition();
					}
				});
			} else {
				this.dialogVisible = false;
				this.$message.info("职位未发生变化");
			}
		},
		// 职位添加方法
		addPosition() {
			// 如果输入框中接收到数据，则调用post请求接口
			if (this.pos.name) {
				// 接口有返回数据则更新positions
				this.postRequest('/system/basic/pos/', this.pos).then(resp => {
					if (resp) {
						this.initPosition();
						this.pos.name = '';
					}
				});
				
			} else {
				this.$message.error("职位不能为空");
			}
		},
		// 职位删除方法
		handleDelete(index, data) {
			// 删除确认
			this.$confirm('此操作将永久删除【' + data.name + '】职位, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.deleteRequest('/system/basic/pos/' + data.id).then(resp => {
					if (resp) {
						this.initPosition();
					}
				});
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
		},
		// 职位编辑方法
		handleEdit(index, data) {
			console.log(data);
			// Object.assign(target, source...)将source对象中的属性拷贝到target对象中，浅拷贝
			Object.assign(this.updatePos, data);
			this.dialogVisible = true;
			
		},
		// initPosition从'/system/basic/pos/'接口中获取数据，并初始化position
		initPosition() {
			this.getRequest('/system/basic/pos/').then(resp => {
				if (resp) {
					this.positions = resp;
				}
				
			});
		}
	},
	
	
}
</script>

<style>
	.addPosInput {
		width: 300px;
		margin-right: 8px;
	}
	.updatePosInput {
		width: 200px;
		margin-left: 8px;
	}
	
	.posManaMain{
		margin-top: 8px;
	}

</style>
