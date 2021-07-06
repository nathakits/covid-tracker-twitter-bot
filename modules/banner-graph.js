const fs = require('fs');
const path = require('path')
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const ChartDataLabels = require('chartjs-plugin-datalabels');
const csv = require('csvtojson')

const Twitter = require('twitter-lite');
const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

// vars
const width = 1500; //px
const height = 500; //px
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height })
const filePath = path.join(__dirname, '../data/Thailand.csv');
const reducer = (accumulator, currentValue) => accumulator + currentValue;
const titleText = `Thailand's Daily COVID-19 Vaccination Rate`

// color
const firstDoseColor = "#00675b"
const secondDoseColor = "#52c7b8"
const averageColor = "#303f9f"
const targetColor = "#ff6f00"
const textColor = "#111827"

// radius
const barRadius = 4

// generate vaccination graph
const graph = async () => {
  console.log(`Status: Creating graph...`);
  const data = await csv().fromFile(filePath)
  const sliced = data.slice(Math.max(data.length - 14, 0))
  const firstDosePlusArr = sliced.map(el => el.first_dose_plus)
  const secondtDosePlusArr = sliced.map(el => el.second_dose_plus)
  const totalDosePlusArr = sliced.map(el => Number(el.total_dose_plus))
  const labelArr = sliced.map(el => el.date)
  // average
  const calcAverage = (totalDosePlusArr.reduce(reducer) / 14)
  const formatAvg = Math.round(calcAverage).toLocaleString()
  const avgArr = new Array(14).fill(Math.round(calcAverage))
  // target
  const today = new Date()
  const new_year=new Date(today.getFullYear(), 11, 31)
  const one_day= (1000 * 60 * 60 * 24)
  const days_left = Math.ceil((new_year.getTime() - today.getTime()) / (one_day))
  const targetDoses = (100 * 1000000)
  const targetAvgDose = Math.ceil(targetDoses / days_left)
  const targetArr = new Array(14).fill(targetAvgDose)

  const configuration = {
    data: {
      labels: labelArr,
      datasets: [
        {
          type: "bar",
          label: "1st Dose     ",
          data: firstDosePlusArr,
          fill: false,
          backgroundColor: firstDoseColor,
          borderColor: firstDoseColor,
          borderRadius: barRadius,
          tension: 0.4,
          datalabels: {
            align: "start",
            anchor: "end",
          },
        },
        {
          type: "bar",
          label: "2nd Dose     ",
          data: secondtDosePlusArr,
          fill: false,
          backgroundColor: secondDoseColor,
          borderColor: secondDoseColor,
          borderRadius: barRadius,
          tension: 0.4,
          datalabels: {
            color: "#111827",
            align: "start",
            anchor: "end",
          },
        },
        {
          type: "line",
          label: `14-day Average: ${formatAvg} doses`,
          data: avgArr,
          fill: false,
          borderDash: [8, 8],
          radius: 0,
          backgroundColor: averageColor,
          borderColor: averageColor,
          borderRadius: barRadius,
          datalabels: {
            display: false
          },
        },
        // {
        //   type: "line",
        //   label: "Target",
        //   data: targetArr,
        //   fill: false,
        //   borderDash: [8, 8],
        //   radius: 0,
        //   backgroundColor: targetColor,
        //   borderColor: targetColor,
        //   borderRadius: barRadius,
        //   datalabels: {
        //     display: false
        //   },
        // },
      ],
    },
    options: {
      layout: {
        padding: 8,
      },
      scales: {
        xAxes: {
          stacked: true,
          grid: {
            display: false
          },
          ticks: {
            color: textColor,
            font: {
              size: 14,
            }
          },
        },
        yAxes: {
          stacked: true,
          ticks: {
            color: textColor,
            font: {
              size: 14,
            }
          },
        }
      },
      plugins: {
        title: {
          display: true,
          text: titleText,
          color: textColor,
          font: { size: 28 },
          padding: 4
        },
        legend: {
          labels: {
            usePointStyle: true,
            fill: false,
            boxWidth: 20,
            boxHeight: 20,
            color: textColor,
            padding: 12,
            font: {
              size: 16
            }
          },
        },
        datalabels: {
          // backgroundColor: function(context) {
          //   return context.dataset.backgroundColor;
          // },
          borderRadius: 4,
          color: "white",
          font: {
            size: 12,
            weight: "bold",
          },
          formatter: (value) => {
            const nf = new Intl.NumberFormat();
            return nf.format(value);
          },
          padding: 6,
        },
      },
    },
    plugins: [
      ChartDataLabels,
      {
        beforeDraw: (chart) => {
          const ctx = chart.ctx;
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, width, height);
        },
        beforeInit(chart) {
          // Get reference to the original fit function
          const originalFit = chart.legend.fit;
          // Override the fit function
          chart.legend.fit = function fit() {
            // Call original function and bind scope in order to use `this` correctly inside it
            originalFit.bind(chart.legend)();
            // Change the height as suggested in another answers
            this.height += 12;
          }
        }
      }
    ],
  };

  const imgBuffer = await chartJSNodeCanvas.renderToBuffer(configuration)
  const imgURL = await chartJSNodeCanvas.renderToDataURL(configuration);

  console.log(`Status: Complete`);

  fs.writeFile('data/vaccine_graph.png', imgBuffer, (err) => {
    if (err) throw err
    console.log(`Status: Image saved`);
  });

  await client.post("account/update_profile_banner", {
    banner: imgURL.split(",")[1],
    width: width,
    height: height,
    offset_left: 0,
    offset_top: 0,
  });
}

module.exports = {
  graph
}
