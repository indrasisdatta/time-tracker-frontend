import React from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const ReportGraph = () => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Top 5 sub-categories",
      },
    },
  };

  const labels = ["FT", "Next.js", "Verizon", "", ""];

  const data = {
    labels,
    datasets: [
      {
        label: "Total time spent",
        data: [7.5, 8, 6, null, null],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        borderWidth: 1,
      },
    ],
  };

  return <Bar options={options} data={data} />;
};
