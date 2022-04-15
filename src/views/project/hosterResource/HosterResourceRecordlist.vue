<template>
  <div class="user-container">
    <!-- 登录信息 -->
    <global-tips></global-tips>
    <Breadcrumb></Breadcrumb>
    <!-- 资源维护记录列表 -->
    <el-card class="mt-3">
      <h4 class="fs_18 font-weight-semibold m-0 text-000 mb-3">资源维护记录列表</h4>
      <el-table :data="tableData" :default-expand-all="true" :row-class-name="getRowClass">
				<el-table-column type="expand">
					<template slot-scope="scope">
						<div class="d-flex align-items-center justify-content-between" v-for="(file,index) in scope.row.files" :key="index">
							<div class="cursor-pointer view" @click="preview(file.path)" title="在线预览">
								<i class="el-icon-document mr-2"></i><span>{{file.name}}</span>
							</div>
							<div class="opacity-80">
								<i class="el-icon-view cursor-pointer view mr-3" @click="preview(file.path)"></i>
								<i class="el-icon-download cursor-pointer view" @click="downloadview(file)"></i>
							</div>
						</div>
					</template>
				</el-table-column>
        <el-table-column prop="record_number" label="记录编号"></el-table-column>
				<el-table-column prop="title" label="标题"></el-table-column>
				<el-table-column prop="desc" label="简述">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              title="简述"
              width="200"
              trigger="hover"
              :content="scope.row.desc">
              <span class="text-truncate" slot="reference">{{scope.row.desc}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="上传企业"></el-table-column>
				<el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="createtime" label="创建时间" width="150"></el-table-column>
			</el-table>
    </el-card>
  </div>
</template>

<script>
  import GlobalTips from "@/components/GlobalTips";
  import Breadcrumb from "@/components/Breadcrumb";

  export default {
    name: 'HosterResourceRecordlist',
    provide() {
      return {
        loadData: this.loadData
      }
    },
    components: {
      GlobalTips,
      Breadcrumb,
    },
    data () {
      return {
        tableProps: {
          
        },
        tableData: [],
      }
    },
    mounted(){
      this.loadData();
    },
    methods:{
      // 自增序列
      indexMethod(index) { 
        return ++index;
      },
      // 判断表格是否有子项，无子项不显示展开按钮
			getRowClass (row) {
				if (row.row.is_pay == 1) {
					return 'row-expand-cover'
				}
			},
      // 加载数据
      loadData() { 
        let _this = this;
        this.$api.hosterResourceRecordList({
          id:this.$route.query.id,
        }).then(data=>{
          if(data.code == 0){
            this.tableData = data.data;
          }else{
            this.$message.error(data.msg);
          }
        });
      },

      // 预览文件
			preview(path){
				this.$api.file_preview({
					path:path,
				}).then(data=>{
					if(data.code == 0){
						let a = document.createElement('a');
						a.style = 'display: none'; // 创建一个隐藏的a标签
						a.target = "_blank";
						a.href = data.data;
						document.body.appendChild(a);
						a.click();
					}else{
						this.$message.error(data.msg)
					}
				})
			},
			// 下载文件
			downloadview(file){
				let a = document.createElement('a'); 
				a.style = 'display: none'; // 创建一个隐藏的a标签
				a.download = file.name;
				a.href = this.$globalUrl.baseURL + file.path;
				document.body.appendChild(a);
				a.click(); // 触发a标签的click事件
				document.body.removeChild(a);
			},
    },
  }
</script>

<style>

</style>