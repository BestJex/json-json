const $ = require('jquery')

function JsonView(renderTo, options) {
  this.dom = $(renderTo)
  this.jsonTreeView = $('.s-tree-view', this.dom)
  this.jsonTableView = $('.s-table-view', this.dom)
  this.jsonPathExpInput = $('.s-path-exp', this.dom)
  this.max_deep = 1
  this.getMaxDeep = function(jsObject,deep) {
    if(deep==undefined)deep=1
    var __thisData = {}
    if ($.isArray(jsObject)) {
      if(this.max_deep<deep){
        this.max_deep = deep
      }
      jsObject.forEach((thisItem,index) => {
        this.getMaxDeep(thisItem,deep+1)
      })
    } else if ($.isPlainObject(jsObject)) {
      if(this.max_deep<deep){
        this.max_deep = deep
      }
      var _keys = Object.keys(jsObject)
      _keys.forEach(thisKey => {
        this.getMaxDeep(jsObject[thisKey],deep+1)
      })
    }
  }
  this.expandByLevel = function(maxLevel,thisLevel,items){
    if(thisLevel>=maxLevel)return
    if(items==undefined){
      console.log('expand:',maxLevel)
      $('.c-row-opened > .c-map-row-key >.c-4-icon', this.jsonTreeView).click()
      items = $('> .c-row', this.jsonTreeView)
      this.expandByLevel(maxLevel,1,items)
    }else{
      // console.log(items.length)
      items.each((index,thisItem) => {
        var __btn = $('> .c-map-row-key >.c-4-icon',thisItem)
        if(!$(thisItem).is('.c-row-opened')){
          __btn.click()
        }
        if(thisLevel<maxLevel){
          this.expandByLevel(maxLevel,thisLevel+1,$('> .c-container > .c-row', thisItem))
        }
      })
    }
  }
  this.jsonObject = {}
  this.jsonString = '{}'
  var ___global_var_name = 'seeks_g_data'
  this.show = function(json_string) {
    this.jsonString = json_string
    this.jsonObject = JSON.parse(this.jsonString)
    $('.s-expand-deep', this.dom).click((e) => {
      if($(e.target).is('.c-deep-level-item')){
        $('.s-expand-deep .c-deep-level-item-checked', this.dom).removeClass('c-deep-level-item-checked')
        $(e.target).addClass('c-deep-level-item-checked')
        this.expandByLevel(parseInt($(e.target).text()))
      }
    })
    this.jsonTreeView.click((e) => {
      var __t = $(e.target)
      // console.log(__t.html())
      if(__t.is('.c-4-icon')||__t.is('.c-vdesc-end')||__t.is('.c-expend')||__t.is('.c-tag')){
        var __row = __t.parents('.c-row:first')

        if(__row.attr('inited')!=='1'){
          __row.attr('inited','1')
          var __pathExp = __row.attr('pathExp')
          var __container = $('> .c-container',__row)
          // console.log(__container.length)
          if(__container.length==0){
            __container = $('<div class="c-container"></div>')
            __row.append(__container)
          }
          window[___global_var_name] = this.jsonObject
          var _exp = 'window[\''+___global_var_name+'\']'+__pathExp
          if (__pathExp) {
            console.log('renderObjectInDom:', _exp)
            this.renderObjectInDom(eval(_exp), __container, __pathExp)
          }
        }
        if(__row.is('.c-row-opened')){
          $('> .c-map-row-key >.c-4-icon',__row).text('+')
          __row.removeClass('c-row-opened')
        }else{
          $('> .c-map-row-key >.c-4-icon',__row).text('-')
          __row.addClass('c-row-opened')
        }
      }else if(__t.is('.c-map-row-key')||__t.is('.c-arr-index')){
        var __row = __t.parents('.c-row:first')
        if(__row.length>0) {
          var __pathExp = __row.attr('pathExp')
          this.jsonPathExpInput.text(__pathExp)
          window[___global_var_name] = this.jsonObject
          var _exp = 'window[\''+___global_var_name+'\']'+__pathExp
          console.log('refreshTableView:', _exp)
          this.refreshTableView(eval('window[\''+___global_var_name+'\']'+__pathExp), __pathExp)
        }
      }
    })
    this.jsonTableView.click((e) => {
      var __t = $(e.target)
      if(__t.is('.c-4-icon')||__t.is('.c-vdesc-end')||__t.is('.c-expend')){
        var __row = __t.parents('.c-exp-node:first')
        var __pathExp = __row.attr('pathExp')
        if(__pathExp){
          this.expandByPathExp(__pathExp)
        }
      }
    })

    this.jsonPathExpInput.keydown((event) => {
      if (event.keyCode == 13) {
        try{
          var __pathExp = this.jsonPathExpInput.text().replace(/ /g,'')
          this.expandByPathExp(__pathExp)
          window[___global_var_name] = this.jsonObject
          this.refreshTableView(eval('window[\''+___global_var_name+'\']'+__pathExp), __pathExp)
        }catch (e) {
          console.log(e)
        }
        return false
      }
    }).on('paste',function(){
      window.setTimeout(() => {
        this.jsonPathExpInput.text(this.jsonPathExpInput.text())
      },200)
    })


    // console.log(JSON.stringify(data, null, "\t"))
    // expandByPathExp("['RELA_ENT_DATA_GUQUANZHIYA'][1]['data'][1]['companyList'][0]")
    this.initByJsonstring()
  }
  this.initByJsonstring = function(jsonString){
    var __root = this.jsonTreeView
    __root.empty()
    $('.s-expand-deep', this.dom).empty()
    this.jsonTableView.empty()
    this.max_deep=0
    try{
      this.jsonObject = JSON.parse(this.jsonString)
    }catch (e) {
      console.log('非规范格式处理：', this.jsonString)
      this.jsonObject = eval('(function(){return '+this.jsonString+'})()')
    }

    var __t_root_info = this.getObjectInfo(this.jsonObject)
    __root.append('<div style="display: block;color: yellow;">'+(__t_root_info.type=='object'?'{':(__t_root_info.type=='array'?'[':''))+'</div>')
    this.renderObjectInDom(this.jsonObject, __root, '')
    __root.append('<div style="display: block;color: yellow;">'+(__t_root_info.type=='object'?'}':(__t_root_info.type=='array'?']':''))+'</div>')
    this.getMaxDeep(this.jsonObject)

    for(var i=1;i<=this.max_deep;i++){
      $('.s-expand-deep', this.dom).append('<span class="c-deep-level-item">'+i+'</span>');
    }

    $('.s-expand-deep > .c-deep-level-item:first', this.dom).click()
  }
  this.expandByPathExp = function(pathExp){
    var __arr = pathExp.replace(/\./g,']').split(']')
    console.log(__arr)
    var __path_arr = []
    __arr.forEach(thisPath=>{
      thisPath = thisPath.replace('[','')
      if(thisPath!=''){
        if((''+thisPath)!==(parseInt(thisPath)+'')){
          thisPath = thisPath.replace('\"','\'')
          if(!thisPath.startsWith('\'')){
            thisPath = '\''+thisPath+'\''
          }
          __path_arr.push('['+thisPath+']')
        }else{
          __path_arr.push('['+thisPath+']')
        }
      }
    })
    console.log(__path_arr)
    var __currentNodes = $('> .c-row', this.jsonTreeView)
    var __currentPath = []
    var __lastRow;
    for(var i=0;i<__path_arr.length;i++){
      __currentPath.push(__path_arr[i])
      __currentNodes.each(function(index,node){
        if($(this).attr('pathExp')==__currentPath.join('')){
          // console.log(index,$(this).attr('pathExp'),__currentPath.join(''))
          __lastRow = $(this)
          var __btn = $('> .c-map-row-key >.c-4-icon',this)
          if(!$(this).is('.c-row-opened')){
            __btn.click()
          }
          __currentNodes = $('.c-row',this)
        }
      })
    }
    this.jsonTreeView.scrollTop(0)
    this.jsonTreeView.scrollTop(__lastRow.offset().top-100)
    console.log(__lastRow.text())
    __lastRow.css({opacity:0}).animate({opacity:1},1000,function(){

    })
  }
  this.getObjectInfo = function(jsObject){
    var __thisData = {}
    var _raw_value = ''
    if($.isArray(jsObject)){
      __thisData.type = 'array'
      _raw_value = '<span class="c-tag">'+jsObject.length+' Item</span> ... '
    }else if($.isPlainObject(jsObject)){
      __thisData.type = 'object'
      _raw_value = '<span class="c-tag">'+Object.keys(jsObject).length+' Key</span> ... '
    }else{
      __thisData.type = 'value'
      if(jsObject === undefined){
        _raw_value = 'undefined'
        __thisData.dtype = 'undefined'
      }else if(jsObject === null){
        _raw_value = 'null'
        __thisData.dtype = 'null'
      }else if(jsObject.constructor === Number){
        _raw_value = jsObject
        __thisData.dtype = 'Number'
      }else if(jsObject.constructor === Boolean){
        _raw_value = jsObject
        __thisData.dtype = 'Boolean'
      }else if(jsObject.constructor === String){
        _raw_value = '\"'+jsObject+'\"'
        __thisData.dtype = 'String'
      }else{
        _raw_value = 'Object:'+jsObject
        __thisData.dtype = 'other'
      }
      __thisData.origin_value = jsObject+''
    }
    __thisData.value = _raw_value
    return __thisData
  }
  this.renderObjectInDom = function(jsObject, _container, pathExp){
    var __thisData = this.getObjectInfo(jsObject)
    // console.log(pathExp, __thisData)
    var isLastItem = false
    if( __thisData.type === 'array'){
      _container.addClass('c-arr-container')
      // console.log(jsObject)
      jsObject.forEach((thisItem,index) => {
        isLastItem = index === jsObject.length-1
        var dotString = isLastItem?'':' ,'
        var thisPathExp = pathExp+'['+index+']'
        var thisRowData = this.getObjectInfo(thisItem)
        var thisArrRowDom
        if(thisRowData.type === 'object'){
          thisArrRowDom = $('<div class="c-row c-arr-row"><span class="c-map-row-key"><span class="c-4-icon">+</span><span class="c-arr-index">'+index+':</span></span><span class="c-value c-expend c-vdesc-obj">{ <span class="c-vdesc-end">'+thisRowData.value+' }</span><span class="c-dot">'+dotString+'</span></span></div>')
        }else if(thisRowData.type === 'array'){
          thisArrRowDom = $('<div class="c-row c-arr-row"><span class="c-map-row-key"><span class="c-4-icon">+</span><span class="c-arr-index">'+index+':</span></span><span class="c-value c-expend c-vdesc-arr">[ <span class="c-vdesc-end">'+thisRowData.value+' ]</span><span class="c-dot">'+dotString+'</span></span></div>')
        }else{
          thisArrRowDom = $('<div class="c-row c-arr-row"><span class="c-map-row-key"><span class="c-4-empty"></span><span class="c-arr-index">'+index+':</span></span><span class="c-value c-value-'+thisRowData.dtype+'">'+thisRowData.value+'</span><span class="c-dot">'+dotString+'</span></div>')
        }
        thisArrRowDom.attr('pathExp',thisPathExp)
        _container.append(thisArrRowDom)
      })
      _container.after('<div class="c-end-tag c-vdesc-arr">]'+($('> .c-value > .c-dot', _container.parent()).text())+'</div>')
    }else if(__thisData.type === 'object'){
      _container.addClass('c-map-container')
      var _keys = Object.keys(jsObject)
      var ___index = 0
      _keys.forEach(thisKey => {
        isLastItem = ___index === _keys.length-1
        ___index++
        var dotString = isLastItem?'':' ,'
        var thisPathExp = pathExp+'[\''+thisKey+'\']'
        var thisRowData = this.getObjectInfo(jsObject[thisKey])
        var thisMapRowDom
        if(thisRowData.type === 'object'){
          thisMapRowDom = $('<div class="c-row c-map-row"><span class="c-map-row-key"><span class="c-4-icon">+</span>\"'+thisKey+'\" : </span><span class="c-value c-expend c-vdesc-obj"> { <span class="c-vdesc-end">'+thisRowData.value+' }</span><span class="c-dot">'+dotString+'</span></span></div>')
        }else if(thisRowData.type === 'array'){
          thisMapRowDom = $('<div class="c-row c-map-row"><span class="c-map-row-key"><span class="c-4-icon">+</span>\"'+thisKey+'\" : </span><span class="c-value c-expend c-vdesc-arr"> [ <span class="c-vdesc-end">'+thisRowData.value+' ]</span><span class="c-dot">'+dotString+'</span></span></div>')
        }else{
          thisMapRowDom = $('<div class="c-row c-map-row"><span class="c-map-row-key"><span class="c-4-empty"></span>\"'+thisKey+'\" : </span><span class="c-value c-value-'+thisRowData.dtype+'">'+thisRowData.value+'</span><span class="c-dot">'+dotString+'</span></div>')
        }
        thisMapRowDom.attr('pathExp',thisPathExp)
        _container.append(thisMapRowDom)
      })
      _container.after('<div class="c-end-tag c-vdesc-obj">}'+($('> .c-value > .c-dot', _container.parent()).text())+'</div>')
    }else{
      var _v_container = $('<span class="c-value">'+__thisData.value+'</span>')
      _container.append(_v_container)
    }
    return __thisData
  }

  this.refreshTableView = function(jsObject, pathExp){
    var __thisData = this.getObjectInfo(jsObject)
    var __tableView = this.jsonTableView
    console.log(__tableView.length)
    __tableView.empty()
    if( __thisData.type === 'array'){
      if(jsObject.length==0){
        __tableView.append('<div style="color: #bbbbbb;padding:50px;font-size: 20px;">这是一个空数组</div>')
      }else{
        var __is_show_grid = true
        var __all_keys = []
        jsObject.forEach((thisItem,index) => {
          var __firstRowData = this.getObjectInfo(thisItem)
          if(__firstRowData.type=='object'){
            Object.keys(thisItem).forEach(thisKey=>{
              if(__all_keys.indexOf(thisKey)==-1){
                __all_keys.push(thisKey)
              }
            })
          }else{
            __is_show_grid = false
          }
        })
        // __is_show_grid=false
        if(__is_show_grid){
          var __table = $('<table class="c-list"></table>')
          var __header = $('<tr></tr>')
          __all_keys.forEach(thisKey=>{
            __header.append('<th>'+thisKey+'</th>')
          })
          __table.append(__header)
          __tableView.append(__table)
          var __index = 0
          jsObject.forEach((thisItem,index) => {
            var thisArrRowDom = $('<tr></tr>')
            __all_keys.forEach(thisKey=>{
              var thisPathExp = pathExp+'['+__index+'][\''+thisKey+'\']'
              var thisRowData = this.getObjectInfo(thisItem[thisKey])
              var __thisTd;
              if(thisRowData.type === 'object'){
                __thisTd = $('<td class="c-value c-expend c-vdesc-obj">{ <span class="c-vdesc-end">... }</td>')
              }else if(thisRowData.type === 'array'){
                __thisTd = $('<td class="c-value c-expend c-vdesc-arr">[ <span class="c-vdesc-end">... ]</td>')
              }else{
                __thisTd = $('<td class="c-value c-value-'+thisRowData.dtype+'">'+thisRowData.origin_value+'</td>')
              }
              __thisTd.attr('pathExp',thisPathExp).addClass('c-exp-node')
              thisArrRowDom.append(__thisTd)
            })
            __table.append(thisArrRowDom)
            __index++
          })
        }else{
          var __table = $('<table width="100%" class="c-list"></table>')
          __tableView.append(__table)
          var __header = $('<tr><th width="100">Index</th><th>Value</th></tr>')
          __table.append(__header)
          var __index = 0
          jsObject.forEach((thisItem,index) => {
            var thisPathExp = pathExp+'['+__index+']'
            var thisRowData = this.getObjectInfo(thisItem)
            var thisArrRowDom
            if(thisRowData.type === 'object'){
              thisArrRowDom = $('<tr><td class="c-map-row-key"><span class="c-4-icon">+</span><span class="c-arr-index">'+index+':</span></td><td class="c-value c-expend c-vdesc-obj">{ <span class="c-vdesc-end">... }</span></td></tr>')
            }else if(thisRowData.type === 'array'){
              thisArrRowDom = $('<tr><td class="c-map-row-key"><span class="c-4-icon">+</span><span class="c-arr-index">'+index+':</span></td><td class="c-value c-expend c-vdesc-arr">[ <span class="c-vdesc-end">... ]</span></td></tr>')
            }else{
              thisArrRowDom = $('<tr><td class="c-map-row-key"><span class="c-4-empty"></span><span class="c-arr-index">'+index+':</span></td><td class="c-value c-value-'+thisRowData.dtype+'">'+thisRowData.origin_value+'</td></tr>')
            }
            thisArrRowDom.attr('pathExp',thisPathExp).addClass('c-exp-node')
            __table.append(thisArrRowDom)
            __index++
          })
        }

      }
    }else if( __thisData.type === 'object'){
      var _keys = Object.keys(jsObject)
      var __table = $('<table width="100%" class="c-list"></table>')
      __tableView.append(__table)
      var __header = $('<tr><th width="200">Key</th><th>Value</th></tr>')
      __table.append(__header)
      _keys.forEach(thisKey => {
        var thisPathExp = pathExp+'[\''+thisKey+'\']'
        var thisRowData = this.getObjectInfo(jsObject[thisKey])
        var thisMapRowDom
        if(thisRowData.type === 'object'){
          thisMapRowDom = $('<tr><td class="c-map-row-key"><span class="c-4-icon">+</span>'+thisKey+' : </td><td><span class="c-value c-expend c-vdesc-obj"> { <span class="c-vdesc-end">... }</span></span></td></tr>')
        }else if(thisRowData.type === 'array'){
          thisMapRowDom = $('<tr><td class="c-map-row-key"><span class="c-4-icon">+</span>'+thisKey+' : </td><td><span class="c-value c-expend c-vdesc-arr"> [ <span class="c-vdesc-end">... ]</span></span></td></tr>')
        }else{
          thisMapRowDom = $('<tr><td class="c-map-row-key"><span class="c-4-empty"></span>'+thisKey+' : </td><td><span class="c-value c-value-'+thisRowData.dtype+'">'+thisRowData.origin_value+'</span></td></tr>')
        }
        thisMapRowDom.attr('pathExp',thisPathExp).addClass('c-exp-node')
        __table.append(thisMapRowDom)
      })
    }else{
      var __value_dom = $('<span class="c-value c-value-'+__thisData.dtype+'"></span>')
      __value_dom.text(__thisData.origin_value)
      __tableView.append(__value_dom)
    }
  }
}
module.exports = JsonView
