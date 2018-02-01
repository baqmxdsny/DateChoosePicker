// pages/add-schedule/add-schedule.js
var app = getApp();
var utils = require("../../utils/utils.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textareaDisabled:false,
    beginDateNoSubmit: {},          //存储选择时间未点确定的数据点击取消后清空
    beginDateNoSubmit2: {},         //存储选择时间点击确定防止点击取消数据消失
    endDateNoSubmit: {},
    endDateNoSubmit2: {},
    canClick: false,
    // dateChoose:{},
  },

  onChooseDateListener(e) {
    if (!this.data.textareaDisabled) {
      this.setData({
        textareaDisabled: true,
        beginDateNoSubmit: this.data.beginDateNoSubmit2,
        endDateNoSubmit: this.data.endDateNoSubmit2,
      })
    }
    var that = this;
    // console.log(e);

    if (e.currentTarget.dataset.tag == "begin") {
      var event = {
        Type: "begin",

      }

      that.getNeedChangeDate(event, that.data.scheduleBegintime, that.data.scheduleEndtime)


    } else {
      var event = {
        Type: "end",
      }

      that.getNeedChangeDate(event, that.data.scheduleBegintime, that.data.scheduleEndtime)

    }


  },

  /**
   *    初始化时间
   */
  initDate() {
    var that = this;
    var chooseBeginDate = utils.transformDate(that.data.cur_year, that.data.cur_month, that.data.cur_day);
    var chooseEndDate = utils.transformDate(that.data.cur_year, that.data.cur_month, that.data.cur_day);
    var chooseBeginTime = utils.transformTime(that.data.cur_hours, that.data.cur_minutes);
    var chooseEndTime = utils.transformTime(that.data.cur_hours, that.data.cur_minutes);
    var chooseBegin_monorafter = 'AM'
    var chooseEnd_monorafter = 'AM'
    if (that.data.cur_hours > 11) {
      chooseBegin_monorafter = 'PM';
      chooseEnd_monorafter = 'PM';
    }
    var endHours = that.data.cur_hours;
    var scheduleDate = utils.transformDate2(that.data.cur_year, that.data.cur_month, that.data.cur_day);
    var scheduleBegintime = scheduleDate + " " + that.data.cur_hours+":"+that.data.cur_minutes;
    var scheduleEndtime = scheduleDate + " " + endHours+":"+ that.data.cur_minutes;
    that.setData({
      chooseBeginDate,
      chooseEndDate,
      chooseBeginTime,
      chooseEndTime,
      chooseEnd_monorafter,
      chooseBegin_monorafter,

      scheduleDate: scheduleDate,
      scheduleBegintime: scheduleBegintime,
      scheduleEndtime: scheduleEndtime,
    })
    var e = {
      currentTarget: {
        dataset: {
          tag: "begin"
        }
      }
    };
    this.onChooseDateListener(e)
  },




  /**
   * 获取当前时间
   */
  getCurrentDate(e) {
    var date;
    // console.log(e)
    if (e) {
      var curDate = e.replace(/-/g, "/");
      date = new Date(Date.parse(curDate))
    } else {
      date = new Date();
    }
    
    console.log("getCurrentDate: "+date);

    console.log("getCurrentDate: " + date.getHours());
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const cur_hours = date.getHours();
    const cur_day = date.getDate();
    const cur_minutes = date.getMinutes();
    this.setData({
      cur_year,
      cur_month,
      cur_day,
      cur_hours,
      cur_minutes,
      beginNCYear: cur_year,
      beginNCMonth: cur_month, 
      beginNCDay: cur_day, 
      beginNCHours24: cur_hours, 
      beginNCMinutes: cur_minutes,
    });
  },

  /**
   * 时间选择改变
   */
  pickerChange(e) {


    console.log(e);
    var that = this;
    const val = e.detail.value;
    var isBegin = this.data.dateChoose.isBegin;          //判断点击是否是开始时间
    // console.log("isBegin" + isBegin)

    var picker_day = [];
    var choose_year = this.data.dateChoose.picker_year[val[0]];
    var choose_month = this.data.dateChoose.picker_month[val[1]];
    var choose_day = this.data.dateChoose.picker_day[val[2]];
    var choose_hours = this.data.dateChoose.picker_hours[val[3]];
    var choose_minutes = this.data.dateChoose.picker_minutes[val[4]];
    var choose_minorafter = this.data.dateChoose.picker_monorafter[val[5]];
    var changDate = utils.transformDate(choose_year, choose_month, choose_day);
    console.log(changDate);
    var changTime = choose_hours + ":" + choose_minutes;
    var dateChoose = this.data.dateChoose;
    var begin_choose_month;
    var end_choose_month;
    if (isBegin) {
      //设置数组存储改变后数据  未确认提交   临时使用  
      var beginDateNoSubmit = {
        changDate: changDate,
        changTime: changTime,
        choose_minorafter: choose_minorafter,
        val: val,
      };
      // console.log("beginDateNoSubmit+++");
      // console.log(beginDateNoSubmit);      
      // 更改滚动选择器天数
      if (this.data.begin_choose_month != choose_month || choose_year != this.data.choose_year) {
        // console.log("改变  天数 了")
        picker_day = utils.getDays(choose_year, choose_month);
        // console.log("pickerChange   isBegin")
        // console.log(picker_day)
        dateChoose.picker_day = picker_day;       //  月份改变   天数改变
        // that.setData({
        //   dateChoose: dateChoose,
        // })
      }
      that.setData({
        beginDateNoSubmit: beginDateNoSubmit,
        begin_choose_month: choose_month,
        // beginDateNoSubmit2: beginDateNoSubmit,
      })

      dateChoose.beginDate = changDate;
      dateChoose.beginTime = changTime;
      dateChoose.begin_monorafter = choose_minorafter;
    } else {
      var endDateNoSubmit = {
        changDate: changDate,
        changTime: changTime,
        choose_minorafter: choose_minorafter,
        val: val,
      };

      // console.log("endDateNoSubmit+++");
      // console.log(endDateNoSubmit);    
      if (this.data.end_choose_month != choose_month || choose_year != this.data.choose_year) {
        // console.log("改变  天数 了")
        picker_day = utils.getDays(choose_year, choose_month);
        // console.log("pickerChange   isBegin")
        // console.log(picker_day)
        dateChoose.picker_day = picker_day;       //  月份改变   天数改变
        // that.setData({
        //   dateChoose: dateChoose,
        // })
      }
      that.setData({
        endDateNoSubmit: endDateNoSubmit,
        end_choose_month: choose_month,
        // endDateNoSubmit2: endDateNoSubmit,
      })

      dateChoose.endDate = changDate;
      dateChoose.endTime = changTime;
      dateChoose.end_monorafter = choose_minorafter;
    }

    dateChoose.picker_value = val;            //  将位置改变
    const date = new Date(Date.UTC(choose_year, choose_month, choose_day));
    var choose_week = utils.getCurrentWeeks(date)
    // console.log("choose_year" + choose_year + "choose_month" + choose_month + "choose_day" + choose_day + "choose_week" + choose_week);

    console.log(dateChoose)
    this.setData({
      choose_year,
      choose_month,
      choose_day,
      choose_hours,
      choose_minutes,
      choose_week,
      choose_minorafter,
      dateChoose,
    })
  },
  /**
   * 时间选择确认
   */
  dateFormSubmit(e) {
    var that = this;
    console.log(this.data.dateChoose);
    var beginDate = this.data.dateChoose.beginDate;
    var beginTime = this.data.dateChoose.beginTime;
    var begin_monorafter = this.data.dateChoose.begin_monorafter;
    var endDate = this.data.dateChoose.endDate;
    var endTime = this.data.dateChoose.endTime;
    var end_monorafter = this.data.dateChoose.end_monorafter;

    // 将年月日截取成  yyyy-mm-dd
    var scheduleDate = utils.cutDate(beginDate);
    if (begin_monorafter == "PM") {
      beginTime = utils.changTimePM(beginTime)
    } else {
      beginTime = utils.changTimeAM(beginTime)
    }
    var scheduleBegintime = scheduleDate + " " + beginTime;

    var scheduleDateEnd = utils.cutDate(endDate);
    console.log("scheduleBegintime" + scheduleBegintime);
    if (end_monorafter == "PM") {
      endTime = utils.changTimePM(endTime)
    } else {
      endTime = utils.changTimeAM(endTime)
    }
    var scheduleEndtime = scheduleDateEnd + " " + endTime;
    console.log("scheduleEndtime" + scheduleEndtime);


    if (that.checkEndAndBegin(scheduleBegintime, scheduleEndtime)) {
      this.setData({
        scheduleDate,
        scheduleBegintime,
        scheduleEndtime,
        chooseBeginDate: beginDate,
        chooseBeginTime: this.data.dateChoose.beginTime,
        chooseBegin_monorafter: begin_monorafter,
        chooseEndDate: endDate,
        chooseEndTime: this.data.dateChoose.endTime,
        chooseEnd_monorafter: end_monorafter,
        showDateChooseStatus: false,
        textareaDisabled: false,
        beginDateNoSubmit2: this.data.beginDateNoSubmit,
        endDateNoSubmit2: this.data.endDateNoSubmit,
      })
    } else {
      wx.showToast({
        title: "结束早于开始",
        icon: "loading",
        duration: 500,
      })
    }
  },

  /**
   * 判断结束时间是否早于开始时间
   */
  checkEndAndBegin(scheduleBegintime, scheduleEndtime) {
    var beginDate2 = scheduleBegintime.replace(/-/g, "/");

    var beginDate = new Date(Date.parse(beginDate2)).getTime() / 1000 / 60;
    beginDate = parseInt(beginDate);
    // console.log("beginDate2：" + beginDate2 + "beginDate" + beginDate);

    var endDate2 = scheduleEndtime.replace(/-/g, "/");

    var endDate = new Date(Date.parse(endDate2)).getTime() / 1000 / 60;
    endDate = parseInt(endDate);
    // console.log("endDate2" + endDate2 + "endDate" + endDate);

    var scheduleUseTime = endDate - beginDate;
    // console.log("scheduleUseTime" + scheduleUseTime);

    if (scheduleUseTime < 0) {
      return false;
    } else {
      return true;
    }
  },
  /**
   * 时间选择取消
   */
  dateFormReset(e) {
    this.setData({
      showDateChooseStatus: false,
      beginDateNoSubmit: {},
      endDateNoSubmit: {},
      textareaDisabled: false,
    })
  },
  /**
   * 点击灰色背景
   */
  powerDrawer(e) {
    this.setData({
      showThingCheckStatus: false,
      showDateChooseStatus: false,
      showShareStatus: false,
      beginDateNoSubmit: {},
      endDateNoSubmit: {},
      textareaDisabled: false,
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var comeDate = options.comeDate;


    // console.log(comeDate)
    var isSDComing = false;                 //标记是否是从日程详情  转过来修改
    if (options.scheduleData) {

      isSDComing = true;
      var scheduleData = JSON.parse(options.scheduleData);
      // console.log(scheduleData)

      var scheduleId = scheduleData.scheduleId;
      var thingContent = scheduleData.scheduleType;
      var isAllDayNumber = scheduleData.isAllDay;
      var isAllDay = isAllDayNumber;
      var isUrgentNumber = scheduleData.isUrgent;
      var urgentIsChecked = true;
      if (isUrgentNumber == 0) {
        urgentIsChecked = false;
      }
      var allDayIsChecked = true;
      if (isAllDayNumber == 0) {
        allDayIsChecked = false;
      }
      var isFinishNumber = scheduleData.isFinish;
      var isFinish = true;
      if (isFinishNumber == 0) {
        isFinish = false;
      }
      var scheduleBegintime = scheduleData.scheduleBegintime;
      var scheduleEndtime = scheduleData.scheduleEndtime;
      var chooseBeginDate = utils.cutDateToYMD(scheduleData.scheduleBegintime);
      var chooseBeginTime24 = utils.cutDateToTime(scheduleData.scheduleBegintime);
      var chooseBeginTime = utils.changTime24To12(chooseBeginTime24);
      var chooseBegin_monorafter = utils.getHoursOfTime(chooseBeginTime24);
      // console.log(chooseBeginTime24+":"+chooseBegin_monorafter)
      chooseBegin_monorafter = utils.checkAMAndPM(chooseBegin_monorafter);
      var chooseEndDate = utils.cutDateToYMD(scheduleData.scheduleEndtime);
      var chooseEndTime24 = utils.cutDateToTime(scheduleData.scheduleEndtime);
      var chooseEndTime = utils.changTime24To12(chooseEndTime24);
      var chooseEnd_monorafter = utils.getHoursOfTime(chooseEndTime24);
      chooseEnd_monorafter = utils.checkAMAndPM(chooseEnd_monorafter);
      var location = scheduleData.scheduleAddress;
      var data = {
        chooseBeginDate,
        chooseBeginTime,
        chooseBegin_monorafter,
        chooseEndDate,
        chooseEndTime,
        chooseEnd_monorafter,
        isFinish,
        isAllDay,
        thingContent,
        location,
        allDayIsChecked,
        urgentIsChecked,
      }
      // console.log(data)
      this.setData({
        scheduleId,
        isSDComing,
        scheduleData,
        chooseBeginDate,
        chooseBeginTime,
        chooseBegin_monorafter,
        chooseEndDate,
        chooseEndTime,
        chooseEnd_monorafter,
        isFinish,
        isAllDay,
        thingContent,
        location,
        allDayIsChecked,
        urgentIsChecked,
        scheduleBegintime,
        scheduleEndtime,
      })

      if (scheduleData.isShare) {
        this.onMarkMsgTap()
        this.setData({
          textareaDisabled: true,
          showShareStatus: true,

        })
      }
    } else {
      //   不是修改  获取当前时间设置   时间选择开始时间
      this.getCurrentDate(comeDate);
      this.initDate();
    }



    // this.getCurrentDate();
    // this.initDate();
    // this.getRemindData();
    // this.test();

  },

  /**
   * 将需要修改的日程数据显示在滚轮上
   */
  getNeedChangeDate(e, beginNeedChangDate, endNeedChangDate) {

    var beginNCDateString = beginNeedChangDate.replace(/-/g, "/");
    var beginNCDate = new Date(Date.parse(beginNCDateString));
    var endNCDateString = endNeedChangDate.replace(/-/g, "/");
    var endNCDate = new Date(Date.parse(endNCDateString));

    var beginNCYear = beginNCDate.getFullYear();
    var beginNCMonth = beginNCDate.getMonth() + 1;
    var beginNCDay = beginNCDate.getDate();

    var beginNCHours24 = beginNCDate.getHours();
    var beginNCMinutes = beginNCDate.getMinutes();


    var endNCYear = endNCDate.getFullYear();
    var endNCMonth = endNCDate.getMonth() + 1;
    var endNCDay = endNCDate.getDate();
    var endNCHours24 = endNCDate.getHours();
    var endNCMinutes = endNCDate.getMinutes();


    // console.log("beginNCMonth:" + beginNCMonth);

    var isBegin = false;
    if (e.Type == "begin") {
      isBegin = true;
    }

    var that = this;
    var picker_year = utils.getYear();
    var picker_month = utils.getMonth();
    var picker_day = [];
    var picker_hours = utils.getHours();
    var picker_minutes = utils.getMinutes();
    var picker_monorafter = ['AM', 'PM'];


    var beginDateNoSubmit = this.data.beginDateNoSubmit;

    var endDateNoSubmit = this.data.endDateNoSubmit;

    if (beginDateNoSubmit.changTime) {
      if (isBegin) {
        var picker_value = beginDateNoSubmit.val;

        var beginChooseDateC = utils.cutDate(beginDateNoSubmit.changDate) + " " + beginDateNoSubmit.changTime;
        beginChooseDateC = utils.changString2Date(beginChooseDateC);
        var curY = beginChooseDateC.getFullYear();
        var curM = beginChooseDateC.getMonth() + 1;
        picker_day = utils.getDays(curY, curM);
      }
      var beginTime = beginDateNoSubmit.changTime;
      var beginDate = beginDateNoSubmit.changDate;
      var begin_monorafter = beginDateNoSubmit.choose_minorafter;
    } else {

      var picker_day_begin = utils.getDays(beginNCYear, beginNCMonth);
      var picker_value_begin = utils.getTodayDate(picker_year, picker_month, picker_day_begin, picker_hours, picker_minutes, picker_monorafter, beginNCYear, beginNCMonth, beginNCDay, beginNCHours24, beginNCMinutes);
      // }
      if (isBegin) {
        picker_value = picker_value_begin;
        var picker_day = picker_day_begin;
      }

      var beginDate = utils.transformDate(beginNCYear, beginNCMonth, beginNCDay);
      var beginTime = utils.transformTime(beginNCHours24, beginNCMinutes);
      var begin_monorafter = 'AM'
      if (beginNCHours24 > 11) {
        begin_monorafter = 'PM';
      }
      var beginDateNoSubmit = {
        changDate: beginDate,
        changTime: beginTime,
        choose_minorafter: begin_monorafter,
        val: picker_value_begin,
      };

    }

    // console.log("endDateNoSubmit----");
    // console.log(endDateNoSubmit);
    if (endDateNoSubmit.changTime) {
      if (!isBegin) {
        var picker_value = endDateNoSubmit.val;

        var beginChooseDateC = utils.cutDate(beginDateNoSubmit.changDate) + " " + beginDateNoSubmit.changTime;
        beginChooseDateC = utils.changString2Date(beginChooseDateC);

        var endChooseDateC = utils.cutDate(endDateNoSubmit.changDate) + " " + endDateNoSubmit.changTime;
        endChooseDateC = utils.changString2Date(endChooseDateC);
        var curY = endChooseDateC.getFullYear();
        var curM = endChooseDateC.getMonth() + 1;
        picker_day = utils.getDays(curY, curM);
      }

      var endTime = endDateNoSubmit.changTime;
      var endDate = endDateNoSubmit.changDate;
      var end_monorafter = endDateNoSubmit.choose_minorafter;
    } else {

      var picker_day_end = utils.getDays(endNCYear, endNCMonth);
      var picker_value_end = utils.getTodayDate(picker_year, picker_month, picker_day_end, picker_hours, picker_minutes, picker_monorafter, endNCYear, endNCMonth, endNCDay, endNCHours24, endNCMinutes);
      if (!isBegin) {
        picker_value = picker_value_end;
        var picker_day = picker_day_end;
      }

      var endDate = utils.transformDate(endNCYear, endNCMonth, endNCDay);
      var endTime = utils.transformTime(endNCHours24, endNCMinutes);
      var end_monorafter = 'AM'
      if (endNCHours24 > 11) {
        end_monorafter = 'PM';
      }
      var endDateNoSubmit = {
        changDate: endDate,
        changTime: endTime,
        choose_minorafter: end_monorafter,
        val: picker_value_end,
      };
    }

    var beginToEnd = '../images/ic_arrow_right.png'


    var dateChoose = {
      beginDate: beginDate,
      endDate: endDate,
      beginTime: beginTime,
      endTime: endTime,
      begin_monorafter: begin_monorafter,
      end_monorafter: end_monorafter,
      beginToEnd: beginToEnd,
      picker_year: picker_year,
      picker_month: picker_month,
      picker_day: picker_day,
      picker_hours: picker_hours,
      picker_minutes: picker_minutes,
      picker_value: picker_value,
      picker_monorafter: picker_monorafter,
      isBegin: isBegin,
      isChooseYearMonth: false,
      show: true,


    }
    // console.log(dateChoose);
    this.setData({
      endDateNoSubmit: endDateNoSubmit,
      beginDateNoSubmit: beginDateNoSubmit,
      picker_value: picker_value,
      picker_year,
      picker_month,
      picker_day,
      picker_hours,
      picker_minutes,
      picker_monorafter,
      dateChoose: dateChoose,
      showDateChooseStatus: true,
    })
  },


  /**
   * 弹出框选择年月
   */
  isYearMonthListener(e) {
    // console.log(e);
    var isChooseYearMonth = e.detail.value;
    var dateChoose = this.data.dateChoose;

    dateChoose.isChooseYearMonth = isChooseYearMonth;

    console.log("dateChoose");
    console.log(dateChoose);
    this.setData({
      dateChoose: dateChoose,
    })
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