<template>
  <div>
    <div id="bar" ref="chart"></div>
    <div class="xxxxx-hint">
      <p class="label-hint-title"></p>
      <p v-for="(item, index) in s.label">
        {{item.name}} : <span :class="[`label-hint-${index}`]">??</span>
      </p>
    </div>
  </div>
</template>

<script>
import { buildLineChart } from './s.js'

export default {
  data(){
    return {
      s: {
        label: [
          {
            name: '#2e6be6',
            color: '#2e6be6'
          },
          {
            name: 'red',
            color: 'red'
          }
        ],
        xAxis:  [
          'ss1',
          'ss2',
          'ss3',
          'ss4',
          'ss5',
          'ss6',
          'ss7',
          'ss8',
          'ss9',
          'ss10',
        ],
        data: [
          [
            { x: 0, y: 6 },
            { x: 1, y: 5 },
            { x: 2, y: 3 },
            { x: 3, y: 5 },
            { x: 4, y: 5 },
            { x: 5, y: 4 },
            { x: 6, y: 3 },
            { x: 7, y: 3 },
            { x: 8, y: 2 },
            { x: 9, y: 10 },
          ],
          [
            { x: 0, y: 16 },
            { x: 1, y: 2 },
            { x: 2, y: 5 },
            { x: 3, y: 1 },
            { x: 4, y: 6 },
            { x: 5, y: 5 },
            { x: 6, y: 9 },
            { x: 7, y: 5 },
            { x: 8, y: 3 },
            { x: 9, y: 10 },
          ]
        ]
      }
    }
  },
  mounted() {
    buildLineChart(this.s)
  },
}
</script>
<style>
.xxxxx-hint {
  position: fixed;
  text-align: center;
  top: 25vh;
  left: 20vw;
  width: 120px;
  /* height: 120px; */
box-shadow: 0px 3px 5px 3px rgba(0, 0, 0, 0.1);
  background: white;
  border-radius: 4px;
  /* display: none; */
}
</style>
