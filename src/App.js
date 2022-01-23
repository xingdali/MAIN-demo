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
    backgroundColor: theme.palette.mode === 'light' ? '#f9aa1e' : '#308fe8'
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
  const [progress, setProgress] = React.useState(0)
  const [status, setStatus] = React.useState('Initialized')
  const [leftAudiogramData, setLeftAudiogramData] = React.useState([[], [], []])
  const [rightAudiogramData, setRightAudiogramData] = React.useState([[], [], []])
  const [audiogram, setAudiogram] = React.useState(null)
  const [errorMessage, setErrorMessage] = React.useState(null)

  React.useEffect(() => {
    if (status === 'In Progress') {
      const processing = setTimeout(() => {
        if (progress < 100) {
          if (progress < 90) {
            setProgress(progress + 10)
          } else if (progress < 99) {
            setProgress(progress + 1)
          }
        }
      }, 1000)
      return () => clearTimeout(processing)
    }
  })

  const handleChangeStatus = ({ meta, file }, status) => {
    setAudiogram(file)
    if (status == 'removed') {
      setAudiogram(null)
      setErrorMessage(null)
    }
  }

  const handleSend = () => {
    const formData = new FormData()
    formData.append('file', audiogram)
    setStatus('In Progress')
    setErrorMessage(null)
    axios({
      method: 'post',
      url: 'https://test.orka.team/audiogram-detection/',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((response) => {
      setProgress(100)
      setStatus('Completed')
      let leftData = []
      let rightData = []
      for (let i = 0; i < response.data['L'].length; i++) {
        leftData.push([response.data['L'][i].frequency, response.data['L'][i].loss])
      }
      for (let i = 0; i < response.data['R'].length; i++) {
        rightData.push([response.data['R'][i].frequency, response.data['R'][i].loss])
      }
      setLeftAudiogramData([leftData, [], []])
      setRightAudiogramData([rightData, [], []])
    }).catch((e) => {
      setProgress(0)
      setStatus('Initialized')
      setAudiogram(null)
      setErrorMessage(e.message)
    })
    // setLeftAudiogramData([[[250, 25], [500, 30], [1000, 60], [2000, 65], [4000, 85], [8000, 75]], [], []])
    // setRightAudiogramData([[[250, 30], [500, 60], [1000, 80], [2000, 65], [4000, 85], [8000, 75]], [], []])
  }

  const Layout = ({ input, previews, submitButton, dropzoneProps, files, extra: { maxFiles } }) => {
    return (
      <div>
        {previews}
        {files.length < maxFiles && <div {...dropzoneProps}>{files.length < maxFiles && input}</div>}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ margin: '10%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography>{status}</Typography>
        <CustomizedProgressBars value={progress} style={{ width: '100%' }} />
        <DualAudiogramEcharts
          audiogramDataLeft={leftAudiogramData}
          audiogramDataRight={rightAudiogramData}
          style={{ width: '100%', height: '100%' }}
        />
        <Dropzone
          onChangeStatus={handleChangeStatus}
          // onSubmit={handleSubmit}
          LayoutComponent={Layout}
          maxFiles={1}
          accept="image/*"
        />
        <Button variant='contained' onClick={handleSend} disabled={!audiogram} style={{ width: '10%', margin: '10px 10px 0 0' }}>Send</Button>
        {errorMessage && <Alert severity="error" style={{ marginTop: '1%' }} >{errorMessage}</Alert>}
      </div>
    </div>
  )
}
