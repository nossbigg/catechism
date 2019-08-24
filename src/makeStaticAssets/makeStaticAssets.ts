import request from 'request-promise-native'
import fs from 'fs-extra'
import path from 'path'
import { CCCStore } from './../store/cccTypedefs'
import { makeCCCMeta, CCCMeta } from '../cccMetaGenerator/cccMetaGenerator'

export const makeStaticAssets = async () => {
  await prepareDirectory()

  const ccc = await getCCCReleaseFromRemote()
  const cccMeta = await makeCCCMetadata(ccc)

  await saveCCC(ccc)
  await saveCCCMeta(cccMeta)
}

const getCCCReleaseFromRemote = async (): Promise<CCCStore> => {
  log('ccc: downloading from remote...')
  const latestReleaseMeta: GithubAPIReleaseResponse = await request({
    uri:
      'https://api.github.com/repos/nossbigg/catechism-ccc-json/releases/latest',
    ...GITHUB_REQUEST_PARAMETERS,
  })

  const cccJsonAsset = latestReleaseMeta.assets.filter(
    asset => asset.name === 'ccc.json'
  )
  const cccDownloadUrl = cccJsonAsset[0].browser_download_url
  const cccDownload: CCCStore = await request({
    uri: cccDownloadUrl,
    ...GITHUB_REQUEST_PARAMETERS,
  })

  log('ccc: done!')
  return cccDownload
}

const makeCCCMetadata = async (ccc: CCCStore): Promise<CCCMeta> => {
  log('ccc meta: generating ccc meta...')
  const meta = makeCCCMeta(ccc)
  log('ccc meta: done!')
  return meta
}

const saveCCC = async (ccc: CCCStore) => {
  log('ccc: saving to disk...')
  await fs.writeFile(STATIC_ASSETS_PATHS.ccc, JSON.stringify(ccc))
  log('ccc: done!')
}

const saveCCCMeta = async (cccMeta: CCCMeta) => {
  log('ccc meta: saving to disk...')
  await fs.writeFile(STATIC_ASSETS_PATHS.cccMeta, JSON.stringify(cccMeta))
  log('ccc meta: done!')
}

const prepareDirectory = async () => {
  log('cleanup: cleaning existing assets...')
  await fs.remove(STATIC_ASSETS_PATHS.rootDir)
  await fs.mkdirp(STATIC_ASSETS_PATHS.rootDir)
  log('cleanup: done!')
}

// eslint-disable-next-line no-console
const log = (msg: string) => console.log(msg)

const STATIC_ASSETS_ROOT = './public/ccc'
const STATIC_ASSETS_PATHS = {
  rootDir: STATIC_ASSETS_ROOT,
  ccc: path.join(STATIC_ASSETS_ROOT, 'ccc.json'),
  cccMeta: path.join(STATIC_ASSETS_ROOT, 'cccMeta.json'),
}

const GITHUB_REQUEST_PARAMETERS = {
  method: 'GET',
  json: true,
  headers: {
    'User-Agent': 'nossbigg/catechism-web',
  },
}

interface GithubAPIReleaseResponse {
  assets: Asset[]
}

interface Asset {
  name: string
  browser_download_url: string
}
