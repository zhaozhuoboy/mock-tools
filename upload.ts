import path from 'path'
import OSS from 'ali-oss'
import { globSync } from 'glob'
import { normalizePath } from 'vite'

var aliyunConfig = {
  region: process.env.ALI_OSS_REGION,
  accessKeyId: process.env.ALI_ACCESS_KEY_ID,
  accessKeySecret: process.env.ALI_ACCESS_KEY_SECRET,
  bucket: process.env.ALI_OSS_BUCKET
}
if (process.env.BUILD_ENV === 'prod') {
  aliyunConfig = process.env.OSS_PROD_INFO && JSON.parse(process.env.OSS_PROD_INFO)
} else if (process.env.BUILD_ENV === 'test') {
  aliyunConfig = process.env.OSS_TEST_INFO && JSON.parse(process.env.OSS_TEST_INFO)
}

console.log('打包环境变量', process.env.NODE_ENV)

console.log('aliyunConfig ==', aliyunConfig)

function readFiles (path: string) {
  const files = globSync(
    path + '/**/*',
    {
      nodir: true,
      dot: true
    }
  )

  return files
}


function createStore (options: any) {
  return new OSS(options)
}

async function startUpload (options: any = aliyunConfig) {
  const outDirPath = normalizePath(path.resolve(normalizePath(process.env.PUBLIC_DIR || '.output/public')))

  const files = readFiles(outDirPath)

  const startTime = new Date().getTime()
  if (!options.accessKeyId || !options.accessKeySecret) {
    throw Error('请配置阿里云的 Access Key ID 和 Access Key Secret')
  }

  const client = createStore(options)

  for (const fileFullPath of files) {
    console.log(fileFullPath)
    const filePath = normalizePath(fileFullPath).split(outDirPath)[1]
    await client.put(
      filePath,
      fileFullPath,
      {
        headers: options.headers || {}
      }
    )

    console.log(`${filePath} 上传成功 ✅`)
  }

  const duration = (new Date().getTime() - startTime) / 1000

  console.log('')
  console.log(`上传完成，用时 ${duration.toFixed(2)}s`)
  console.log('')
}

export {
  startUpload
}
