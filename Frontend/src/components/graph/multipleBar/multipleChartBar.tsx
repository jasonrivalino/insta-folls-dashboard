import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, type ChartData, type ChartOptions } from "chart.js"
import { Bar } from "react-chartjs-2"
import type { RelationalDetail, GeneralStatistics, SubRelationalDetail } from "../../../models/table.models"

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

type Props = {
  relational?: RelationalDetail | null;
  subrelational?: SubRelationalDetail | null;
  statistics: GeneralStatistics;
  showSubrelationalText?: boolean;
};

export default function MultipleChartBar({relational, subrelational, statistics, showSubrelationalText}: Props) {
  console.log("Rendering MultipleChartBar with showSubrelationalText:", showSubrelationalText);

  const values = [
    statistics.average_followers,
    statistics.average_following,
    statistics.average_gap,
  ];

  const backgroundColors = values.map((value, index) => {
    if (index === 0 || index === 1) {
      return "#3B82F6";
    }

    if (value > 0) return "#22C55E";
    if (value < 0) return "#EF4444";
    return "#3B82F6";
  });

  const relationalLabel = relational?.relational ?? "No Relational";
  const subrelationalLabel = subrelational?.subrelational ?? "No Subrelational";
  const labelText = showSubrelationalText ? `${relationalLabel} - ${subrelationalLabel}` : `${relationalLabel} - All`;

  const data: ChartData<"bar"> = {
    labels: ["Avg Followers", "Avg Following", "Avg Gap"],
    datasets: [
      {
        label: labelText,
        data: values,
        backgroundColor: backgroundColors,
        borderRadius: 6,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { weight: 600 } },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="flex flex-col items-center w-full">
      <h3 className="text-sm font-medium text-center mb-3">
        {labelText} (Average Data)
      </h3>
      <Bar
        data={data}
        options={options}
        height={210}
      />
    </div>
  );
}