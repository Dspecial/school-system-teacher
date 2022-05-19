<template>
	<div class="index-container">
		<!-- 资源概况 -->
		<!-- <div class="w-100">
			<h4 class="fs_18 font-weight-semibold m-0 mb-3 text-000">资源概况</h4>
			<el-row :gutter="20">
				<template v-for="(item,index) in resources">
					<el-col :span="6" :key="index">
						<el-card>
							<div class="d-flex align-items-center justify-content-center p-2">
								<img :src="item.src" alt="" width="80" height="80">
								<div class="ml-3 text-center">
									<span class="mb-2 d-inline-block">{{item.title}}</span>
									<p class="m-0 fs_20">{{item.num}}/{{item.total}}</p>
								</div>
							</div>
						</el-card>
					</el-col>
				</template>
			</el-row>	
		</div> -->

		<!-- 我的项目--状态统计 -->
		<el-card>
			<h4 class="fs_18 font-weight-semibold m-0 mb-3 text-000">我的项目</h4>
			<el-row :gutter="20" type="flex">
				<template v-for="(status,index) in statusList">
					<el-col class="text-center status-item" :key="index">
						<span class="mb-2 d-inline-block opacity-60">{{status.name}}</span>
						<p class="m-0 fs_24">{{status.count}}/{{statusTotal}}</p>
					</el-col>
				</template>
			</el-row>
		</el-card>

		<el-row :gutter="20" class="mt-3">
			<!-- 信息处理 -->
			<el-col :span="12">
				<el-card :body-style="{ padding: '0px' }">
					<div class="d-flex justify-content-between align-items-center isCell">
						<h4 class="fs_18 font-weight-semibold m-0 text-000">信息处理</h4>
						<div class="tab_nav">
							<template v-for="(nav,index) in handleNav">
								<span :key="index" :class="['cursor-pointer ml-3',handleNavIndex == nav.id?'active':'']" @click="handleTab(nav.id)">{{nav.title}}</span>
							</template> 
							<span class="ml-3 cursor-pointer" @click="moreRoutine">更多</span>
						</div>
					</div>
					<div class="tab_content">
						<el-row class="isCell handleType">
							<template v-for="(type,index) in handleType">
								<el-col :span="8" class="text-center" :key="index">
									<p class="m-0 fs_30 mb-3">{{type.num}}/{{handleTotal}}</p>
									<span>{{type.typeName}}</span>
								</el-col>
							</template>
						</el-row>
						<el-table :data="handleData" class="mt-3" height="240">
							<el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
							<!-- <el-table-column prop="work_num" label="编号"></el-table-column> -->
							<el-table-column prop="title" label="标题"></el-table-column>
							<el-table-column prop="status" label="状态" width="150">
								<template slot-scope="scope">
									<span v-if="scope.row.state == 1"><i class="dot bg-primary mr-1"></i>流转中</span>
									<span v-else-if="scope.row.state == 2"><i class="dot bg-success mr-1"></i>已通过</span>
									<span v-else-if="scope.row.state == 3"><i class="dot bg-danger mr-1"></i>已驳回</span>
								</template>
							</el-table-column>
							<!-- <el-table-column prop="createtime" label="创建时间" width="180"></el-table-column>
							<el-table-column prop="updatetime" label="更新时间" width="180"></el-table-column> -->
							<el-table-column fixed="right" label="操作" width="100" align="center">
								<template slot-scope="scope">
					      	<div class="text-success cursor-pointer">
						        <i class="el-icon-view" @click="viewDetail(scope.$index,scope.row)"></i>
					        </div>
					      </template>
							</el-table-column>
				    </el-table>
					</div>
				</el-card>
			</el-col>
			<!-- 付款信息 -->
			<el-col :span="12">
				<el-card :body-style="{ padding: '0px' }">
					<div class="d-flex justify-content-between align-items-center isCell">
						<h4 class="fs_18 font-weight-semibold m-0 text-000">付款信息</h4>
						<div class="tab_nav">
							<template v-for="(year,index) in handleYear">
								<span :key="index" :class="['cursor-pointer ml-3',handleYearIndex == year.id?'active':'']" @click="handleYearTab(year.id)">{{year.title}}</span>
							</template> 
						</div>
					</div>
					<div class="tab_content" style="padding: 20px">
						<my-echart :id="'echarts'" :data="option" height="335px"></my-echart>
					</div>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import BaseEcharts from "@/components/echarts/BaseEcharts"
	export default {
		name: 'Index.vue',
		components: {
			"my-echart":BaseEcharts
		},
		data () {
			return {
				// 资源概况
				resources:[
					{
						src:require("@/assets/images/index-resource1.png"),
						title:"完成项目",
						num:"3",
						total:"5"
					},
					{
						src:require("@/assets/images/index-resource2.png"),
						title:"IP分配(个)",
						num:"5",
						total:"20"
					},
					{
						src:require("@/assets/images/index-resource3.png"),
						title:"场地(m²)",
						num:"100",
						total:"1000"
					},
					{
						src:require("@/assets/images/index-resource4.png"),
						title:"服务器(台)",
						num:"8",
						total:"100"
					},
				],
				// 我的项目总数
				statusTotal:"16",
				// 我的项目
				statusList:[],

				// 信息处理Tab
				handleNav:[
					{
						id:'',
						title:"全部",
					},
					{
						id:1,
						title:"待办",
					},
					{
						id:2,
						title:"已办",
					}
				],
				// 默认选中的tab
				handleNavIndex:"",
				handleType:[
					{
						typeName:"待处理",
						num:"8",
					},
					{
						typeName:"已通过",
						num:"10",
					},
					{
						typeName:"已驳回",
						num:"20",
					},
				],
				handleTotal:20,
				handleData: [],

	      // 付款信息Tab
				handleYear:[
					{
						id:"",
						title:"总计",
					},
					{
						id:new Date().getFullYear(),
						title:new Date().getFullYear() + '年',
					},
					{
						id:new Date().getFullYear()-1,
						title:new Date().getFullYear()-1 + '年',
					},
					{
						id:new Date().getFullYear()-2,
						title:new Date().getFullYear()-2 + '年',
					},
				],
				// 默认选中的年份tab
				handleYearIndex:new Date().getFullYear(),
				// 图
				option:{
					title: {
            text: '项目合同总金额',
            subtext:"\n100000 元",
            x: 'center',
            y: '125',
            textStyle: {
              fontStyle: 'normal', //字体风格,'normal','italic','oblique'
              fontWeight: '500', //字体粗细
              fontSize: 14,
            },
            subtextStyle:{
            	color: '#032F99',
              fontWeight: '500', //字体粗细
              fontSize: 20,
            },
          },
			    tooltip: {
		        trigger: 'item',
		        formatter: '{a} <br/>{b} : {c} ({d}%)'
			    },
			    legend: {
		        orient: 'horizontal',
		        x: 'center',
		        bottom: '0',
		        icon: 'circle',
		        itemWidth: 10,
		        data: ['未付款', '已付款']
			    },
			    series: [
		        {
	            name: '金额',
	            type: 'pie',
	            radius: ['50%', '70%'],
	            center: ['50%', '48%'],
	            label: {
                formatter: `{b|{b}：}{c} 元 {per|{d}%}`,
                fontSize: 16,
                rich: {
                  per: {
                    color: '#eee',
                    backgroundColor: '#334455',
                    padding: [6, 6],
                    borderRadius: 4,
                  }
                }
            	},
	            data: [
                {value: 7000, name: '未付款'},
                {value: 3000, name: '已付款'},
	            ],
	            hoverOffset:5,
	            emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
	            }
		        }
			    ]
				},
			}
		},
		mounted(){
			this.initRoutine();
			this.initState();
			this.initPay(this.handleYearIndex);
		},
		methods:{
			// 获取我的项目
			initState(){
				this.$api.dashboard_state({
				}).then(data=>{
					if(data.code == 0){
						this.statusTotal = data.data.all_count;
						this.statusList = data.data.project_node_list;
					}else{
						this.$message.error(data.msg);
					}
				})
			},

			// 信息处理tab
			handleTab(id){
				this.handleNavIndex = id;
				this.initRoutine(id);
			},
			// 更多
			moreRoutine(){
				this.$router.push({ 
					path:"/works/routine"
				});
				// 35是事务管理
				this.menuClick(35);
			},
			menuClick(id){
        this.VueCookies.set('menu_id', id);
        // 清空
        this.allAction = {
          addAction:{},
          moreAction:[],
        };
        this.$api.menuButton({
          menu_id:id
        }).then(data=>{
          if(data.code == 0){
            if(this.commonJs.isEmpty(data.data.current_menu[0])){
              this.$store.commit("SET_ACTION",this.allAction);
            }else{
              data.data.current_menu.map(item=>{
                if(item.sign == 1){ // 是添加按钮
                  this.allAction.addAction = item;
                }else{
                  this.allAction.moreAction.push(item);
                }
              })
              this.$store.commit("SET_ACTION",this.allAction);
            }
          }
        })
      },
			// 获取信息处理
			initRoutine(status){
				this.$api.dashboard_routine({
					status:status,
				}).then(data=>{
					if(data.code == 0){
						this.handleTotal = data.data.all_count;
						this.handleType[0].num = data.data.daichuli_count;
						this.handleType[1].num = data.data.yitongguo_count;
						this.handleType[2].num = data.data.yibohui_count;

						this.handleData = data.data.list;

					}else{
						this.$message.error(data.msg);
					}
				})
			},
			indexMethod(index) { //自增序列
        return ++index;
      },
			// 跳转查看
			viewDetail(index,row){
				var url = row.view_url.split("#")[1];
        if(row.view_url){
          this.$router.push({ 
            path:url
          });
        }else{
          this.$router.push({ 
            path:"/project/project/detail",
            query:{
              id:row.details_id
            },
          });
        }
			},

			// 年份tab
			handleYearTab(year){
				this.handleYearIndex = year; 
				this.initPay(year);
			},
			// 获取首页获取付款信息
			initPay(year){
				this.$api.dashboard_pay({
					year:year
				}).then(data=>{
					if(data.code == 0){
						this.option = {
							title:{
								subtext:'\n' + data.data.all_money + '元'
							},
							series:[{
								data:data.data.name_value
							}],
						};
					}else{
						this.$message.error(data.msg);
					}
				})
			},
		},
	}
</script>

<style>

</style>