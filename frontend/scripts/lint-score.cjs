const { execSync } = require('node:child_process')
const path = require('node:path')

const eslintBin = path.join(
  __dirname,
  '..',
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'eslint.cmd' : 'eslint',
)

const eslintArgs = [
  '.',
  '--ext',
  'ts,tsx',
  '-f',
  'json',
]

const runEslint = () => {
  const cmd = `"${eslintBin}" ${eslintArgs.join(' ')}`
  return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
}

const parseResults = (rawJson) => {
  try {
    return JSON.parse(rawJson)
  } catch (error) {
    console.error('ESLint JSON 파싱 실패:', error)
    process.exit(1)
  }
}

const summarize = (results) => {
  const totalFiles = results.length
  const cleanFiles = results.filter((file) => file.errorCount + file.warningCount === 0).length
  const errorCount = results.reduce((sum, file) => sum + file.errorCount, 0)
  const warningCount = results.reduce((sum, file) => sum + file.warningCount, 0)
  const violationCount = errorCount + warningCount
  const score = totalFiles === 0 ? 100 : (cleanFiles / totalFiles) * 100

  return {
    totalFiles,
    cleanFiles,
    errorCount,
    warningCount,
    violationCount,
    score,
  }
}

try {
  const raw = runEslint()
  const results = parseResults(raw)
  const summary = summarize(results)

  console.log('ESLint 준수율 (파일 기준):')
  console.log(`- 전체 파일: ${summary.totalFiles}`)
  console.log(`- 문제 없음: ${summary.cleanFiles}`)
  console.log(`- 오류: ${summary.errorCount}`)
  console.log(`- 경고: ${summary.warningCount}`)
  console.log(`- 준수율: ${summary.score.toFixed(2)}%`)

  if (summary.violationCount > 0) {
    console.error('ESLint 위반이 있습니다. 빌드를 중단합니다.')
    console.error('자세한 내용은 npm run lint로 확인하세요.')
    process.exit(1)
  }
} catch (error) {
  console.error('ESLint 실행 실패:', error?.message || error)
  process.exit(1)
}
