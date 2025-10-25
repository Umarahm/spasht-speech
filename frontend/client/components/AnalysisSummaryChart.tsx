import React, { useEffect, useRef } from 'react';
import { AnalysisSummary } from '../../../shared/api';

interface AnalysisSummaryChartProps {
  summary: AnalysisSummary;
}

const AnalysisSummaryChart: React.FC<AnalysisSummaryChartProps> = ({ summary }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !summary) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const entries = Object.entries(summary);
    if (entries.length === 0) return;

    const maxValue = Math.max(...entries.map(([_, value]) => value));
    const barWidth = (canvas.width - 100) / entries.length; // Leave space for labels
    const barSpacing = 10;

    // Color mapping for different labels
    const getColor = (label: string) => {
      switch (label) {
        case 'Block': return '#ef4444'; // red
        case 'Prolongation': return '#f97316'; // orange
        case 'Interjection': return '#eab308'; // yellow
        case 'WordRep': return '#22c55e'; // green
        case 'SoundRep': return '#3b82f6'; // blue
        case 'NoStutteredWords': return '#8b5cf6'; // purple
        default: return '#6b7280'; // gray
      }
    };

    // Draw bars
    entries.forEach(([label, value], index) => {
      const x = 50 + index * (barWidth + barSpacing);
      const barHeight = (value / maxValue) * 200;
      const y = canvas.height - 50 - barHeight;

      // Draw bar
      ctx.fillStyle = getColor(label);
      ctx.globalAlpha = 0.8;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw border
      ctx.strokeStyle = getColor(label);
      ctx.globalAlpha = 1;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, barWidth, barHeight);

      // Draw value on top of bar
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        value.toString(),
        x + barWidth / 2,
        y - 5
      );

      // Draw label below bar
      ctx.fillStyle = '#374151';
      ctx.font = '10px Arial';
      ctx.fillText(
        label,
        x + barWidth / 2,
        canvas.height - 20
      );
    });

    // Draw Y-axis
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 50);
    ctx.lineTo(40, canvas.height - 50);
    ctx.stroke();

    // Draw Y-axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Arial';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = Math.round((maxValue * i) / 5);
      const y = canvas.height - 50 - (i * 200) / 5;
      ctx.fillText(value.toString(), 35, y + 3);

      // Draw horizontal grid lines
      ctx.strokeStyle = '#e5e7eb';
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(canvas.width - 20, y);
      ctx.stroke();
    }

  }, [summary]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Speech Pattern Analysis Summary</h3>
      <div className="mb-4">
        <canvas
          ref={canvasRef}
          className="w-full border border-gray-300 rounded"
          style={{ height: '300px' }}
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center">
        {Object.keys(summary).map(label => (
          <div key={label} className="flex items-center">
            <div
              className="w-4 h-4 rounded mr-2"
              style={{ backgroundColor: getColor(label) }}
            ></div>
            <span className="text-sm">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function for color mapping (defined outside component for reuse)
const getColor = (label: string) => {
  switch (label) {
    case 'Block': return '#ef4444'; // red
    case 'Prolongation': return '#f97316'; // orange
    case 'Interjection': return '#eab308'; // yellow
    case 'WordRep': return '#22c55e'; // green
    case 'SoundRep': return '#3b82f6'; // blue
    case 'NoStutteredWords': return '#8b5cf6'; // purple
    default: return '#6b7280'; // gray
  }
};

export default AnalysisSummaryChart;


