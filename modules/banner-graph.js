const fs = require('fs');
const path = require('path')
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const ChartDataLabels = require('chartjs-plugin-datalabels');
const csv = require('csvtojson')

// vars
const width = 1500; //px
const height = 500; //px
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height })
const filePath = path.join(__dirname, '../data/Thailand.csv');

// generate vaccination graph
const graph = async () => {
  console.log(`Status: Creating graph...`);
  const data = await csv().fromFile(filePath)
  const sliced = data.slice(Math.max(data.length - 12, 0))
  const firstDosePlusArr = sliced.map(el => el.first_dose_plus)
  const secondtDosePlusArr = sliced.map(el => el.second_dose_plus)
  const labelArr = sliced.map(el => el.date)

  const configuration = {
    type: "bar",
    data: {
      labels: labelArr,
      datasets: [
        {
          label: "1st Dose     ",
          data: firstDosePlusArr,
          fill: false,
          backgroundColor: "#53b544",
          borderColor: "#53b544",
          tension: 0.4,
          datalabels: {
            align: "start",
            anchor: "end",
          },
        },
        {
          label: "2nd Dose",
          data: secondtDosePlusArr,
          fill: false,
          backgroundColor: "#2e2366",
          borderColor: "#2e2366",
          tension: 0.4,
          datalabels: {
            align: "start",
            anchor: "end",
          },
        }
      ],
    },
    options: {
      layout: {
        padding: 4,
      },
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false
          },
          ticks: {
            color: "#000",
            fonts: {
              size: 20,
              weight: "bold"
            }
          },
        },
        y: {
          stacked: true,
          ticks: {
            color: "#000",
            fonts: {
              size: 20,
              weight: "bold"
            }
          },
        }
      },
      plugins: {
        title: {
          display: true,
          text: `Thailand's Daily COVID Vaccination Rate`,
          fontColor: "#2e2366",
          font: { size: 28 },
          padding: 4
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
        beforeInit: (chart) => {
          chart.legend.afterFit = function() {
            this.height = this.height + 35;
          };
        },
      }
    ],
  };
  const image = await chartJSNodeCanvas.renderToBuffer(configuration)
  fs.writeFile('data/vaccine_graph.png', image, (err) => {
    if (err) throw err
    console.log(`Status: Complete`);
  });
}

graph()