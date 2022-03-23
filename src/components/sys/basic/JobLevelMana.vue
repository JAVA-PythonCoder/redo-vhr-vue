<template>
	<div>
		<div>
			<el-input size="small" v-model="jb.name"  placeholder="添加职称..." prefix-icon="el-icon-plus" style="width: 300px"></el-input>
			<el-select v-model="jb.titleLevel" placeholder="职称等级" size="small" style="margin-left: 5px; margin-right: 5px">
				<!--	el-option是el-select里的下拉列表，key用于区分不同的值，label表示要显示的值，value表示提交去服务器的值 -->
				<el-option
						v-for="(item, index) in titleLevels"
						:key="index"
						:label="item"
						:value="item">
				</el-option>
			</el-select>
			<el-button type="primary" size="small" prefix-icon="el-icon-plus" @click="addJobLevel">添加</el-button>
		</div>
		<div style="margin-top: 10px">
			<!-- selection-change属性绑定每行前的多选框			-->
			<el-table
					size="small"
					:data="jls"
					border
					style="width: 70%"
					@selection-change="handleSelectionChange">
				<!-- 表格的多选框必须要有一个el-table-column中提供type="selection"，且多选框被选中时，这行值val会传给el-table属性selection-change中绑定的方法处理 	-->
				<el-table-column
						type="selection"
						width="55">
				</el-table-column>
				<el-table-column
						prop="name"
						label="职称"
						width="180">
				</el-table-column>
				<el-table-column
						prop="titleLevel"
						label="职称级别">
				</el-table-column>
				<el-table-column
						prop="createDate"
						label="创建时间">
				</el-table-column>
				<el-table-column
						prop="enabled"
						label="是否启用">
					<template slot-scope="scope">
						<el-tag type="success" v-if="scope.row.enabled">已启用</el-tag>
						<el-tag type="info" v-else>未启用</el-tag>
					</template>
				</el-table-column>
				<el-table-column
						label="操作">
					<template slot-scope="scope">
						<el-button size="small" @click="showEditView(scope.row)">编辑</el-button>
						<el-button size="small" type="danger" @click="deleteJobLevel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div style="margin-top: 10px">
				<el-button size="small" :disabled="multipleSelection.length == 0" type="danger" @click="deleteJobLevels">批量删除</el-button>
			</div>
		</div>
		<div>
			<el-dialog
					title="职称修改"
					:visible.sync="dialogVisible"
					width="30%">
				<table>
					<tr>
						<td>
							职称：
						</td>
						<td>
							<el-input size="small" v-model="updateJobLevel.name"></el-input>
						</td>
					</tr>
					<tr>
						<td>
							职位：
						</td>
						<td>
							<el-select v-model="updateJobLevel.titleLevel" size="small">
								<el-option
										v-for="item in titleLevels"
										:key="item"
										:label="item"
										:value="item">
								</el-option>
							</el-select>
						</td>
					</tr>
					<tr>
						<td>
							是否启用：
						</td>
						<td>
							<el-switch
									v-model="updateJobLevel.enabled"
									active-text="启用"
									inactive-text="禁用">
							</el-switch>
						</td>
					</tr>
				</table>
				<span slot="footer" class="dialog-footer">
    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
  </span>
			</el-dialog>
			
		</div>
	</div>
</template>

<script>
export default {
	name: "JobLevelMana",
	data() {
		return {
			multipleSelection: [],
			updateJobLevel: {
				name: '',
				titleLevel: '',
				enabled: false
			},
			dialogVisible: false,
			jb: {
				name: '',
				titleLevel: '',
			},
			jls: [],
			titleLevels: [
					"正高级",
					"副高级",
					"中级",
					"初级",
					"员级"
			]
		}
	},
	mounted() {
		this.initJls();
	},
	methods: {
		deleteJobLevels() {
			this.$confirm('此操作将永久删除【'+ this.multipleSelection.length +'】条职称信息, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let ids = '?';
				this.multipleSelection.forEach(item => {
					ids += 'ids=' + item.id + '&';
				});
				this.deleteRequest('/system/basic/joblevel/' + ids).then(resp => {
					if (resp) {
						this.initJls();
					}
				})
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
			
		},
		handleSelectionChange(val) {
			// val是个数组，元素是选中行数据对象
			this.multipleSelection = val;
		},
		doUpdate() {
			this.putRequest('/system/basic/joblevel/', this.updateJobLevel).then(resp => {
				if (resp) {
					this.initJls();
					this.dialogVisible = false;
					this.updateJobLevel = {
						name: '',
						titleLevel: '',
						enabled: false
					};
				}
			})
		},
		showEditView(data) {
			this.dialogVisible = true;
			Object.assign(this.updateJobLevel, data);
		},
		deleteJobLevel(data) {
			this.$confirm('此操作将永久删除【'+ data.name +'】职位, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.deleteRequest('/system/basic/joblevel/' + data.id).then(resp => {
					if (resp) {
						this.initJls();
					}
				})
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
			
		
		},
		addJobLevel() {
			if (this.jb.name && this.jb.titleLevel) {
				this.postRequest('/system/basic/joblevel/', this.jb).then(resp => {
					if (resp) {
						this.initJls();
						this.jb = {
							name: '',
							titleLevel: ''
						};
					}
				});
			} else {
				this.$message.error("职位名和职位等级不能为空");
			}
			
		},
		initJls() {
			this.getRequest('/system/basic/joblevel/').then(resp => {
				if (resp) {
					this.jls = resp;
				}
			})
		}
	}
}
</script>

<style scoped>

</style>
