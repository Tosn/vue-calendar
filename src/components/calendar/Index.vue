<template>
  <div :class="`${cp}-box`">
    <div :class="`${cp}-header`">
      <div :class="`${cp}-title`">{{title}}</div>
      <div :class="`${cp}-editor`">
        <div>
          <i class="el-icon-arrow-left" :class="{disabled: isFirstMonth}" @click="changeMonth(-1)"></i>
          <span>{{ currentYearAndMonth }}</span>
          <i class="el-icon-arrow-right" @click="changeMonth(1)"></i>
        </div>
        <div class="time-zone"></div>
      </div>
    </div>
    <div :class="`${cp}-th`">
      <div v-for="item in dayTexts" :key="item">{{item}}</div>
    </div>
    <div :class="`${cp}-body`">
      <div :class="`${cp}-row`" v-for="i in itemDays.length / 7" :key="i">
        <div :class="`${cp}-td ${getClass(getDayItem(i, j))}`" v-for="j in 7" :key="`${i}-${j}`">
          <span :class="`${cp}-day`">{{(getDayItem(i, j).currentMonth === 0) ? getDayItem(i, j).days.toString().padStart(2, 0) : ''}}</span>
          <slot :item="getDayItem(i, j)"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, getCurrentInstance } from 'vue'
import { getItemDays } from './utils'
import { format as _format } from 'date-fns'
const instance = getCurrentInstance()
const now = new Date()
const month = ref(+now.getMonth())
const year = ref(+(now.getFullYear()))
const cp = 'tosn-calendar'
defineEmits(['changeMonth'])
const props = defineProps({
  title: {
    type: String,
    default: 'Calendar'
  },
  dayTexts: {
    type: Array,
    default: () => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  monthTexts: {
    type: Array,
    default: () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  dataList: {
    type: Array,
    default: () => []
  },
  format: {
    type: String,
    default: 'yyyy-MM-dd'
  },
  start: { // 格式需要和format保持一致
    type: String,
    default: ''
  }
})
// 当前显示的年月
const currentYearAndMonth = computed(() => {
  return `${props.monthTexts[month.value]} ${year.value}`
})
// 当前年月字符串 2020-05
const formatYearAndMonth = computed(() => {
  return `${year.value}-${(month.value + 1).toString().padStart(2, 0)}`
})
// 是否开始的时间
const isFirstMonth = computed(() => {
  // 这个地方需要注意 和 format的根式保持一致
  return formatYearAndMonth.value === props.start
})
const itemDays = computed(() => {
  // 添加/1代表日，否则手机ios识别不出来
  return getItemDays(new Date(`${year.value}/${month.value + 1}/1`), props.format)
})
// 更改月份
const changeMonth = (mon) => {
  // 月份从0开始 到 11结束
  if (mon === 1) {
    if (month.value < 11) {
      month.value += 1
    } else {
      month.value = 1
      year.value += 1
    }
  } else {
    if (isFirstMonth.value) {  // 如果已经是初始月份，点击无效
      return false
    }
    if (month.value === 0) {
      month.value = 11
      year.value -= 1
    } else {
      month.value -= 1
    }
  }
  instance.emit('changeMonth', formatYearAndMonth.value)
}
// 获取每一天的信息
const getDayItem = (i, j) => {
  return itemDays.value[(i - 1) * 7 + (j - 1)]
} 
// 获取当前class的值
const getClass = (db) => {
  if (db.currentMonth !== 0) return '' // 不是当前月份 直接return
  const className = ['color-grey'] // 如果是当月 默认有灰色
  const _today = _format(new Date(), props.format)
  if (db.date <= _today) {
    className.push('color-purple') // 已经过去的
  }
  if (props.dataList.some(r => r.date === db.date)) {
    className.push('color-green') // 有数据的
  }
  if (db.date === _today) { // 今天
    className.push('color-today')
  }
  return className.join(' ')
}
// 重置
const resetDate = () => {
  month.value = +now.getMonth()
  year.value = +now.getFullYear()
}
// 对外暴露
defineExpose({
  resetDate
})
</script>

<style lang="scss" scoped>
$cp: '.tosn-calendar';
$space: 10px;
$pad: 6px;
$color-purple: #D5C3FF;
$color-green: #AFF0C8;
$color-grey: #EBF1F9;
#{$cp} {
  &-box {
    // border: 1px solid #f0f0f0;
    .time-zone {
      display: inline-block;
      width: 18px;
      height: 18px;
      background: url('../../assets/images/icon-utc.png') no-repeat center center /100% 100%;
      margin-left: 10px;
    }
  }
  &-title {
    flex: 1;
    margin-right: 50px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #F3F3F3;
    user-select: none;
    .disabled {
      pointer-events: none;
      color: #f0f0f0
    }
  }
  &-th {
    display: flex;
    padding: 16px 10px;
    & > * {
      flex: 1;
      padding: 0 7px;
      font-size: 12px;
      text-align: center;
      color: #666;
      &:not(:first-child) {
        margin-left: $space;
      }
    }
  }
  &-body {
    background-color: #F6FAFF;
    padding: 10px;
  }
  &-editor {
    font-size: 14px;
    font-weight: bold;
    display: flex;
    span {
      display: inline-block;
      min-width: 80px;
      text-align: center;
    }
  }
  &-day {
    display: inline-block;
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    font-size: 14px;
    border-radius: 50%;
  }
  &-row {
    display: flex;
    &:not(:last-child) {
      margin-bottom: $space;
    }
    & > * {
      flex: 1;
      padding: 2px;
      height: 44px;
      box-sizing: border-box;
      position: relative;
      &.color-grey {
        background-color: $color-grey
      }
      &.color-purple {
        background-color: $color-purple
      }
      &.color-green {
        background-color: $color-green
      }
      &.color-today {
        .tosn-calendar-day {
          background-color: #fff;
          font-weight: bold;
        }
      }
      &:not(:first-child) {
        margin-left: $space;
      }
    }
  }
}
</style>