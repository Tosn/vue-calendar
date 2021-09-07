<template>
  <div>
    <Calendar
      :dataList="dataList"
      @changeMonth="getMonthData"
      title="这是一个日历"
      start="2021-05"
      ref="calendarRef"
    >
      <template #default="slotProps">
        <div class="slot-number" v-if="checkItem(slotProps.item.date)">{{ getItemNumber(slotProps.item.date) }}</div>
      </template>
    </Calendar>
  </div>
</template>

<script setup>
import Calendar from '@/components/calendar/Index.vue'
import numeral from 'numeral'
import { ref, computed } from 'vue'
const dataList = ref([
  { date: '2021-09-02', value: 3000 }
])
const checkItem = (date) => {
  return dataList.value.some(d => d.date === date)
}
const getItemNumber = (date) => {
  const ret = dataList.value.find(d => d.date === date)
  return numeral(ret.value).format('0.[0]a')
}
const getMonthData = (date) => {
  // todo axios for get data
  console.log(date)
}
</script>

<style lang="scss" scoped>
.slot-number {
  position: absolute;
  bottom: 2px;
  left: 7px;
  font-size: 12px;
  color: #666
}
</style>