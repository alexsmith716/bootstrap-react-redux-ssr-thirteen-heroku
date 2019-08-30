import multireducer from 'multireducer';
import device from './modules/device';
import counter from './modules/counter';
import temperatureCalculator from './modules/temperatureCalculator';
import filterableTable from './modules/filterableTable';
import lineChart from './modules/lineChart';
import info from './modules/info';

export default function rootReducer() {
  return {
    online: (v = true) => v,
    counter,
    device,
    counterCollection: multireducer({
      AboutOneMultireducer1: counter,
      AboutTwoMultireducer1: counter,
      AboutTwoMultireducer2: counter,
      AboutTwoMultireducer3: counter,
    }),
    filterableTableCollection: multireducer({
      AboutOneMultireducerFilterableTable1: filterableTable,
      AboutOneMultireducerFilterableTable2: filterableTable,
    }),
    lineChartCollection: multireducer({
      AboutTwoMultireducerLineChart1: lineChart,
      AboutTwoMultireducerLineChart2: lineChart,
    }),
    temperatureCalculatorCollection: multireducer({
      AboutOne1: temperatureCalculator,
      AboutOne2: temperatureCalculator,
      AboutTwo1: temperatureCalculator,
      AboutTwo2: temperatureCalculator,
    }),
    info
  };
}
