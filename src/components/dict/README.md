# 字典插件

主要用于缓存字典数据，减少和服务端的交互，提高渲染效率。  

字典数据，将在第一次从服务端返回时被存储到 LocalStorage，后续使用时从 LS 中读取，不再请求服务端

为了保证数据一致性，在用户登陆时，会向服务端发起一个校验请求，携带LS存储的字典的对应Hash值，服务端校验后，返回已经变更的字典Code，前端根据其删除对应存储


## 1、DictPlugin 

插件主体，主要用于注册所有字典组件，并将DictPool挂在到Vue原型中，方便全局使用  

后续追加组件，直接在此文件中注册即可

## 2、DictPool

字典缓存池：主要用于封装获取字典的方法，且使用内存做二级缓存

主要方法介绍：

- getDictList()

  获取字典数据，先读取内存缓存，若没有，则读取LS，并放入内存缓存。
  若LS中也为空，则向服务端发起请求。

  @return 返回一个 Promise 对象

  使用示例：

  ```javascript
  // 详细可以参考 dictMixin
  this.DictPool.getDictList(this.dictCode).then(dictList => {
    this.dictList = dictList
  })
  ```

- initDictList(dictCodes)
  初始化字典数据到内存中，主要使用场景在于，当父组件中渲染多个需要使用统一字典数据的子组件时，在父组件中提前初始化字典数据  
  如果在子组件中初始化，容易造成重复请求。

  举例说明：
  a-table组件中的slot插槽，会根据每一列的值去动态渲染多个slot,如果在slot内部初始化字典数据，若本地没有数据，会向服务端发起异步请求，这样很容易多次重复请求  
  所以，将初始化字典数据的工作交由父组件完成，子组件渲染时直接从内存缓存中读取即可。

  参考 TablePageMixin，混入此mixin的组件，只需定制自己的dictCodes即可

  ```javascript
      data(){
          // 需要加载的 dictSlot数据
          dictCodes: []
      },
      created () {
          this.DictPool.initDictList(this.dictCodes)
          !this.lazyLoad && this.loadData()
      },
      methods: {
      }
  ```

## 3、DictMixin

字典组件的基础属性，混入此Mixin的组件，可以实现v-modal的双向绑定功能，以及antd的v-decorator表单元素绑定。

**注意：定制组件必须要提供onChange事件，默认绑定handleChange方法即可**

| 属性     | 备注                   |
| -------- | ---------------------- |
| value    | 实现双向绑定的基本要素 |
| dictCode | 字典的code             |
| disabled | 是否禁用               |



## 4、DictSelet

字典下拉组件，混入了`DictMixin`。

除了`DictMixin`提供的基本属性外，额外提供了两个属性

| 属性              | 备注                                            |
| ----------------- | ----------------------------------------------- |
| placeholder       | 占位文本                                        |
| placeholderOption | 是否要渲染一个占位文本的selectOption，默认false |



使用示例：

```html
<!--V-modal 方式 -->
<dict-select dict-code="dict_property"
             placeholder="字典属性"
             v-model="queryParam.editable">
</dict-select>

<!-- Antd 表单方式 -->
<dict-select placeholder="字典类型"
    v-decorator="['editable']"
    dict-code="dict_property">
</dict-select>
```



## 5、DictRadioGroup

字典Radio组件，类似于DictSelet，同样混入了DictMixin，只不过其默认渲染出来的时Radio Group

使用示例：

```html
<dict-radio-group v-decorator="['settlementMethod']"
                  :disabled="formAction !== this.FORM_ACTION.CREATE"
                  dict-code="settlement_method">
</dict-radio-group>
```



## 6、DictSlot

包装了一个`a-tag`，主要用于表格数据根据字典数据回显。

目前默认都回显为灰色，有待后续改进。



使用示例：

```html
<span slot="settlementMethod-slot" slot-scope="text">
  <dict-slot :value="text" dict-code='settlement_method'></dict-slot>
</span>
```

配合 a-table使用

```javascript
columns: [
 {
 title: '结算方式',
 dataIndex: 'settlementMethod',
 scopedSlots: { customRender: 'settlementMethod-slot' }
 }
]
```

