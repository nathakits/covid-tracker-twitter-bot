const fs = require('fs');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const ChartDataLabels = require('chartjs-plugin-datalabels');

// vars
const width = 1500; //px
const height = 500; //px
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height })

const data = {
  "2021-05-16": {
    first: 30000,
    second: 1202,
  },
  "2021-05-17": {
    first: 12000,
    second: 1832,
  },
  "2021-05-18": {
    first: 23000,
    second: 2000,
  },
  "2021-05-19": {
    first: 27300,
    second: 2104,
  },
  "2021-05-20": {
    first: 28500,
    second: 2200,
  },
  "2021-05-21": {
    first: 30000,
    second: 2200,
  },
  "2021-05-22": {
    first: 42000,
    second: 3100,
  },
  "2021-05-23": {
    first: 51000,
    second: 3800,
  },
  "2021-05-24": {
    first: 63000,
    second: 5200,
  },
  "2021-05-25": {
    first: 72000,
    second: 6000,
  },
  "2021-05-26": {
    first: 86000,
    second: 7400,
  },
};

const results = {
  first: new Array(12).fill(NaN),
  second: new Array(12).fill(NaN),
  labels: new Array(12).fill(""),
};

console.log(results);

// generate vaccination graph
const graph = async () => {
  const configuration = {
    type: "bar",
    data: {
      labels: ['2021-05-15', '2021-05-16', '2021-05-17', '2021-05-18', '2021-05-19'],
      datasets: [
        {
          label: "1st Dose     ",
          data: ['8000', '10000','21000','42000','90600'],
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
          data: ['10000', '15000','25000','35000','45000'],
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
          stacked: true
        },
        y: {
          stacked: true
        }
      },
      plugins: {
        title: {
          display: true,
          text: `Thailand's Daily COVID Vaccination Rate`,
          fontColor: "#2e2366",
          font: { size: 32 },
          padding: 4
        },
        datalabels: {
          // backgroundColor: function(context) {
          //   return context.dataset.backgroundColor;
          // },
          borderRadius: 4,
          color: "white",
          font: {
            size: 16,
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
    console.log(`done`);
  });
}

graph()