const parse = require('./parse');

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const url = `https://www.mann-ivanov-ferber.ru`;

async function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher.launch({ chromeFlags: opts.chromeFlags }).then((chrome) => {
    opts.port = chrome.port;
    return lighthouse(url, opts, config).then((results) => {
      // use results.lhr for the JS-consumeable output
      // https://github.com/GoogleChrome/lighthouse/blob/master/types/lhr.d.ts
      // use results.report for the HTML/JSON/CSV output as a string
      // use results.artifacts for the trace/screenshots/other specific case you need (rarer)
      return chrome.kill().then(() => results);
    });
  });
}

const opts = {
  chromeFlags: ['--show-paint-rects'],
};

const runLH = async function() {
  try {
    const results = await launchChromeAndRunLighthouse(url, opts);

    const urlArtifactsRes = await parse.getMainArtifacts(results)
    const urlBasicScores = await parse.getBasicsScores(results)

    // console.log('*** Runtime info ***')
    // console.log(urlArtifactsRes.toString())

    console.log('*** Basic scores ***')
    console.log(urlBasicScores.toString())
  } catch (err) {
    console.log(err);
  }
};

runLH()
