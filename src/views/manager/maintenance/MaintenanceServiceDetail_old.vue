<template>
  <div class="h-100">
    <!-- 登录信息 -->
    <global-tips></global-tips>
    <Breadcrumb></Breadcrumb>
    <div class="mt-3 service-container">
      <div class="d-flex h-100">
        <div class="left w-80 d-flex flex-column">
          <div class="left_body" ref="left_body">
            <template v-for="(chat,index) in chatBoxes">
              <div :key="index" class="p-3">
                <!-- 右边 -->
                <div class="ownSide d-flex justify-content-end align-items-start w-60 ml-auto" v-if="chat.to_obj == 1">
                  <img :src="avatarOwnside" alt="" class="img-round img-fluid"/>
                  <div class="txt mr-3">
                    <time class="opacity-60 d-block mb-2">{{chat.createtime}}</time>
                    <div class="txt_content p-2">
                      <p class="m-0">{{chat.content}}</p>
                      <template v-if="chat.files && chat.files.length > 0">
                        <p class="mt-2 mb-2">工单附件:</p>
                        <div class="d-flex align-items-center justify-content-between" v-for="(file,index) in chat.files" :key="index">
                          <div class="cursor-pointer view" @click="preview(file.path)" title="在线预览">
                            <i class="el-icon-document mr-2"></i><span>{{file.name}}</span>
                          </div>
                          <div class="opacity-80 ml-5">
                            <i class="el-icon-view cursor-pointer view mr-3" @click="preview(file.path)"></i>
                            <i class="el-icon-download cursor-pointer view" @click="downloadview(file)"></i>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
                <!-- 左边 -->
                <div class="otherSide d-flex justify-content-start align-items-start w-60 mr-auto" v-if="chat.to_obj == 2">
                  <img :src="avatarOtherside" alt="" class="img-round img-fluid"/>
                  <div class="txt ml-3">
                    <time class="opacity-60 d-block mb-2">{{chat.createtime}}</time>
                    <div class="txt_content p-2">
                      <p class="m-0">{{chat.content}}</p>
                      <template v-if="chat.files && chat.files.length > 0">
                        <p class="mt-2 mb-2">工单附件:</p>
                        <div class="d-flex align-items-center justify-content-between" v-for="(file,index) in chat.files" :key="index">
                          <div class="cursor-pointer view" @click="preview(file.path)" title="在线预览">
                            <i class="el-icon-document mr-2"></i><span>{{file.name}}</span>
                          </div>
                          <div class="opacity-80 ml-5">
                            <i class="el-icon-view cursor-pointer view mr-3" @click="preview(file.path)"></i>
                            <i class="el-icon-download cursor-pointer view" @click="downloadview(file)"></i>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div class="left_footer" v-if="worksheetInfo.status != 3">
            <div class="send_container h-100" v-loading="loadingVisible">
              <div class="toolbar pl-3 pr-3 pt-2 pb-2 p-relative">
                <emoji-panel id="emoji_panel" v-show="emojiPanelVisible" v-on:select-emoticon="selectEmoticon"></emoji-panel>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="d-flex align-items-center">
                    <!-- <a class="cursor-pointer mr-2" title="表情" @click="displayEmojiPanel" v-clickOutside="handleCloseEmojiPanel">
                      <img src="@/assets/images/emoji.png" alt="">
                    </a> -->
                    <el-upload
                      class="upload"
                      ref="fileUpload"
                      action="void"
                      accept=".doc,.docx,.jpg,.png,.JPEG"
                      :auto-upload="true"
                      :http-request="myUpload"
                      :show-file-list="true"
                      :file-list="filesList"
                      :before-upload="beforeUpload"
                      :on-success="handleSuccess"
                      :on-remove="handleRemove">
                      <a class="cursor-pointer" title="图片和文件">
                        <img src="@/assets/images/folder.png" alt="">
                      </a>
                    </el-upload>
                  </div>
                </div>
              </div>
              <div class="content-container pl-3 pr-3">
                <el-input type="textarea" class="custom-textarea" id="message_content" autocomplete="off" placeholder="输入要发送的消息..." 
                  v-model="message" :rows="5" @keydown.enter.native="enterKeyDown($event)">
                </el-input>
                <div class="mt-3 text-right">
                  <span class="opacity-60 ml-2">Ctrl+Enter换行</span>
                  <el-button type="primary" size="small" @click="doSendMessage(message)" :disabled="sendButtonDisabled">发送</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right w-20 bg-white h-100 p-3">
          <h6 class="fs_18 font-weight-normal mb-3">工单信息</h6>
          <div class="mt-3 worksheetInfo">
            <p class="mb-3 text-truncate"><span class="opacity-60 mr-2">工单编号：</span>{{worksheetInfo.question_number}}</p>
            <p class="mb-3 text-truncate"><span class="opacity-60 mr-2">标题：</span>{{worksheetInfo.title}}</p>
						<p class="mb-3 text-truncate"><span class="opacity-60 mr-2">问题描述：</span>{{worksheetInfo.question_content}}</p>
						<p class="mb-3 text-truncate"><span class="opacity-60 mr-2">优先级：</span>{{worksheetInfo.level}}</p>
						<p class="mb-3 text-truncate"><span class="opacity-60 mr-2">工单状态：</span>
              <span v-if="worksheetInfo.status == 1"><i class="dot bg-warning mr-1"></i>待受理</span>
              <span v-else-if="worksheetInfo.status == 2"><i class="dot bg-primary mr-1"></i>已受理</span>
              <span v-else-if="worksheetInfo.status == 3"><i class="dot bg-success mr-1"></i>已完成</span>
            </p>
						<p class="mb-3 text-truncate"><span class="opacity-60 mr-2">提交时间：</span>{{worksheetInfo.createtime}}</p>
            <div class="text-center mt-5" v-if="worksheetInfo.status != 3">
              <el-button type="warning" size="small" @click="closeService">关闭工单</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const clickOutside = {
    // 初始化指令
    bind(el, binding, vnode) {
      function documentHandler(e) {
        // 这里判断点击的元素是否是本身，是本身，则返回。
        if (el.contains(e.target)) {
          return false
        }
        // 展开的表情pannel，也返回不执行关闭操作。
        if(e.target.getAttribute('isEmoji') != null) {
          return false
        }
        // Emoji图标，也返回不执行关闭操作。
        if(e.target.getAttribute('type') != null && e.target.getAttribute('type') === 'emoji_icon') {
          return false
        }      
        // 判断指令中是否绑定了函数
        if (binding.expression) {
          // 如果绑定了函数 则调用那个函数，此处binding.value就是handleCloseEmojiPanel方法
          binding.value(e)
        }
      }
      // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
      el.__vueClickOutside__ = documentHandler
      document.addEventListener('click', documentHandler)
    },
    update() {},
    unbind(el, binding) {
      // 解除事件监听
      document.removeEventListener('click', el.__vueClickOutside__)
      delete el.__vueClickOutside__
    },
  }

  import GlobalTips from "@/components/GlobalTips";
	import Breadcrumb from "@/components/Breadcrumb";
  import EmojiPanel from "@/components/emojiPanel";

  export default {
    name:"MaintenanceServiceDetail",
    components:{
      GlobalTips,
      Breadcrumb,
      EmojiPanel
    },
    directives: { 
      clickOutside
    },
    data(){
      return {
        avatarOwnside:require("@/assets/images/ownSide.jpg"),
        avatarOtherside:require("@/assets/images/otherSide.jpg"),
        // 聊天对话
        chatBoxes: [],
        // 消息发送
        message: '',
        emojiPanelVisible: false,
        loadingVisible: false,
        sendButtonDisabled: true,
        filesList:[],
        removeFilesArr:[],
        // 工单信息
        worksheetInfo:{
        },
      }
    },
    created(){

    },
    mounted(){
      this.initDetail();
    },
    computed:{

    },
    updated() {
      this.$nextTick(() => {
        this.sendButtonDisabled = (this.message.trim() === '');
        // 滚动条永远保持在最下方
        this.$refs.left_body.scrollTop = this.$refs.left_body.scrollHeight;
      })
    },
    methods:{
      // 获取工单详情信息
      initDetail(){
        this.$api.maintenance_serviceDetail({
          id:this.$route.query.id,
          function_type:1,
        }).then(data=>{
          if(data.code == 0){
            this.worksheetInfo = data.data.info;
            this.chatBoxes = data.data.dialog_list;
          }
        })
      },
      // 发送消息
      doSendMessage(message) {
        if(message.trim() === '') {
          return
        }
        this.loadingVisible = true;

        var files = new Array();
        files = this.filesList.map((item)=>{
          return item.response.data.path;
        })
        // 调接口获取answer
        this.$api.maintenance_serviceDetail({
          id:this.$route.query.id,
          function_type:2,
          content:this.message,
          files:files.join(","),
        }).then(data=>{
          if(data.code == 0){
            this.removeFilesArr.map((path)=>{
              _this.removeFile(path);
            })
            // 清空message
            this.message = "";
            this.filesList = [];
            this.loadingVisible = false;
            this.initDetail();
          }
        })
      },

      // 表情面板显示与隐藏
      displayEmojiPanel() {
        this.emojiPanelVisible = !this.emojiPanelVisible
      },

      // 表情面板隐藏
      handleCloseEmojiPanel() {
        this.emojiPanelVisible = false
      },
      
      // 表情选择
      selectEmoticon(emoticon) {
        var textarea = document.getElementById('message_content') // 根据id选择器选中对象
        let pos = textarea.selectionStart;
        let leftStr = this.message.substring(0, pos);
        let rightStr = this.message.substring(pos, this.message.length)
        this.message = leftStr + emoticon + rightStr
      },

      // el-input，textarea 回车键不换行，发送消息 ctrl+enter 换行
      enterKeyDown(e) {
        if(e.keyCode === 17) {
          return
        }
        if(e.keyCode === 13) {
          if (!e.ctrlKey) {
            this.doSendMessage(this.message)
          } else {
            this.message = this.message + '\n';
          }
          e.preventDefault();
        }
      },

      /****  上传  ****/
			myUpload(params,formItem){
	      // 通过 FormData 对象上传文件
	      const formData = new FormData();
	      formData.append("question_number", this.worksheetInfo.question_number);
	      formData.append("file", params.file);
	      formData.append("user_token", this.VueCookies.get("application_token"));

				this.$api.project_serviceUpload(formData).then(data =>{
					if(data.code == 0){
						// 回调成功的方法
						params.onSuccess(data);
						this.$message.success(data.msg);
					}else{
						this.$message.error(data.msg);
					}
				});
			},
			
      // 上传成功
			handleSuccess(res, file, fileList) {
				this.filesList = fileList;
      },
      // 移除上传文件
      handleRemove(file,fileList) {
      	var path;
      	if(file.status == 'success'){
          path = file.response.data.path;
        }else{
          return false
        }
				this.filesList = fileList;
				this.$message({message: '成功移除' + file.name, type: 'success'});

				if(this.removeFilesArr.indexOf(path) == -1){
					this.removeFilesArr.push(path);
				}
      },

			// 删除调接口
			removeFile(path){
				this.$api.uploadDel({
      		path:path,
      	}).then(data =>{
					if(data.code == 0){
						// this.$message.success("文件更新成功");
					}else{
						this.$message.error(data.msg);
					}
				});
			},
      
      // 上传前验证
      beforeUpload(file) {
				var isUpload = true;
      	// 验证大小等
				this.filesList.map((fff)=>{
					if(fff.name == file.name){
						this.$message.warning("请不要重复上传相同文件！");
						isUpload = false;
						return;
					}
				})
				return isUpload;
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

      // 工单关闭
      closeService(){
        this.$confirm("您将关闭此工单，关闭之后无法再提交工单信息, 是否继续?", "提示", {
          type: 'warning'
        }).then(() => {
          this.$api.maintenance_serviceDetail({
            id:this.$route.query.id,
            function_type:3,
          }).then(data=>{ 
             if(data.code == 0){
                this.$message({
                  message: data.msg,
                  type: 'success'
                });
                this.initDetail();
             }else{
               this.$message.error(data.msg);
             }
          })
        }).catch(() => {

        });
      },

    },
  }
</script>

<style lang="scss" scoped>

</style>