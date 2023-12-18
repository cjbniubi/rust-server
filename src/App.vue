<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { onMounted, reactive, ref } from 'vue'
import { servers, playerCountHistory } from './api'
import { copyText ,dizhiFormatToobj } from './utils'
import moment from 'moment'
import 'moment/dist/locale/zh-cn'
moment.locale('zh-cn')
// moment.locales()//["en", "zh-cn"]
const tableData = ref([])
let c = ref(0)
const days90Data = ref([])
const links = ref({})

const dialogTableVisible = ref(false)
onMounted(async () => {
  serachServer()
})

const clsj = (data) => {
  return data.map((v) => {
    return v.attributes
  })
}
const getPlayerCountHistory = (id) => {
  playerCountHistory({
    start: '2022-05-18T00:00:00.000Z',
    stop: '2022-08-16T00:00:00.000Z',
    resolution: 1440
  }, id).then((data) => {
    const dateDtat = clsj(data.data)
    let obj = {
      m: '',
      data: [],
      date: ''
    }
    let arr = []
    dateDtat.map(d => {
      let m = new Date(d.timestamp).getMonth() + 1 // 月份
      if (obj.m == m) {

        obj.data.push(d)
      } else {
        obj = {
          m: '',
          data: [],
          date: ''
        }
        obj.m = m
        obj.date = new Date(d.timestamp)
        obj.data.push(d)
        arr.push({
          ...obj
        })
      }
    })

    arr.map(everyMonth => {
      everyMonth.data.map(dataMonth => {
        dataMonth.formmatDate = moment(dataMonth.timestamp).format('YYYY-MM-DD')
      })
    })
    days90Data.value = [...arr]
  })
}
const value = ref(new Date())

const getColorRgbaForPelper = (value) => {
  if (value > 500) {
    return 'rgb(253, 0, 255)'
  } else if (value > 400) {
    return 'red'
  } else if (value > 300) {
    return 'rgb(255, 212, 0)'
  } else if (value > 200) {
    return 'rgb(0, 255, 65)'
  } else if (value > 100) {
    return 'rgb(0, 151, 255)'
  } else if (value > 50) {
    return 'rgb(0, 20, 255)'
  }
}
const renshuClick = (id) => {
  dialogTableVisible.value = true
  getPlayerCountHistory(id)
}
const serachServer = async(stringUrl)=> {
  let dizhiObj = {}
  let params = {
    sort: 'rank',
    'filter[game]': 'rust',
  }
  if(stringUrl) {
    dizhiObj= dizhiFormatToobj(stringUrl)
  }
  let data = await servers({
    ...params,
    ...dizhiObj
  })
  links.value = data.links
  tableData.value = [...clsj(data.data)]
  console.log(tableData)
}
</script>

<template>
  <div>
    发过火反感回复打工魂对方过后
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop label="排名" width="80">
        <template v-slot="{row}">{{ '#'+row.rank}}</template>
      </el-table-column>

      <el-table-column prop="name" label="服务器名称" width="180" />
      <el-table-column prop label="人数（点击可查看活跃人数）" width="180">
        <template v-slot="{row}">
          <div @click="renshuClick(row.id)">{{row.players +'/'+ row.maxPlayers }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="清档时间" width="100">
        <template v-slot="{row}">{{ moment(row.details.rust_last_wipe, "YYYYMMDD").fromNow() }}</template>
      </el-table-column>
      <el-table-column prop label="地图预览" width="100">
        <template v-slot="{row}">
          <a
            v-if="row.details.rust_maps&&row.details.rust_maps.url"
            target="_blank"
            :href="row.details.rust_maps.url"
          >预览地图</a>
        </template>
      </el-table-column>
      <el-table-column prop label="直连（点击复制）" width="100">
        <template v-slot="{row}">
          <a href="#" @click="copyText('connect '+row.ip)">{{row.ip}}</a>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="mb-4">
      <el-button v-if="links.prev" @click="serachServer(links.prev)">上一页</el-button>
      <el-button v-if="links.next" @click="serachServer(links.next)" type="primary">下一页</el-button>
    </el-row>
  </div>

  <!-- 弹窗 -->
  <el-dialog v-model="dialogTableVisible" @close="dialogTableVisible=false" title="近三个月在线活跃人数">
    <el-calendar v-for="(item,index) in days90Data" :key="index" v-model="item.date">
      <template #header="{ date }">
        <span>{{date}}</span>
      </template>
      <template #dateCell="{ data }">
        <template v-for="(itemdata,itemdataindex) in item.data" :key="itemdataindex">
          <template v-if="itemdata.formmatDate == data.day">
            <el-tooltip
              class="box-item"
              effect="dark"
              hide-after="0"
              :content="`人数(平均${itemdata.value}/最高${itemdata.max})`"
              placement="top"
            >
              <div class="sekuai" :style="{background:getColorRgbaForPelper(itemdata.value)}">
                <div>{{ data.day.split('-').slice(2).join('-') }}</div>
              </div>
            </el-tooltip>
          </template>

          <!-- <div v-else>{{data.day.split('-').slice(2).join('-')}}</div> -->
        </template>
        {{data.day.split('-').slice(2).join('-')}}
        <!-- {{ data.isSelected ? '✔️' : '' }} -->
      </template>
    </el-calendar>
  </el-dialog>
  <!-- <HelloWorld msg="Vite + Vue" /> -->
</template>

<style scoped>
html {
  background: #ccc;
}
.el-calendar {
  /* width: 327px; */
  /* height: 500px; */
}
:deep() .el-calendar-day {
  position: relative;
  height: 100% !important;
}
.sekuai {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  color: #000;
  width: 100%;
  height: 100%;
}
</style>
