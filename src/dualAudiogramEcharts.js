import React, { useEffect, useRef, useCallback } from 'react'
import * as echarts from 'echarts'

export default function DualAudiogramEchartsLeft (props) {
  const { audiogramDataLeft, audiogramDataRight } = props
  const audiogramDouble = useRef(null)

  let chartInstanceBoth = null
  const up = 120
  const down = 0

  // const frequency = [125, 250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000]
  const columnBar1 = [[125, 120], [250, 120], [500, 120], [1000, 120], [2000, 120], [4000, 120], [8000, 120]]
  const columnBar2 = [[750, 120], [1500, 120], [3000, 120], [6000, 120]]

  const option = {
    xAxis: {
      show: false,
      type: 'log',
      logBase: 8000,
      position: 'top',
      min: 125,
      max: 8000,
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
        symbol: `image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE0AAABNCAMAAADU1xmCAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
        AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAY1BMVEX/////////////////
        //////////////////////////////////////////////////+fvP8vbf8ATP8PV/9fj//f6f+/
        0v9Pg//P3f9/pf+PsP8/eP8fYv/v9P+vx/9vmv+Q9V3qAAAAEHRSTlMAMEAgkODAcBDQ8KBgUICw
        9gqIVAAAAAFiS0dEAIgFHUgAAAAJcEhZcwAAFxEAABcRAcom8z8AAAAHdElNRQflAR0BCjtfaO36
        AAACb0lEQVRYw53Y2XaCMBAA0AAhAqKiwbXW9v+/skBI2CazdF48kjlXINtEpRaRpJkSRJYmsaZE
        500fZlewpF05pJcauIHMNCGqHWkVekpv9uufr6tmHoa4vaRcpOfLB66bVZQol1Sr9CrBMJzbYAsO
        wDAOwGbcwV85X6xtrzeCC9j9Ya193Jdc5luvdoj2iXIBO7t0+/JdMaSbJUZwG8za63jl2DevsY67
        RzkAC1zVZesN1sU5woGYtV/uYq1UDrTGuAhmreu5k1Ku+WIZXBQbnzX3r81amotj9u0aVBrTNhyC
        BS1zny3JYVjQFNSlAIdiY6caP3hvLc7h2PdnaNNK7VzWE+dQzE+ebqYWFYfjYKZ/vceGzaFYk6r5
        tCc5HNNuIBUlj8OxvR/kPI6J8Tg2xuEEGM2JMJKTYf/gMEzM4ZiQozARR2MCjoOxOR7G5LgYi+Nj
        DE6CkZwMI3YnqiCTYTKOxCQcA+NzLIzLMTEex8Y4nACjORFGcUIM53CsbUUcgT2fEo7CIksAzNGY
        gONgbI6HMbki52EUdxo0zcUorju0+eMHByO4XIUimiipSg53UMrl3XGM2Hraz5imXNIDx6idzJ+M
        oifK9VaHcuSJcrNvYpzXYvcGbMIItzpRPmgM417je4P7NFIexLipT6HxFq01ItxPGG/AXEAKF5A7
        T3NhO0/RKgjg/LGuhtaQC15Srbl2fEx32J2tb7ff9/sdDpCx+ixwn68u/fUZv22Xy3nEi73AzQNa
        yjkYyMHbDAcDuPUWuGzXCo/itEjf/KFbHKfbM6kio85Del5Dv1f3K2xldEJbfRz2/Z8VZn+YLv0B
        z9EjhVM/PoQAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjEtMDEtMjhUMTc6MTA6NTkrMDg6MDBSR9ZU
        AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIxLTAxLTI4VDE3OjEwOjU5KzA4OjAwIxpu6AAAACB0RVh0
        c29mdHdhcmUAaHR0cHM6Ly9pbWFnZW1hZ2ljay5vcme8zx2dAAAAGHRFWHRUaHVtYjo6RG9jdW1l
        bnQ6OlBhZ2VzADGn/7svAAAAF3RFWHRUaHVtYjo6SW1hZ2U6OkhlaWdodAA3NzzyyX8AAAAWdEVY
        dFRodW1iOjpJbWFnZTo6V2lkdGgANzfEXQnyAAAAGXRFWHRUaHVtYjo6TWltZXR5cGUAaW1hZ2Uv
        cG5nP7JWTgAAABd0RVh0VGh1bWI6Ok1UaW1lADE2MTE4MjUwNTnNNBmXAAAAEnRFWHRUaHVtYjo6
        U2l6ZQAxNDM5QkI5zvvsAAAARnRFWHRUaHVtYjo6VVJJAGZpbGU6Ly8vYXBwL3RtcC9pbWFnZWxj
        L2ltZ3ZpZXcyXzlfMTYwOTkwMzY2Mjc5NDIzMDZfNzZfWzBd3fxUugAAAABJRU5ErkJggg==`,
        symbolSize: 15,
        data: audiogramDataLeft && audiogramDataLeft[0],
        z: 100,
        lineStyle: {
          width: 3,
          color: '#004cff'
        },
        cursor: 'default'
      },
      {
        id: 'd',
        type: 'line',
        smooth: false,
        symbol: `image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA1CAMAAAA9D+hBAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
        AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAulBMVEX/////////////////
        ////////////////////////////////////////////////////7+//v7//f3//b2//Pz//X1//
        r6//n5//T0//AAD/Ly//j4//Dw//Hx//z8//39//EBD/c3P/w8P/6+v/zc3/ior/ICD/19f/QED/
        l5f/q6v/4uL/5+f/pKT/1NT/aWn/+fn/MDD/0tL/+vr/8/P/8fH/srL/+/v/Wlr/29v/vb3/S0v/
        ZWU7Rp9pAAAAEHRSTlMAQICwwNBQEKDwYOBwMJAgUfVt4AAAAAFiS0dEAIgFHUgAAAAJcEhZcwAA
        LiMAAC4jAXilP3YAAAAHdElNRQflAR0BFjggFuEdAAACaElEQVRIx8WWWWOiMBCAOQQEj4LIsVQQ
        2lpkD9t13e7V/f9/ayXJhIlm1LedFyHD5ySTuQxDI6Zlj0ImzshyPeMWccd+qIodXIWCSagR37po
        0tVCDJySkGeHF8SZ6SlzOFO0iJfJUdI4iwaD2iMGksk/FEjuV5Kc01QUl8WppACOKSqrCo2UKz1n
        ClNpQUgiDCoOvePeiO4LUso150yEja5SkpsMFz+9gTpytepOj28Ru715eKyfnurNc4uvgp/vTmAW
        e1sN+vZxCI5tN6wveWRjY9FwXR/VqPrUSM0CmeNXJl3fbE6j8bPkEnR5Tv9Yy3/cnkfxl0Yx57M7
        Y5oYFDtd9L/IMGOvrtwjxFSnz5pX4CK4g3H/sL6wxV6+gj5nqQdHA+/vqSQFc/wOjpjixx2FfVN8
        OTM89puI1ZrCDrBLEc+m4pGQlBZ/4QqsuIp1+Avrv2Dgku8kduISQ8E2FPUmPqgAY2kDIflAYT+U
        e/NEHckgaw4EthcfxP2LD7kdESkKsgU9q0N9frtsHQpJ86ajfrbK0Vix9PEu9Zkj84btkVcFljky
        vIrXc2oHupKlm4MKeS6rwq8DZUsYC3BNTqSyfcHQ771UVMyY7+G+UaMG1f0Bi5v3YVXUO0ttAVmB
        Zf+e5387ZYlvcWgCvHih42mFVy1WtpTeges5SSmN0b5qj9ee0FEGFM/hq+tKD5UZ1/snU4YnBhld
        xx96vn82m4C9c7BM65CiEHe8iqVsrFWay7Fkop+D5jg41ote8IpNjWsmOalRoxP0Y5+gLk+GhjfV
        WJxYN0yws7mjMHP3OgOnDCwmU1Nv5x8PtrDWhADNQQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMS0w
        MS0yOFQxNzoyMjo1NiswODowMDkYEIEAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjEtMDEtMjhUMTc6
        MjI6NTYrMDg6MDBIRag9AAAAIHRFWHRzb2Z0d2FyZQBodHRwczovL2ltYWdlbWFnaWNrLm9yZ7zP
        HZ0AAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAXdEVYdFRodW1iOjpJbWFn
        ZTo6SGVpZ2h0ADUzCalv5AAAABZ0RVh0VGh1bWI6OkltYWdlOjpXaWR0aAA1NG9iOsoAAAAZdEVY
        dFRodW1iOjpNaW1ldHlwZQBpbWFnZS9wbmc/slZOAAAAF3RFWHRUaHVtYjo6TVRpbWUAMTYxMTgy
        NTc3NmrycAEAAAASdEVYdFRodW1iOjpTaXplADEyMjJCQgJnhsgAAABGdEVYdFRodW1iOjpVUkkA
        ZmlsZTovLy9hcHAvdG1wL2ltYWdlbGMvaW1ndmlldzJfOV8xNjA5OTAzNTEyMDIzNTU2MF8xNF9b
        MF24yq4TAAAAAElFTkSuQmCC`,
        symbolSize: 17,
        data: audiogramDataRight && audiogramDataRight[0],
        lineStyle: {
          width: 3,
          color: 'red'
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
    <div
      style={{ width: '100%', height: 500 }}
      ref={audiogramDouble}
    />
  )
}
