<template>
	<div class="user-container">
		<!-- 登录信息 -->
    <global-tips></global-tips>
    <!-- 厂商管理 -->
    <el-card class="mt-3">
      <data-tables-server :data="tableData" layout="tool, table,pagination" :current-page="currentPage":page-size="pageSize" :pagination-props="{ background: true, pageSizes: [15,30,45,60], total: total }" @query-change="loadData" :filters="filters" :table-props="tableProps">
        <div class="mb-3" slot="tool">
          <h4 class="fs_18 font-weight-semibold m-0 text-000 mb-3">厂商管理</h4>
          <div class="d-flex align-items-center">
          	<div class="mr-auto d-flex align-items-center w-80">
              <el-input
                class="w-40"
                placeholder="企业名称/负责人姓名"
                prefix-icon="el-icon-search"
                v-model="filters[0].value"
                clearable>
              </el-input>
              <el-date-picker
                class="ml-3 w-40"
                v-model="filters[1].value"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                placeholder="选择上次登录时间"
                clearable>
              </el-date-picker>
            </div>
            <div class="ml-auto">
              <el-button type="primary" @click="handleAdd()" v-if="$store.getters.getaddAction.title" ><i class="el-icon-plus el-icon--left"></i>{{$store.getters.getaddAction.title}}</el-button>
            </div>
          </div>
        </div>
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="job_number" label="企业名称" width="200"></el-table-column>
        <el-table-column prop="sys_id" label="营业执照编码" width="200"></el-table-column>
        <el-table-column prop="name" label="负责人姓名" width="100"></el-table-column>
        <el-table-column prop="sex" label="性别">
          <template slot-scope="scope">
            <span v-if="scope.row.sex == 1">男</span>
            <span v-if="scope.row.sex == 2">女</span>
          </template>
        </el-table-column>
        <el-table-column prop="is_normal" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.is_normal == 0"><i class="dot bg-success mr-1"></i>正常</span>
            <span v-else><i class="dot bg-danger mr-1"></i>禁用</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="电话" width="150"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="rulename" label="角色组" width="180"></el-table-column>
        <el-table-column prop="createtime" label="创建时间" width="150"></el-table-column>
        <el-table-column prop="lastlogintime" label="上次登录时间" width="150"></el-table-column>
        <el-table-column prop="updatetime" label="更新时间" width="150"></el-table-column>
        <el-table-column fixed="right" label="操作" width="300" align="center">
          <template slot-scope="scope">
            <span v-for="(action,index) in $store.getters.getmoreAction" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
          </template>
        </el-table-column>
      </data-tables-server>
    </el-card>
    <mfuser-edit :mfuserData="mfuserData"></mfuser-edit>
    <mfuser-changepwd :pwdData="pwdData"></mfuser-changepwd>
    <mfuser-changepwd-list :pwdListData="pwdListData"></mfuser-changepwd-list>
	</div>
</template>

<script>
	import GlobalTips from "@/components/GlobalTips";
	import MfuserEdit from "./MfuserEdit";
  import MfuserChangepwd from "./MfuserChangepwd";
  import MfuserChangepwdList from "./MfuserChangepwdList";

	export default {
		name: 'ManufacturerUser',
		provide() {
      return {
        loadData: this.loadData
      }
    },
		components: {
			GlobalTips,
      MfuserEdit,
			MfuserChangepwd,
      MfuserChangepwdList,
		},
		data () {
			return {
				tableProps: {},
        tableData: [],
        filters: [
	        {
	          value: '',
	          prop: 'name'
	        },
          {
            value: '',
            prop: 'date'
          }
        ],
        total: 0, //总条数
        currentPage: 1, //当前页
        pageSize: 15, //每页显示条数
        mfuserData:{
        	dialog:false,
        	title:"",
        	id:"",
          isEdit:false,
        },
        pwdData:{
          dialog:false,
        	title:"",
        	id:"",
        },
        pwdListData:{
          dialog:false,
        	title:"",
        	id:"",
        },
			}
		},
    mounted(){

    },
		methods:{
			// 自增序列
      indexMethod(index) { 
        return ++index;
      },
      // 加载数据
      loadData(queryInfo) { 
        let _this = this;
        if (queryInfo != null) {
          this.currentPage = queryInfo.page;
          this.pageSize = queryInfo.pageSize;
        }
        var timeRange = this.filters[1].value;
        if(timeRange){
          var lastlogintime = timeRange.join("~");
        }else{
          lastlogintime = '';
        }
        this.$api.companyList({
          page:this.currentPage,
          limit:this.pageSize,
          keywords:this.filters[0].value,
          lastlogintime:lastlogintime,
        }).then(data =>{
          if(data.code == 0){
            this.total = data.count;
            this.tableData = data.data;
          }else{
            this.$message.error(data.msg);
          }
        });
      },
      
      // 新增厂商用户
      handleAdd(){
        this.mfuserData.dialog = true;
        this.mfuserData.title = "新增厂商用户";
        this.mfuserData.id = '';
        this.mfuserData.isEdit = false;
      },

      // 操作们
      fun(index,row,sign){
        if(sign === '2'){ // 编辑
          this.editUser(index,row);
        }else if(sign === '3'){ // 删除
          this.handleDel(index,row);
        }else if(sign === '10.1'){ // 申请修改密码
          this.changePwd(index,row);
        }else if(sign === '10.2'){ // 申请修改密码记录
          this.pwdList(index,row);
        }
      },

      // 编辑厂商用户
      editUser(index,row){
        this.mfuserData.dialog = true;
        this.mfuserData.title = "编辑厂商用户";
        this.mfuserData.id = row.id;
        this.mfuserData.isEdit = true;
      },

      // 删除
      handleDel(index,row){
        this.$confirm("此操作将永久删除该厂商用户, 是否继续?", "提示", {
          type: 'warning'
        }).then(() => {
          this.$api.companyDel({// 接口不对
            id:row.id,
          }).then(data=>{ 
             if(data.code == 0){
                this.$message({
                  message: "删除厂商用户成功!",
                  type: 'success'
                });
                this.loadData();
             }else{
               this.$message.error(data.msg);
             }
          })
        }).catch(() => {

        });
      },

      // 申请修改密码
      changePwd(index,row){
        this.pwdData.dialog = true;
        this.pwdData.title = "申请修改密码";
        this.pwdData.id = row.id;
      },

      // 申请修改密码记录
      pwdList(index,row){
        this.pwdListData.dialog = true;
        this.pwdListData.title = "申请修改密码记录";
        this.pwdListData.id = row.id;
      },
		},
	}
</script>

<style>

</style>