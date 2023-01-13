import * as d3 from 'd3'
import $ from '@js/util/jq-3.6.0.js'
let dataLength = 0
let _data = null
const hintClassName = '.xxxxx-hint'
const mouseoutFunc = function (event, data) {
    $(hintClassName).hide();
}
const mouseoverFunc = function (event, data) {
    try {
        $('.label-hint-title').text(_data.xAxis[data])
        for (let i = 0; i < dataLength; i++) {
            if (!_data.data[i][data]) {
                throw Error('未知数据')
            }
            $(`.label-hint-${i}`).text(_data.data[i][data].y);
        }
        
        $(hintClassName).show();
        // .append(`<p>33333</p><p>数量：33311`).text('data.museumSourceName')
        $('.x-axis-line').attr('stroke', '#e4e4e4')
        $($('.x-axis-line')[data]).attr('stroke','red')
    } catch (error) {
        $('.x-axis-line').attr('stroke', '#e4e4e4')
        console.error('异常：', error);
    }
}
const mousemoveFunc = function (event, data) {
    if (event.pageY > 500) {
        $(hintClassName).css({
            top: event.pageY - 140
        })
    } else {
        $(hintClassName).css({
            top: event.pageY + 40
        })
    }
    if (event.pageX < 400) {
        $(hintClassName).css({
            left: event.pageX + 60
        })
    } else {
        $(hintClassName).css({
            left: event.pageX - 160
        })
    }

}
export const buildLineChart = (obj) => {
    const { data = [], label = [], xAxis} = obj
    const _xAxis = xAxis
    _data = obj
    dataLength = data.length
    const yMax = Math.max(...data.map(e => {
        return Math.max(...e.map(e => e.y))
    }))
    const xMax = data[0].length

    const height = 500, width = 500, margin = 25;
    //定义咱们的svg画布空间容器
    let svg = d3.select('#bar')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    console.log(xMax);
    //创建线性比例尺，使用坐标轴必备
    const yScale = d3.scaleLinear().domain([yMax, 0]).range([0, width - margin * 2]);

    const xScale = d3.scaleLinear().domain([0, xMax]).range([0, width - margin * 2]);

    //绘制一个横着的坐标轴
    function drawXAxis() {

        //创建底部的x的坐标轴
        const xAxis = d3.axisBottom(xScale).ticks(xMax).tickFormat((data, index) => {
            return _xAxis[data];
        });
        console.log('xAxis', xScale);
        //使坐标轴插入svg中
        svg.append('g').attr('class', 'x-axis').attr('transform', function () {
            //让平移到底部x对的位置，咱们还要绘制y轴呢
            return `translate(${margin}, ${height - margin})`
        }).call(xAxis);
    }

    //绘制一个竖着的坐标轴
    function drawYAxis() {
        //创建底部的x的坐标轴
        const yAxis = d3.axisLeft(yScale);

        //使坐标轴插入svg中
        svg.append('g').attr('class', 'y-axis').attr('transform', function () {
            //让平移到底部x对的位置，咱们还要绘制y轴呢
            return `translate(${margin}, ${margin})`
        }).call(yAxis);
    }

    function drawGrid() {
        //绘制y轴的线
        d3.selectAll('.y-axis .tick')
            .append('line')
            .attr('class', 'y-axis-line')
            .attr('x1', 0)
            .attr('y1', 0)
            //大家不必疑惑这个height - margin * 2 他其实就是咱们的长度啊
            .attr('x2', (height - margin * 2))
            .attr('y2', 0)
            .attr('stroke', '#e4e4e4')

        //绘制x轴的线
        d3.selectAll('.x-axis .tick')
            .append('line')
            .attr('class', 'x-axis-line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', (- height + margin * 2))
            .attr('stroke', '#e4e4e4')

        d3.selectAll('.x-axis .tick')
            .append('rect')
            .attr('class', 'x-axis-rect')
            .attr('x', 0)
            .attr('y', (- height))
            .attr('width', margin * 2)
            .attr('height', height)
            .attr('fill', 'transparent')
            .each(function (e, index, es) {

                console.log(e, index, data[0][index], data[1][index]);
            })
            .on("mouseover", mouseoverFunc)
            .on("mousemove", mousemoveFunc)
            .on("mouseout", mouseoutFunc)
    }



    function drawLine() {
        //d3.line是把数组的坐标生成一个path路径
        let line = d3.line()
            .x(function (d) {
                //这个d就是咱们的data[0] 遍历的数据了 return也就是坐标 相当于帮咱们生成了一个 M0,0 L 1,2.....这个样
                return xScale(d.x)
            })
            .y(function (d) {
                return yScale(d.y)
            })
            .curve(d3.curveCardinal)  //曲线效果

        svg.selectAll('path.path')
            .data(data)
            .enter()
            .append('path')
            .attr('class', 'path')
            .attr('d', function (d) {
                return line(d)
            })
            .attr('stroke', '#2e6be6')
            .attr('fill', 'none')
            .attr('transform', `translate(${margin}, ${margin})`)
    }


    function drawCircle() {
        data.forEach((item, _index) => {
            svg.append('g')
                .selectAll('.circle')
                .data(item)
                .enter()
                .append('circle')
                .attr('class', 'circle')
                .attr('style', `cursor: pointer;`)
                .attr('cx', function (d) {
                    return xScale(d.x)
                })
                .attr('cy', function (d) { return yScale(d.y) })
                .attr('r', 4)
                .attr('transform', `translate(${margin}, ${margin})`)
                .attr('fill', '#fff')
                .attr('stroke', function (d, index) {
                    return label[_index].color
                })
                .style('stroke-width', 0);
        });
    }


    function drawAnimations() {
        //连线动画
        svg.selectAll('path.path')
            .attr('stroke', function (d, index) {
                return label[index].color
            })
            .attr('transform', 'translate(25,25)')
            .style('stroke-dasharray', function () {
                return d3.select(this).node().getTotalLength()
            })
            .style('stroke-dashoffset', function () {
                return d3.select(this).node().getTotalLength()
            })
            .transition()
            .duration(2000)
            .delay(200)
            .ease(d3.easeLinear)

            .style('stroke-dashoffset', 0);

        //圆点
        svg.selectAll('.circle')
            .style('stroke-width', 0)
            .transition()
            .duration(1000)
            .delay(function (d, i) {
                return i * 100
            })
            .ease(d3.easeLinear)
            .style('stroke-width', 1)
    }


    (async function draw() {
        await drawXAxis();
        await drawYAxis();
        await drawGrid();
        await drawLine();
        await drawCircle();
        await drawAnimations();
    })()
}
