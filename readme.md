### 基于插件
```js
- date-fns // 提供月份第一天 最后一天等相关功能
- numeral // 数字格式化，项目不用的可以不安装
- element-plus // 箭头小icon，原项目有，所以直接用了， 可以不使用，箭头用其他iconfont等替代
```



### 使用

```vue
<Calendar
  :dataList="dataList"
  @changeMonth="getMonthData"
  title="这是一个日历"
  start="2021-05"
  ref="calendarRef"
>
  <template #default="slotProps">
    <div class="slot-number" v-if="checkItem(slotProps.item.date)">{{ getItemNumber(slotProps.item.date) }}	</div>
  </template>
</Calendar>
```

### 参数说明

| 参数       | 作用                                          | 默认值                                                       |
| ---------- | --------------------------------------------- | ------------------------------------------------------------ |
| dataList   | 日历要显示的数据{date: '2021-07-11', xxx: xx} | []                                                           |
| title      | 日历标题                                      | Calendar                                                     |
| start      | 日历开始的月份                                | 无                                                           |
| dayTexts   | 周每天的名称[]                                | ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']            |
| monthTexts | 每月的名称[]                                  | ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] |
| format     | 格式化                                        | yyyy-MM-dd                                                   |

### 方法events

| 名称        | 作用           | 值              |
| ----------- | -------------- | --------------- |
| changeMonth | 更改月份时触发 | 年月（2021-08） |

### slots

| 名称    | 作用                         | 值                 |
| ------- | ---------------------------- | ------------------ |
| default | 展示一些日历某一天额外的数据 | dataList当天的item |

