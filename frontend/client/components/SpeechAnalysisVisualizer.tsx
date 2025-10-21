import React, { useEffect, useRef } from 'react';
import { AnalysisSegment, AnalysisSummary } from '../../../shared/api';
import CustomAudioPlayer from './CustomAudioPlayer';

interface SpeechAnalysisVisualizerProps {
  segments: AnalysisSegment[];
  summary: AnalysisSummary;
  audioUrl?: string;
}

const SpeechAnalysisVisualizer: React.FC<SpeechAnalysisVisualizerProps> = ({
  segments,
  summary,
  audioUrl
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !segments.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate dimensions
    const segmentWidth = canvas.width / segments.length;
    const maxTime = Math.max(...segments.map(s => s.end_sec));
    const timeScale = canvas.width / maxTime;

    // Draw timeline
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 50);
    ctx.lineTo(canvas.width, canvas.height - 50);
    ctx.stroke();

    // Draw time markers
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Arial';
    for (let i = 0; i <= maxTime; i += 10) {
      const x = i * timeScale;
      ctx.beginPath();
      ctx.moveTo(x, canvas.height - 50);
      ctx.lineTo(x, canvas.height - 40);
      ctx.stroke();
      ctx.fillText(`${i}s`, x - 10, canvas.height - 25);
    }

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

    // Draw segments
    segments.forEach((segment, index) => {
      const x = segment.start_sec * timeScale;
      const width = (segment.end_sec - segment.start_sec) * timeScale;
      const height = segment.confidence * 200; // Scale confidence to height

      ctx.fillStyle = getColor(segment.label);
      ctx.globalAlpha = 0.8;
      ctx.fillRect(x, canvas.height - 50 - height, Math.max(width, 2), height);

      // Draw confidence text
      if (width > 30) {
        ctx.fillStyle = '#000';
        ctx.font = '10px Arial';
        ctx.globalAlpha = 1;
        ctx.fillText(
          `${segment.confidence.toFixed(2)}`,
          x + 2,
          canvas.height - 50 - height - 5
        );
      }
    });

    // Draw legend
    const legendY = 30;
    let legendX = 20;
    const uniqueLabels = [...new Set(segments.map(s => s.label))];

    uniqueLabels.forEach(label => {
      ctx.fillStyle = getColor(label);
      ctx.globalAlpha = 0.8;
      ctx.fillRect(legendX, legendY, 15, 15);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.fillText(label, legendX + 20, legendY + 12);
      legendX += 100;
    });

  }, [segments]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Speech Analysis Spectrometer</h3>

      {/* Audio Player */}
      {audioUrl && (
        <div className="mb-6">
          <CustomAudioPlayer
            src={audioUrl}
            title="Analysis Recording"
          />
        </div>
      )}

      {/* Spectrometer Canvas */}
      <div className="mb-4">
        <canvas
          ref={canvasRef}
          className="w-full border border-gray-300 rounded"
          style={{ height: '300px' }}
        />
      </div>

      {/* Summary Statistics */}
      <div className="mb-4">
        <h4 className="text-lg font-medium mb-2">Analysis Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(summary).map(([label, count]) => (
            <div key={label} className="bg-gray-50 p-3 rounded">
              <div className="text-sm text-gray-600">{label}</div>
              <div className="text-xl font-bold">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Segments Table */}
      <div>
        <h4 className="text-lg font-medium mb-2">Detailed Analysis (2-second segments)</h4>
        <div className="max-h-60 overflow-y-auto border border-gray-300 rounded">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Label</th>
                <th className="p-2 text-left">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {segments.map((segment, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="p-2">
                    {segment.start_sec.toFixed(1)}s - {segment.end_sec.toFixed(1)}s
                  </td>
                  <td className="p-2">
                    <span
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor: getColor(segment.label),
                        color: 'white'
                      }}
                    >
                      {segment.label}
                    </span>
                  </td>
                  <td className="p-2">{segment.confidence.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

export default SpeechAnalysisVisualizer;
