import * as React from 'react'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import { Typography } from '@mui/material'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import DualAudiogramEcharts from './dualAudiogramEcharts'
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'

const axios = require('axios').default

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  width: '100%',
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800]
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'
  }
}))

function CustomizedProgressBars ({ value, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', minHeight: 50, height: '20%' }}>
      <BorderLinearProgress variant='determinate' value={value} style={{ width: '50%' }} />
      <Typography style={{ width: '15%', marginLeft: '5%' }}>{value}%</Typography>
    </div>
  )
}

export default function App () {
  const [response, setResponse] = React.useState({ data: '0' })
  const [status, setStatus] = React.useState('Initialized')
  const [logInfo, setLogInfo] = React.useState([])
  const [leftAudiogramData, setLeftAudiogramData] = React.useState([[], [], []])
  const [rightAudiogramData, setRightAudiogramData] = React.useState([[], [], []])
  const [audiogram, setAudiogram] = React.useState(null)

  React.useEffect(() => {
    setLogInfo([...logInfo, JSON.stringify(response.data)])
    if (Number(response.data) === 100) {
      setStatus('Completed')
    }
  }, [response])

  React.useEffect(() => {
    console.log(audiogram)
  }, [audiogram])
  // called every time a file's `status` changes
  const handleChangeStatus = ({ meta, file }, status) => {
    // console.log(status, meta, file)
    setAudiogram(file)
  }
  
  // receives array of files that are done uploading when submit button is clicked
  // const handleSubmit = (files, allFiles) => {
  //   console.log(files.map(f => f.meta))
  //   allFiles.forEach(f => f.remove())
  // }


  const handleSend = () => {
    const formData = new FormData()
    formData.append('file', audiogram)
    axios({
      method: 'post',
      formData,
      url: 'https://test.orka.team/audiogram-detection/',
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((response) => {
      setLeftAudiogramData([[[250, 25], [500, 30], [1000, 60], [2000, 65], [4000, 85], [8000, 75]], [], []])
      setRightAudiogramData([[[250, 25], [500, 30], [1000, 60], [2000, 65], [4000, 85], [8000, 75]], [], []])
    })
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ margin: '10%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography>{status}</Typography>
        <CustomizedProgressBars value={Number(response.data)} style={{ width: '100%' }} />
        <DualAudiogramEcharts
          audiogramDataLeft={leftAudiogramData}
          audiogramDataRight={rightAudiogramData}
          style={{ width: '100%', height: '100%' }}
        />
        <Dropzone
          onChangeStatus={handleChangeStatus}
          // onSubmit={handleSubmit}
          accept="image/*"
        />
        <Button variant='contained' onClick={handleSend} style={{ width: '10%', margin: '10px 10px 0 0' }}>Send</Button>
        <Stack sx={{ width: '100%' }} spacing={0} style={{ marginTop: '1%' }}>
          {logInfo && logInfo.map((value, key) => (
            key !== 0 && <Alert severity='success' key={key} style={{ marginTop: 3 }}>MessageEvent <span>{'{'}</span>data: {value}<span>{'}'}</span></Alert>
          )
          )}
        </Stack>
      </div>
    </div>
  )
}
