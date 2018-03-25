const jStat = require('jstat');
const { standardDeviation, mean, quantile, probit} = require('simple-statistics');

function stdevFromQuantiles(q1, v1, q2, v2) {
  return (v2 - v1) / (probit(q2) - probit(q1))
}

class NormalQuantileEstimate {
  constructor(low, high, error=0.1) {
    this.low = low;
    this.high = high;
    this.error = error;
  }
  get mean() {
    return mean([this.low, this.high]);
  }
  get stdev() {
    return stdevFromQuantiles(this.error, this.low, 1.0 - this.error, this.high);
  }
  sample() {
    return jStat.normal.sample(this.mean, this.stdev)
  }
}



const estimate = new NormalQuantileEstimate(3, 8);
console.log(estimate.low, estimate.mean, estimate.stdev, estimate.sample())
const values = new Array(10000)
for (let i = 0; i < values.length; i++) {
  values[i] = estimate.sample();
}

console.log(`Computed µ=${mean(values)} and ∂=${standardDeviation(values)}`)

const qv1 = quantile(values, 0.1)
const qv2 = quantile(values, 0.9)
console.log(`Quantiles 0.1...0.9: ${qv1}...${qv2}`)



console.log(`Computed ∂ from quantiles: ${stdevFromQuantiles(0.1, qv1, 0.9, qv2)}`)

