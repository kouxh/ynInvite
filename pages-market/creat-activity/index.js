const post = require('../../utils/post.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityInfo:{
      name:'',
      starTime:'',
      endTime:'',
      city:'',
      person:'',
      tell:'',
      isRoom:'-1',
      isStay:'-1',
      branchRoom:[{}],
      limits:'',
      imgUrl:'',
      department:[]
    },//创建活动数据
    calendarShow:false,//日历弹框
    checkedIndex:-1,
    checkedIndex1:-1,
    checkedIndex2:-1,
    checkedIndex3:-1,
    postList: Object.assign([], post.default.department),
    firstData:[],//一级数据
    firstShow:false,//是否展示提名部门弹框
    twoData:[],//二级数据
    twoShow:false,//二级部门弹框是否展示
    threeData:[],//三级数据
    threeShow:false,//三级部门弹框是否展示
    fourData:[],//四级数据
    fourShow:false,//四级部门弹框是否展示
    fileList: [],//获取邀请函
    imgUrl:'',
    typeTime:1,//区别开始时间 获取结束时间
    outputBool: true, // '开始时间'是否大于'结束时间' 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let firstId=219;
    this.setData({
      firstData: this.checkFn(firstId)
    })
  },
  // 通过parentid获取相应数据
  checkFn(parentId){
    let that = this;
    let arr = this.data.postList.filter(item => {
      return item.parentid==parentId
    })
    let hierarchy=arr.map(x=>{
      x.childrens=that.checkFn(x.id)
     return x
    });
    return hierarchy
  },
  // 添加内容
  addList: function(){
    let  conLists = this.data.activityInfo.branchRoom;
    if(conLists.length==0){
      let newData = {};
      conLists.push(newData);//实质是添加conLists数组内容，使for循环多一次
      this.setData({
        "activityInfo.branchRoom": conLists,
      })
    }else{
      for (let i = 0; i < conLists.length; i++) {
        if (Object.keys(conLists[i]).length === 0) {
          wx.showToast({
            title: '请输入第' + `${i * 1 + 1}` + '条内容！',
            icon: 'none'
          })
          return;
        }
      }
      conLists.push("")
      this.setData({
        "activityInfo.branchRoom": conLists,
      })
    }
  },
  //删除每一条
  delList: function () {
    let  conLists = this.data.activityInfo.branchRoom;
    conLists.pop();      //实质是删除conLists数组内容，使for循环少一次
    this.setData({
      "activityInfo.branchRoom": conLists,
    })
  },   
  /**
   * 获取输入的内容标题
   */
  changeConTitle(e) {
    var idx = e.currentTarget.dataset.index; //当前下标
    var val = e.detail.value; //当前输入的值
    var _list =this.data.activityInfo.branchRoom; //data中存放的数据
    for (let i = 0; i < _list.length; i++) {
      if (idx == i) {
        _list[i] = { roomLabel: val } //将当前输入的值放到数组中对应的位置
      }
    }
    this.setData({
      "activityInfo.branchRoom": _list
    })
    console.log(this.data.activityInfo.branchRoom,'this.data.activityInfo.branchRoom')
  },
  //点击提名部门
  firstFn(){
      let that=this
      that.setData({
        firstShow:true,
        // firstData:this.checkFn(219)
        // checkedIndex:-1
      });
  },
  //点击一级每一项
  onSelect(e){
    let childrens=e.currentTarget.dataset.childrens;
    let oneId=e.currentTarget.dataset.id;
    let index=e.currentTarget.dataset.index;
    let name=e.currentTarget.dataset.name;
    let department = this.data.activityInfo.department;
    let type=e.currentTarget.dataset.type;
    if(childrens.length==0){
      let newData={}
      newData.id=oneId;
      newData.name=name
      department.push(newData);
      if(type==0){
        this.setData({
          firstShow:false,
          checkedIndex:index,
        })
      }else if(type==1){
        this.setData({
          twoShow:false,
          checkedIndex1:index,
        })
      }else if(type==2){
        this.setData({
          threeShow:false,
          checkedIndex2:index,
        })
      }else{
        this.setData({
          fourShow:false,
          checkedIndex3:index,
        })
      }
        this.setData({
          "activityInfo.department":this.unique(department)
        })
    }else{
        //  this.setData({
        //   checkedIndex:index,
        //   firstData:childrens,
        // })
      if(type==0){
        this.setData({
          checkedIndex:index,
          twoData:childrens,
          firstShow:false,
          twoShow:true
        })
      }else if(type==1){
        this.setData({
          checkedIndex1:index,
          threeData: childrens,
          twoShow:false,
          threeShow:true
        })
      }else if(type==2){
        this.setData({
          checkedIndex2:index,
          fourData: childrens,
          threeShow:false,
          fourShow:true

        })
      }else{
        this.setData({
          checkedIndex3:index,
          fourData: childrens,
          fourShow:false,
        })
      }
      
    }
  },
  //点击返回一级
  backFn(e){
    let type=e.currentTarget.dataset.type;
    if(type==1){
      this.setData({
        twoShow:false,
        firstShow:true
      })
    }else if(type==2){
      this.setData({
        threeShow:false,
        twoShow:true
      })
    }else if(type==3){
      this.setData({
        fourShow:false,
        threeShow:true,
      })
    }
  },
  //删除提名部门
  deleteFn(e){
    let idx = e.currentTarget.dataset.index;
    let  department = this.data.activityInfo.department;
    for (let i = 0; i < department.length; i++) {
      if (idx == i) {
        department.splice(idx, 1)
      }
    }
    this.setData({
      "activityInfo.department": department
    })
  },
  //表单项内容发生改变的回调
  handleInput(event){
    let type=event.currentTarget.id;
    this.setData({
      [type]:event.detail.value
    })
    console.log(event.detail.value,'----')
  },
  //点击提交按钮
  submitFn(){
    let that = this;
    var roomArr = [];
    let {activityInfo}=that.data;
    if(activityInfo.name==''){
      return wx.showToast({ title: "请输入客户姓名", icon: "none" });
    }
    if (activityInfo.starTime == "")
      return wx.showToast({ title: "请选择开始时间", icon: "none" });
    if (activityInfo.endTime == "")
      return wx.showToast({ title: "请选择结束时间", icon: "none" });
    if (!this.data.outputBool)
      return wx.showToast({ title: "结束时间请大于开始时间", icon: "none" });
    if (activityInfo.city == "")
    return wx.showToast({ title: "请输入城市", icon: "none" });
    if (activityInfo.person == "")
    return wx.showToast({ title: "请输入活动负责人", icon: "none" });
    if (
      !/^1[3-9]\d{9}$/.test(activityInfo.tell) ||
      activityInfo.tell == ""
    ) {
      return wx.showToast({ title: "请输入负责人手机号", icon: "none" });
    }
    if(activityInfo.isRoom == "-1"){
      return wx.showToast({ title: "请选择是否有分会场", icon: "none" });
    }else if(activityInfo.isRoom == "0"&&activityInfo.branchRoom.length>0){
      for (let i = 0; i < activityInfo.branchRoom.length; i++) {
        if (Object.keys(activityInfo.branchRoom[i]).length === 0) {
          wx.showToast({
            title: '请输入第' + `${i * 1 + 1}` + '条内容！',
            icon: 'none'
          })
          return;
        }
        roomArr.push(activityInfo.branchRoom[i].roomLabel);
      }
      console.log(roomArr.toString())
    }
    if(activityInfo.isStay=='-1'){
      return wx.showToast({ title: "是否提供住宿", icon: "none" });
    }
    if(activityInfo.limits==''){
      return wx.showToast({ title: "请输入活动权限", icon: "none" });
    }
    if(activityInfo.limits==''){
      return wx.showToast({ title: "请输入活动权限", icon: "none" });
    }
    if(activityInfo.imgUrl==''){
      return wx.showToast({ title: "请上传邀请函附件", icon: "none" });
    }
    if(activityInfo.department.length==0){
      return wx.showToast({ title: "请选择提名部门", icon: "none" });
    }
    let ids = activityInfo.department.map(c => c.id);
    wx.navigateTo({
      url: '/pages-market/submit/index',
    })
  },
  // 是否分会场
  onChange(event) {
    this.setData({
      'activityInfo.isRoom': event.detail,
      "activityInfo.branchRoom": [{}],
    });
  },
  //是否提供住宿
  onSwitch(e){
    this.setData({
      'activityInfo.isStay': e.detail,
    });
  },
  //展示日历弹框
  onDisplay(e) {
    this.setData({ 
      calendarShow: true,
      typeTime:e.currentTarget.dataset.time
    });
    console.log(e.currentTarget.dataset.time,'times')
  },
  //关闭日历弹框
  onClose() {
    this.setData({ calendarShow: false });
  },
  //时间格式化转化
  formatDate(date) {
    date = new Date(date);
    return `2021/${date.getMonth() + 1}/${date.getDate()}`;
  },
  //点击时间确认按钮
  onConfirm(event) {
    if(this.data.typeTime==1){
      this.setData({
        calendarShow: false,
        'activityInfo.starTime':  this.formatDate(event.detail),
      });
    }else{
      this.setData({
        calendarShow: false,
        'activityInfo.endTime':  this.formatDate(event.detail),
      });
      // if (!outputBool){
      //   return wx.showToast({ title: "结束时间请大于开始时间", icon: "none" });
      // }
    }
    let outputBool=
    new Date(this.data.activityInfo.starTime.replace(/-/g, "/")) <=
    new Date(this.data.activityInfo.endTime.replace(/-/g, "/"))
    // '开始时间'是否大于'结束时间'
    this.setData({
      outputBool:outputBool
    });
  },
  //图片上传
  afterRead(event) {
    let that =this;
    const { file } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: 'https://www.chinamas.cn/laravelUploadImg', // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'file',
      formData: { user: 'test' },
      success(res) {
        // 上传完成需要更新 fileList
        var result=JSON.parse(res.data)
        console.log(result)
        const { fileList = [] } = that.data;
        fileList.push({ ...file, url: res.data });
        that.setData({ fileList });
        that.setData({ "activityInfo.imgUrl":result.data.src });
      },
    });
  },
   // 删除图片
  delete(event) {
     let imgDelIndex = event.detail.index
     let fileList = this.data.fileList
     fileList.splice(imgDelIndex,1)
     this.setData({
       fileList
     })
  },
  unique:function (arr) {
      if (!Array.isArray(arr)) {
          return
      }
      let res = [arr[0]]
      for (let i = 1; i < arr.length; i++) {
          let flag = true
          for (let j = 0; j < res.length; j++) {
              if (arr[i].id === res[j].id) {
                  flag = false;
                  break
              }
          }
          if (flag) {
              res.push(arr[i])
          }
      }
      return res
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})