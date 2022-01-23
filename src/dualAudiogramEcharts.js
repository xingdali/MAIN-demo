import React, { useEffect, useRef, useCallback } from 'react'
import * as echarts from 'echarts'

export default function DualAudiogramEchartsLeft (props) {
  const { audiogramDataLeft, audiogramDataRight } = props
  const audiogramDouble = useRef(null)

  let chartInstanceBoth = null
  const up = 120
  const down = 0

  // const frequency = [125, 250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000]
  const columnBar1 = [[125, 120], [250, 120], [500, 120], [1000, 120], [2000, 120], [4000, 120], [8000, 120], [12000, 120]]
  const columnBar2 = [[750, 120], [1500, 120], [3000, 120], [6000, 120]]

  const option = {
    xAxis: {
      show: false,
      type: 'log',
      logBase: 8000,
      position: 'top',
      min: 125,
      max: 12000,
      scale: true,
      axisLine: { onZero: false }
    },
    yAxis: {
      min: down,
      max: up,
      type: 'value',
      inverse: true,
      nameLocation: 'middle',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: {
          color: '#adadad'
        }
      },
      minorTick: {
        show: false,
        splitNumber: 2
      },
      minorSplitLine: {
        show: true,
        lineStyle: {
          color: '#e0e0e0'
        }
      },
      axisLabel: {
        formatter: function (params) {
          if (params === 0) {
            return '{valueStyle|' + params + '}'
          } else if (params === 120) {
            return '{valueStyle2|' + params + '}'
          } else {
            return params
          }
        },
        rich: {
          valueStyle: {
            color: '#000000',
            padding: [0, 0, 13, 0]
          },
          valueStyle2: {
            color: '#000000',
            padding: [10, 0, 0, 0]
          }
        }
      }
    },
    animation: false,
    series: [
      {
        id: 'a',
        type: 'line',
        smooth: false,
        symbol: `image://data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAzNSAzNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTcuNSIgY3k9IjE3LjUiIHI9IjE3LjUiIGZpbGw9IiNGOUFBMUUiIGZpbGwtb3BhY2l0eT0iMC45Ii8+CjxjaXJjbGUgY3g9IjE3IiBjeT0iMTgiIHI9IjkiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=`,
        symbolSize: 15,
        data: audiogramDataLeft && audiogramDataLeft[0],
        z: 100,
        lineStyle: {
          width: 3,
          color: '#f9aa1e'
        },
        cursor: 'default'
      },
      {
        id: 'd',
        type: 'line',
        smooth: false,
        symbol: `image://data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAzNSAzNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTcuNSIgY3k9IjE3LjUiIHI9IjE3LjUiIGZpbGw9IiNGOUFBMUUiIGZpbGwtb3BhY2l0eT0iMC42Ii8+CjxjaXJjbGUgY3g9IjE3IiBjeT0iMTgiIHI9IjkiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNiIvPgo8L3N2Zz4K`,
        symbolSize: 15,
        data: audiogramDataRight && audiogramDataRight[0],
        lineStyle: {
          width: 3,
          color: '#F1C26E'
        },
        cursor: 'default'
      },
      {
        type: 'bar',
        lengendHoverLink: true,
        barWidth: 1,
        color: '#adadad',
        data: columnBar1,
        // cursor: 'default',
        label: {
          show: true,
          color: '#000000',
          position: 'insideBottom',
          distance: -20,
          borderWidth: 1,
          formatter: function (params) {
            let value = params.data[0]
            if (value >= 1000) {
              value = value / 1000 + 'k'
            }
            if (value === 125) {
              return '{valueStyle|' + value + '}'
            } else if (value === '8k') {
              return '{valueStyle2|' + value + '}'
            } else {
              return value
            }
          },
          rich: {
            valueStyle: {
              color: '#000000',
              padding: [0, 0, 0, 20]
            },
            valueStyle2: {
              color: '#000000',
              padding: [0, 10, 0, 0]
            }
          }
        },
        cursor: 'default'
      },
      {
        type: 'bar',
        lengendHoverLink: true,
        barWidth: 1,
        color: '#e0e0e0',
        data: columnBar2,
        cursor: 'default'
      }
    ]
  }

  const onResize = useCallback(() => {
    if (chartInstanceBoth) {
      chartInstanceBoth.resize()
      renderChart()
    }
  })

  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  function renderChart () {
    const renderedInstance = echarts.getInstanceByDom(audiogramDouble.current)
    if (renderedInstance) {
      chartInstanceBoth = renderedInstance
    } else {
      chartInstanceBoth = echarts.init(audiogramDouble.current)
    }
    chartInstanceBoth.setOption(option)
    if (document.getElementById('dataInputContainer')) {
      document.getElementById('dataInputContainer').addEventListener('click', () => {
        document.getElementById('dataInput').select()
      })
      document.getElementById('dataInputContainer').addEventListener('mouseup', () => {
        document.getElementById('dataInput').select()
      })
    }
  }

  useEffect(() => {
    renderChart()
  })

  return (
    <>
      <img style={{ position: 'relative', top: '70px', left: '30px', width: '5%', height: '5%' }} src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCA0OCAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjM2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTMuMTY0MSAxNS4wODAxVjE2SDguODk4NDRWMTUuMDgwMUgxMy4xNjQxWk05LjEyMTA5IDcuNDY4NzVWMTZINy45OTAyM1Y3LjQ2ODc1SDkuMTIxMDlaIiBmaWxsPSJibGFjayIvPgo8bGluZSB4MT0iMTgiIHkxPSIxMS41IiB4Mj0iMzgiIHkyPSIxMS41IiBzdHJva2U9IiNGOUFBMUUiIHN0cm9rZS13aWR0aD0iMyIvPgo8cGF0aCBkPSJNNy45OTAyMyAyMS40Njg4SDEwLjgxNDVDMTEuNDU1MSAyMS40Njg4IDExLjk5NjEgMjEuNTY2NCAxMi40Mzc1IDIxLjc2MTdDMTIuODgyOCAyMS45NTcgMTMuMjIwNyAyMi4yNDYxIDEzLjQ1MTIgMjIuNjI4OUMxMy42ODU1IDIzLjAwNzggMTMuODAyNyAyMy40NzQ2IDEzLjgwMjcgMjQuMDI5M0MxMy44MDI3IDI0LjQxOTkgMTMuNzIyNyAyNC43NzczIDEzLjU2MjUgMjUuMTAxNkMxMy40MDYyIDI1LjQyMTkgMTMuMTc5NyAyNS42OTUzIDEyLjg4MjggMjUuOTIxOUMxMi41ODk4IDI2LjE0NDUgMTIuMjM4MyAyNi4zMTA1IDExLjgyODEgMjYuNDE5OUwxMS41MTE3IDI2LjU0M0g4Ljg1NzQyTDguODQ1NyAyNS42MjNIMTAuODQ5NkMxMS4yNTU5IDI1LjYyMyAxMS41OTM4IDI1LjU1MjcgMTEuODYzMyAyNS40MTIxQzEyLjEzMjggMjUuMjY3NiAxMi4zMzU5IDI1LjA3NDIgMTIuNDcyNyAyNC44MzJDMTIuNjA5NCAyNC41ODk4IDEyLjY3NzcgMjQuMzIyMyAxMi42Nzc3IDI0LjAyOTNDMTIuNjc3NyAyMy43MDEyIDEyLjYxMzMgMjMuNDE0MSAxMi40ODQ0IDIzLjE2OEMxMi4zNTU1IDIyLjkyMTkgMTIuMTUyMyAyMi43MzI0IDExLjg3NSAyMi41OTk2QzExLjYwMTYgMjIuNDYyOSAxMS4yNDggMjIuMzk0NSAxMC44MTQ1IDIyLjM5NDVIOS4xMjEwOVYzMEg3Ljk5MDIzVjIxLjQ2ODhaTTEyLjk3NjYgMzBMMTAuOTAyMyAyNi4xMzI4TDEyLjA4MDEgMjYuMTI3TDE0LjE4MzYgMjkuOTI5N1YzMEgxMi45NzY2WiIgZmlsbD0iYmxhY2siLz4KPGxpbmUgeDE9IjE4IiB5MT0iMjYuNSIgeDI9IjM4IiB5Mj0iMjYuNSIgc3Ryb2tlPSIjRjFDMjZFIiBzdHJva2Utd2lkdGg9IjMiLz4KPC9zdmc+Cg==' />
      <div
        style={{ width: '100%', height: 500 }}
        ref={audiogramDouble}
      >
      </div>
    </>
  )
}
