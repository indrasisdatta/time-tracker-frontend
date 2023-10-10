import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { getSubcatName } from "@/utils/helper";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const defaultOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      // position: "top" as const,
    },
    title: {
      display: true,
      text: "Top 5 sub-categories",
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          context.formattedValue += " hrs";
        },
      },
    },
  },
};

export const ReportGraph = ({ reportRows }: { reportRows: any }) => {
  const [graphOpts, setGraphOpts] = useState({
    options: defaultOptions,
    data: {
      labels: [] as string[],
      datasets: [] as any[],
    },
  });

  useEffect(() => {
    let labels: string[] = [],
      data: any[] = [];
    for (let i = 0; i < 5; i++) {
      if (
        typeof reportRows !== "undefined" &&
        typeof reportRows[i] !== "undefined"
      ) {
        let row = reportRows[i];
        let subCat = getSubcatName(row?.categoryData, row?.subCategory);
        labels.push(subCat);
        data.push(Math.round((row?.totalTime / 60) * 100) / 100);
      } else {
        labels.push("");
        data.push(0);
      }
    }
    setGraphOpts({
      ...graphOpts,
      data: {
        labels,
        datasets: [
          {
            label: "Total time spent (hrs)",
            data,
            backgroundColor: "rgba(53, 162, 235, 0.5)",
            borderWidth: 1,
          },
        ],
      },
    });
  }, [reportRows]);

  // console.log("reportRows", reportRows);
  // console.log("graphOpts state", graphOpts);

  return <Bar options={graphOpts?.options} data={graphOpts?.data} />;
};
