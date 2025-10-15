import React, { useContext, useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HealthMetricsContext } from '../../context/HealthMetricsContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from 'chart.js';
import { Line, Bar, Radar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

interface HealthCorrelation {
  title: string;
  description: string;
  metrics: string[];
  score: number;
  recommendation: string;
}

const HealthInsights: React.FC = () => {
  const { metrics, device } = useContext(HealthMetricsContext);
  const [correlations, setCorrelations] = useState<HealthCorrelation[]>([]);
  const [weeklyData, setWeeklyData] = useState<any>({});
  // Add refs for chart instances
  const chartRefs = useRef<{ [key: string]: any }>({});
  const chartInstanceId = useRef<string>(Math.random().toString(36).substring(2, 9));

  // Generate sample weekly data when metrics change
  useEffect(() => {
    if (metrics) {
      // Generate recent dates for the chart
      const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - 6 + i);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      });

      // Generate correlation data based on metrics
      const newCorrelations: HealthCorrelation[] = [
        {
          title: 'Sleep & Stress',
          description: 'Lower sleep quality correlates with higher stress levels the next day',
          metrics: ['sleepQuality', 'stressLevel'],
          score: 85,
          recommendation: 'Aim for 7-8 hours of quality sleep to reduce stress'
        },
        {
          title: 'Activity & Heart Health',
          description: 'Days with higher step counts show more stable heart rate patterns',
          metrics: ['steps', 'heartRate'],
          score: 72,
          recommendation: 'Try to reach 8,000 steps daily for optimal heart benefits'
        },
        {
          title: 'Stress & Activity Patterns',
          description: 'Higher stress correlates with reduced physical activity',
          metrics: ['stressLevel', 'activity'],
          score: 68,
          recommendation: 'Short walks during high-stress periods may break this cycle'
        }
      ];
      
      setCorrelations(newCorrelations);

      // Create weekly data with some randomization based on current metrics
      const heartRateBase = metrics.heartRate || 75;
      const sleepQualityBase = metrics.sleepQuality || 65;
      const stressLevelBase = metrics.stressLevel || 60;
      
      setWeeklyData({
        labels: dates,
        datasets: [
          {
            label: 'Heart Rate',
            data: dates.map(() => heartRateBase + Math.floor(Math.random() * 10) - 5),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            yAxisID: 'y',
          },
          {
            label: 'Sleep Quality',
            data: dates.map(() => sleepQualityBase + Math.floor(Math.random() * 15) - 7),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            yAxisID: 'y1',
          },
          {
            label: 'Stress Level',
            data: dates.map(() => stressLevelBase + Math.floor(Math.random() * 20) - 10),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            yAxisID: 'y1',
          },
        ],
      });
    }
  }, [metrics]);

  // Add cleanup effect for chart instances
  useEffect(() => {
    return () => {
      // Destroy chart instances when component unmounts
      Object.values(chartRefs.current).forEach((chart: any) => {
        if (chart && chart.chartInstance) {
          chart.chartInstance.destroy();
        }
      });
    };
  }, []);

  const weeklyOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'Weekly Health Metrics',
        font: {
          size: 16,
        }
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Heart Rate (BPM)',
        },
        min: 50,
        max: 120,
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Quality & Stress (%)',
        },
        min: 0,
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  // Activity impact data
  const activityImpactData = {
    labels: ['Heart Health', 'Stress Reduction', 'Sleep Quality', 'Mood Improvement', 'Cognitive Function'],
    datasets: [
      {
        label: 'Your Current Impact',
        data: [
          metrics.steps ? Math.min(90, 50 + (metrics.steps / 12000) * 40) : 60,
          metrics.stressLevel ? Math.min(90, 40 + ((100 - metrics.stressLevel) / 100) * 50) : 55,
          metrics.sleepQuality ? Math.min(90, 40 + (metrics.sleepQuality / 100) * 50) : 65,
          70, // Mocked mood impact
          65, // Mocked cognitive impact
        ],
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)'
      },
      {
        label: 'Potential With Improved Habits',
        data: [85, 80, 85, 85, 80],
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        pointBackgroundColor: 'rgb(75, 192, 192)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(75, 192, 192)',
        borderDash: [5, 5],
      }
    ]
  };

  // Fix the activityImpactOptions by adding tick callbacks with the correct type signature
  const activityImpactOptions = {
    scales: {
      r: {
        angleLines: {
          display: true
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
          callback: function(tickValue: string | number) {
            return tickValue.toString();
          }
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Activity Impact on Health Domains',
        font: {
          size: 16
        }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-indigo-600">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <FontAwesomeIcon icon="chart-line" className="mr-2" />
          Health Insights & Correlations
        </h3>
        <p className="text-sm text-white opacity-90">
          Discover meaningful patterns in your health data
        </p>
      </div>

      {!device ? (
        <div className="p-8 text-center">
          <FontAwesomeIcon icon="bluetooth" className="text-gray-300 text-5xl mb-4" />
          <h4 className="text-lg font-medium text-gray-700 mb-2">Connect a device to see insights</h4>
          <p className="text-gray-500">
            Link your smartwatch or fitness tracker to analyze your health patterns
          </p>
        </div>
      ) : (
        <div className="p-6">
          {/* Weekly Health Metrics Trend */}
          <div className="mb-8">
            <div className="h-80">
              <Line 
                options={weeklyOptions} 
                data={weeklyData} 
                key={`weekly-metrics-${chartInstanceId.current}`}
                ref={(el) => chartRefs.current.weeklyMetrics = el}
              />
            </div>
          </div>

          {/* Health Correlations Grid */}
          <h4 className="text-lg font-medium text-gray-700 mb-4">Health Patterns Detected</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {correlations.map((correlation, index) => (
              <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                    <span className="text-white font-bold">{correlation.score}%</span>
                  </div>
                  <h5 className="font-medium text-blue-800">{correlation.title}</h5>
                </div>
                <p className="text-sm text-gray-700 mb-3">{correlation.description}</p>
                <div className="flex items-start">
                  <FontAwesomeIcon icon="lightbulb" className="text-yellow-500 mt-1 mr-2" />
                  <p className="text-sm text-blue-700">{correlation.recommendation}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Activity Impact Radar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-4">Activity Impact Analysis</h4>
              <div className="h-80">
                <Radar 
                  data={activityImpactData} 
                  options={activityImpactOptions} 
                  key={`activity-impact-${chartInstanceId.current}`}
                  ref={(el) => chartRefs.current.activityImpact = el}
                />
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-4">Personalized Recommendations</h4>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="flex items-start">
                    <div className="mt-1 mr-3">
                      <FontAwesomeIcon icon="heartbeat" className="text-red-500" />
                    </div>
                    <div>
                      <h5 className="font-medium text-green-800 mb-1">Optimize Heart Rate Zones</h5>
                      <p className="text-sm text-gray-700">
                        Your heart rate trends suggest you'd benefit from more moderate-intensity exercise in the 100-120 BPM range.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <div className="flex items-start">
                    <div className="mt-1 mr-3">
                      <FontAwesomeIcon icon="moon" className="text-purple-500" />
                    </div>
                    <div>
                      <h5 className="font-medium text-purple-800 mb-1">Sleep Window Optimization</h5>
                      <p className="text-sm text-gray-700">
                        Your sleep data suggests your optimal sleep window begins around 10:30 PM. Try to maintain consistent sleep timing.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-start">
                    <div className="mt-1 mr-3">
                      <FontAwesomeIcon icon="brain" className="text-blue-500" />
                    </div>
                    <div>
                      <h5 className="font-medium text-blue-800 mb-1">Stress Pattern Intervention</h5>
                      <p className="text-sm text-gray-700">
                        Your stress peaks between 2-4 PM. Consider scheduling a brief meditation or breathing exercise during this time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthInsights; 