const { graph } = require('./banner-graph');

graph()
  .then(() => {
    console.log(`Chart generated`);
  }).catch(err => {
    let errors = err.errors
    console.log(errors);
    process.exit(1)
  });