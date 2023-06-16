import React, { useEffect, useRef, useState } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// The wrapper exports only a default component that at the same time is a
// namespace for the related Props interface (HighchartsReact.Props) and
// RefObject interface (HighchartsReact.RefObject). All other interfaces
// like Options come from the Highcharts module itself.

// React supports function components as a simple way to write components that
// only contain a render method without any state (the App component in this
// example).

interface Data {
  date: string;
  averageTemperature: number;
  averageHumidity: number;
  consumption: number;
  anomaly: number;
}

interface NewContext extends Highcharts.Point {
  averageTemperature?: number;
  averageHumidity?: number;
  anomaly?: number;
}

const App = (props: HighchartsReact.Props) => {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const [data, setData] = useState<Data[]>();

  const xAxis = data?.map((e) => e.date);
  const seriesData = data?.map((e) => {
    return {
      y: e.consumption,
      averageHumidity: e.averageHumidity,
      averageTemperature: e.averageTemperature,
      anomaly: e.anomaly,
    };
  });

  const options: Highcharts.Options = {
    title: {
      text: 'My chart',
    },
    xAxis: {
      title: {
        text: 'Date',
      },
      type: 'datetime',
      categories: xAxis,
      tickInterval: 50,

      // // Use the date format in the
      // // labels property of the chart
      labels: {
        formatter: function () {
          return new Date(this.value).toLocaleString();
        },
      },
    },
    yAxis: {
      title: {
        text: '(KWhs)',
      },
    },
    tooltip: {
      formatter() {
        const newContext: NewContext = this.point;
        return `
        <span style="color: blue;">${
          this.x && new Date(this.x).toUTCString()
        }</span><br/><span>Consumption: ${
          this.y
        }</span><br/><span>Average Humidity: ${
          newContext.averageHumidity
        }</span><br/><span>Average Temperature: ${
          newContext.averageTemperature
        }</span><br/>${
          newContext.anomaly
            ? `<span>Anomaly: ${newContext.anomaly}</span><br/>`
            : ''
        }
      `;
      },
    },
    series: [
      {
        type: 'line',
        name: 'Consumption',
        data: seriesData,
      },
    ],
  };

  useEffect(() => {
    fetch('http://localhost:3000/energy')
      .then((response) => response.json())
      .then((data: Data[]) => {
        console.log(data);
        setData(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  console.log('ENERGY DATA', data);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      ref={chartComponentRef}
      {...props}
    />
  );
};

export default App;
