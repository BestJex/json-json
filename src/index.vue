<template>
  <div ref="viewdom" style="height:100%;">
    <div style="width:calc(50%);height:calc(100%);float: left;border-right: #666666 solid 1px;">
      <div style="height:30px;line-height: 30px;border-bottom: #666666 solid 1px;color: #ffffff;font-size: 14px;font-weight: bold;padding-left:10px;background-color: #444444;">展开深度：<span class="s-expand-deep"></span></div>
      <div class="s-tree-view" style="height:calc(100% - 30px);overflow: auto;padding-top:10px;background-color: #444444;"></div>
    </div>
    <div style="width:calc(50%);height:calc(100%);overflow: auto;float: right;padding-top:10px;background-color: #444444;">
      <div style="padding:10px;font-size: 16px;color: #ffffff;">节点路径：<span style="color: greenyellow;font-size: 16px;">json</span><span class="s-path-exp" contenteditable="true" style="border:none;font-size: 16px;min-width: 100px;display: inline-block;color:greenyellow;height:22px;line-height: 22px;" spellcheck="false" title="编辑完成后点击回车键即可跳转到表达式对应的节点"></span></div>
      <div class="s-table-view"><div style="color: #bbbbbb;padding:50px;font-size: 20px;">选择一个节点</div></div>
    </div>
  </div>
</template>

<script>
  import JsonView from './SeeksJsonView'
  import $ from 'jquery'
  export default {
    name: 'JsonView',
    components: {
    },
    props: {
      data: {
        mustUseProp: true,
        type: String
      },
      options: {
        mustUseProp: false,
        default: () => { return {} },
        type: Object
      },
      onNodeClick: {
        mustUseProp: false,
        default: () => { return () => {} },
        type: Function
      }
    },
    data() {
      return {
        _view: null
      }
    },
    computed: {
    },
    watch: {
      data() {
        console.log('changed:', this.data)
        this._view.show(this.data)
      }
    },
    mounted() {
      this._view = new JsonView(this.$refs.viewdom)
      this._view.show(this.data)
    },
    methods: {
    }
  }
</script>

<style>
  .c-menu-index{

  }
  .c-menu-index div{
    padding-left:50px;
    line-height: 30px;
    font-size: 12px;
  }
  .c-page-over{
  }

  .c-kv-list{
    line-height: 20px;
    font-size: 12px;
  }
  .c-kv-list span{
    /*display: inline-block;*/
    /*width:150px;*/
    color: #444444;
    text-align: left;
    padding-right:20px;
  }
  .c-level-3{
    padding-left:50px;
  }

  .c-data-list{
    background-color: #000000;
    mso-cellspacing: 1px;
  }
  .c-data-list th{
    padding-left:5px;
    background-color: #efefef;
    line-height: 25px;
  }
  .c-data-list td{
    padding-left:5px;
    background-color: #ffffff;
    line-height: 20px;
  }

  .c-desc{
    color: #999999;
    padding:10px;
  }
  .c-row{
  }
  .c-row > .c-container{
    padding-left:20px;
    display: none;
  }
  .c-row-opened > .c-container{
    display: block;
  }
  .c-row-opened > .c-value > .c-vdesc-end{
    display: none;
  }
  .c-row-opened > .c-value > .c-dot{
    display: none;
  }
  .c-end-tag{
    display: none;
    padding-left:20px;
  }
  .c-arr-row > .c-end-tag{
    padding-left:30px;
  }
  .c-row-opened > .c-end-tag{
    display: block;
  }
  .c-map-row-key{
    color: #a6e22e;
    padding-right:10px;
  }
  .c-value, .c-dot{
    color: #e6db74;
  }
  .c-tag-arr{
    color: #ffffff;
  }
  .c-tag-map{
    color: #aaaaaa;
  }
  .c-4-icon,.c-4-empty{
    display: inline-block;
    width:20px;
    text-align: center;
    cursor: pointer;
    color: yellow;
  }
  .c-value-undefined,
  .c-value-null,
  .c-value-Number,
  .c-value-Boolean{
    color: violet;
  }
  .c-value-other{
    color: red;
  }
  .c-vdesc-obj{
    color: yellow;
    cursor: pointer;
  }
  .c-vdesc-arr{
    color: chartreuse;
    cursor: pointer;
  }
  .c-deep-level-item{
    display: inline-block;
    width:22px;
    height:22px;
    line-height: 22px;
    text-align: center;
    background-color: #999999;
    color: #ffffff;
    border: #333333 solid 1px;
    cursor: pointer;
    margin-left:2px;
    border-radius: 3px;
    font-size: 12px;
  }
  .c-deep-level-item-checked,.c-deep-level-item:hover{
    background-color: #ffffff;
    color: #444444;
  }
  .c-map-row-key{
    cursor: default;
  }
  .c-map-row-key:hover{
    background-color: #666666;
  }
  .c-arr-index{
    color: #888888;
  }
  .c-list{
    border-top: 1px solid #aaaaaa;
    border-left: 1px solid #aaaaaa;
    border-spacing: 0;/*去掉单元格间隙*/
  }
  .c-list td,.c-list th{
    padding-left: 5px;
    line-height: 25px;
    border-bottom: 1px solid #aaaaaa;
    border-right: 1px solid #aaaaaa;
  }
  .c-list .c-list-header td, .c-list th{
    text-align: left;
    padding-left: 5px;
    font-weight: bold;
    color: yellow;
  }
  #s-path-exp:hover{
    background-color: #000000;
    color: #000000;
  }
  .c-toggle-button{
    display: inline-block;
    background-color: #444444;
    border: #000000 solid 1px;
    font-size: 14px;
    font-weight: normal;
    color: #a6e22e;
    height:25px;
    line-height: 25px;
    padding-left:20px;
    padding-right:20px;
    cursor: pointer;
  }
  .c-toggle-button-on{
    border: #444444 solid 1px;
    background-color: #a6e22e;
    color: #555555;
  }
  .c-tag{
    color: #777777;
    font-size: 6px;
  }
</style>
<style lang="scss" scoped>

</style>
