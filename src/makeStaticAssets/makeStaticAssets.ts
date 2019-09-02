import request from 'request-promise-native'
import fs from 'fs-extra'
import path from 'path'
import { execSync } from 'child_process'
import { CCCStore, CCCLeanStore } from 'store/cccTypedefs'
import { makeCCCMeta, CCCMeta } from '../cccMetaGenerator/cccMetaGenerator'
import { stripUrlShortLink } from '../cccMetaGenerator/makeUrlMap'

export const makeStaticAssets = async () => {
  await prepareDirectory()

  const ccc = await getCCCReleaseFromRemote()
  const cccMeta = await makeCCCMetadata(ccc)
  const cccPages = await makeCCCStaticPages(ccc, cccMeta)
  const leanCCC = makeLeanCCC(ccc)

  await saveRepoVersionFile(ccc)
  await saveCCC(leanCCC)
  await saveCCCMeta(cccMeta)
  await saveCCCPages(cccPages)
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

const makeLeanCCC = (ccc: CCCStore): CCCLeanStore => {
  const { page_nodes, ...rest } = ccc
  return rest
}

const makeCCCMetadata = async (ccc: CCCStore): Promise<CCCMeta> => {
  log('ccc meta: generating ccc meta...')
  const meta = makeCCCMeta(ccc)
  log('ccc meta: done!')
  return meta
}

const makeCCCStaticPages = async (
  ccc: CCCStore,
  cccMeta: CCCMeta
): Promise<CCCPage[]> => {
  const { page_nodes } = ccc
  const { urlMap } = cccMeta

  return Object.keys(urlMap)
    .map(fullUrl => {
      const shortUrl = stripUrlShortLink(fullUrl)
      const tocId = urlMap[fullUrl]
      const page = page_nodes[tocId]
      return { fileName: shortUrl, jsonContent: JSON.stringify(page) }
    })
    .filter(page => !!page.jsonContent)
}

const saveCCC = async (ccc: CCCLeanStore) => {
  log('ccc: saving to disk...')
  await fs.writeFile(STATIC_ASSETS_PATHS.ccc, JSON.stringify(ccc))
  log('ccc: done!')
}

const saveCCCMeta = async (cccMeta: CCCMeta) => {
  log('ccc meta: saving to disk...')
  await fs.writeFile(STATIC_ASSETS_PATHS.cccMeta, JSON.stringify(cccMeta))
  log('ccc meta: done!')
}

const saveCCCPages = async (cccPages: CCCPage[]) => {
  log('ccc pages: saving to disk...')
  await Promise.all(
    cccPages.map(page => {
      const { fileName, jsonContent } = page
      const fullFileName = STATIC_ASSETS_PATHS.makePagePath(fileName)
      return fs.writeFile(fullFileName, jsonContent)
    })
  )
  log('ccc pages: done!')
}

const saveRepoVersionFile = async (ccc: CCCStore): Promise<void> => {
  log('repo version: saving to disk...')

  const revision = execSync('git rev-parse --short HEAD')
    .toString()
    .trim()
  const versionInfo: RepoVersion = { repo: revision, store: ccc.meta.version }

  await fs.writeFile(
    STATIC_ASSETS_PATHS.versionFile,
    JSON.stringify(versionInfo)
  )
  log('repo version: done!')
}

const prepareDirectory = async () => {
  log('cleanup: cleaning existing assets...')
  await fs.remove(STATIC_ASSETS_PATHS.rootDir)
  await fs.mkdirp(STATIC_ASSETS_PATHS.rootDir)
  await fs.mkdirp(STATIC_ASSETS_PATHS.cccPagesDir)
  log('cleanup: done!')
}

// eslint-disable-next-line no-console
const log = (msg: string) => console.log(msg)

const STATIC_ASSETS_ROOT = './public/ccc'
const STATIC_ASSETS_PATHS = {
  rootDir: STATIC_ASSETS_ROOT,
  ccc: path.join(STATIC_ASSETS_ROOT, 'ccc.json'),
  cccMeta: path.join(STATIC_ASSETS_ROOT, 'cccMeta.json'),
  cccPagesDir: path.join(STATIC_ASSETS_ROOT, 'pages'),
  versionFile: path.join(STATIC_ASSETS_ROOT, 'version.json'),
  makePagePath: (fileName: string) =>
    path.join(STATIC_ASSETS_ROOT, 'pages', `${fileName}.json`),
}

const GITHUB_REQUEST_PARAMETERS = {
  method: 'GET',
  json: true,
  headers: {
    'User-Agent': 'nossbigg/catechism-web',
  },
}

interface CCCPage {
  fileName: string
  jsonContent: string
}

interface GithubAPIReleaseResponse {
  assets: Asset[]
}

interface Asset {
  name: string
  browser_download_url: string
}

interface RepoVersion {
  repo: string
  store: string
}
