const fs = require('fs');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

// vars
const width = 1500; //px
const height = 500; //px
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height })

// generate vaccination graph
const graph = async () => {
  const configuration = {
    type: "line",
    data: {
      labels: ['2021-05-15', '2021-05-16', '2021-05-17', '2021-05-18', '2021-05-19'],
      datasets: [{
        label: "1st Dose     ",
        data: ['8000', '10000','21000','42000','90600'],
        fill: false,
        backgroundColor: "#53b544",
        borderColor: "#53b544",
        borderWidth: 3,
        tension: 0.4,
        datalabels: {
          align: "end",
          anchor: "end",
        },
      }, {
        label: "2nd Dose",
        data: ['10000', '15000','25000','35000','45000'],
        fill: false,
        backgroundColor: "#2e2366",
        borderColor: "#2e2366",
        borderWidth: 3,
        tension: 0.4,
        datalabels: {
          align: "start",
          anchor: "start",
        },
      }],
    },
    options: {
      layout: {
        padding: 4,
      },
      title: {
        display: true,
        text: "MALAYSIA'S DAILY COVID-19 VACCINATION RATE",
        fontColor: "#2e2366",
        fontSize: 34,
        padding: -8,
      },
      legend: {
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          fontColor: "#2e2366",
          fontSize: 24,
          fontStyle: 600,
        },
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false,
          },
          ticks: {
            fontColor: "#212121",
            fontSize: 20,
            fontStyle: 500,
            padding: 38,
          },
          afterFit: (scale) => {
            scale.height = 70;
          },
        }],
        yAxes: [{
          ticks: {
            fontColor: "#212121",
            fontSize: 20,
            fontStyle: 500,
            callback: (value) => {
              const nf = new Intl.NumberFormat();
              return nf.format(value);
            },
          },
        }],
      },
      plugins: {
        datalabels: {
          backgroundColor: function(context) {
            return context.dataset.backgroundColor;
          },
          borderRadius: 4,
          color: "white",
          font: {
            size: 30,
            weight: "bold",
          },
          formatter: (value) => {
            const nf = new Intl.NumberFormat();
            return nf.format(value);
          },
          padding: 6,
        },
      },
    }
  };
  const image = await chartJSNodeCanvas.renderToBuffer(configuration)
  fs.writeFile('image.png', image, (err) => {
    if (err) throw err
    console.log(`done`);
  });
}

graph()