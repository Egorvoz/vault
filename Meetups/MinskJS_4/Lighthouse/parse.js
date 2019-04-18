const Table = require('cli-table')

const getBasicsScores = async (report) => {
  if (!report) {
    return
  }

  const { accessibility, performance, pwa, seo } = report.lhr.categories
  const bestPractise = report.lhr.categories['best-practices']

  const table = new Table({
    head: [
      '',
      'Accessibility',
      'Best Practices',
      'Performance',
      'Progressive Web App',
      'SEO',
    ],
  })

  table.push([
    'Score',
    accessibility.score,
    bestPractise.score,
    performance.score,
    pwa.score,
    seo.score,
  ])

  return table
}

const getMainArtifacts = async (report) => {
  if (!report) {
    return
  }

  const { artifacts } = report

  const {
    fetchTime,
    URL,
    UserAgent,
    Viewport,
  } = artifacts

  const table = new Table({
    head: [
      '',
      '',
      '',
      '',
    ],
  })

  table.push(
    { 'Fetch Time': fetchTime },
    { 'URL': URL.finalUrl },
    { 'User Agent': UserAgent },
    { 'Viewport': Viewport },
  )

  return table
}

module.exports = {
  getBasicsScores,
  getMainArtifacts,
}
