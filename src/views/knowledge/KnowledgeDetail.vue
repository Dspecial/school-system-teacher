<template>
	<div class="page_detail">
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<Breadcrumb></Breadcrumb>
		<el-card class="mt-3 bg-white">
			<div class="pl-5 pr-5">
				<div class="detail_header mt-5">
					<h3 class="m-0 fs_26 text-center">{{title}}</h3>
					<div class="d-flex justify-content-between mt-5">
						<p class="text-primary">标签：{{type == 1?'文章':type == 2?'文档':type == 3?'图片':'多媒体'}}</p>
						<p>
							<span class="mr-3"><i class="el-icon-view mr-1"></i>查看次数：{{views}}</span>
							<span class="mr-3"><i class="el-icon-download mr-1"></i>下载次数：{{downloadviews}}</span>
							<span><i class="el-icon-date mr-1"></i>创建时间：{{createtime}}</span>
						</p>
					</div>
				</div>
				<div class="detail_content pt-5 pb-5 mt-3 mb-3">
					<p class="text-indent line-2">{{ desc }}</p>

					<!-- 图片 -->
					<ul class="upload_content mt-5 m-auto" v-if="type == 3">
						<li v-for="(item,index) in content" :key="index" class="text-center">
							<img :src="$globalUrl.baseURL + item.path" alt="" class="img-fluid">
						</li>
					</ul>
					<!-- 多媒体 -->
					<ul class="upload_content w-50 mt-5 m-auto" v-else-if="type == 4">
						<li v-for="(item,index) in content" :key="index" class="text-center">
							<video :src="$globalUrl.baseURL + item.path" controls="controls" width="500px">
								your browser does not support the video tag
							</video>
						</li>
					</ul>
					<!-- 文档、文章 -->
					<ul class="upload_content w-50 mt-5" v-else>
						<li v-for="(item,index) in content" :key="index" class="d-flex justify-content-between cursor-pointer">
							<span class="cursor-pointer preview_span" title="预览" @click="preview(item.path)"><i class="el-icon-folder mr-1"></i> {{item.name}}</span>
							<p>
								<span class="mr-3">大小：{{item.size}} kb</span>
								<span class="cursor-pointer preview_span" title="下载" @click="downloadview(item.path)"><i class="el-icon-download mr-1"></i>下载</span>
							</p>
						</li>
					</ul>
				</div>
				<div class="detail_footer pt-3">
					<div class="d-flex justify-content-between">
						<p>所属分类：{{parent_str}}</p>
						<p class="text-primary cursor-pointer" @click="goBack">
							<span class="mr-3"><i class="el-icon-back mr-1"></i>返回知识库列表</span>
						</p>
					</div>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script>
	import GlobalTips from "@/components/GlobalTips";
	import Breadcrumb from "@/components/Breadcrumb";
	import vEditor from "@/components/quill-editor/ue";
	export default {
		props:['editData'],
		name: 'ProjectEdit',
		data () {
			return {
				knowledgeId:'',
				title:"文章标题",
				type:"文档",
				views:'',
				downloadviews:'',
				createtime:'',
				desc:"",
				content:[],
				parent_str:'',
			}
		},
		components: {
			GlobalTips,
			Breadcrumb,
		},
		mounted(){
			this.openEdit();
		},
		methods:{
			// dialog初始化
			openEdit(){
				this.knowledgeId = this.$route.query.id;
				this.$api.knowledgeDetail({
					id:this.knowledgeId,
				}).then((data)=>{
					if(data.code == '0'){
						this.title = data.data.title;
						this.type = data.data.type;
						this.views = data.data.views;
						this.downloadviews = data.data.downloadviews;
						this.createtime = this.$moment.unix(data.data.createtime).format('YYYY-MM-DD HH:mm:ss');
						this.desc = data.data.desc;
						this.content = data.data.content;
						this.parent_str = data.data.parent_str;
					}
				})
			},
			// 预览文件
			preview(path){
				this.$api.knowledgePreview({
					id:this.knowledgeId,
					path:path,
				}).then(data=>{
					if(data.code == 0){
						let a = document.createElement('a');
						a.style = 'display: none'; // 创建一个隐藏的a标签
						a.target = "_blank";
						a.href = data.data;
						document.body.appendChild(a);
						a.click();
					}
				})
			},
			// 下载文件
			downloadview(path){
				this.$api.knowledgeDownloadview({
					id:this.knowledgeId,
					path:path,
				}).then(data=>{
					if(data.code == 0){
						let a = document.createElement('a'); 
						a.style = 'display: none'; // 创建一个隐藏的a标签
						a.download = "filename";
						a.href = data.data;
						document.body.appendChild(a);
						a.click(); // 触发a标签的click事件
						document.body.removeChild(a);
					}
				})
			},
			// 返回列表
			goBack(){
				this.$router.push({
          path:"/knowledge/knowledge",
        })
			},
		}
	}
</script>

<style>

</style>