export default function SummaryCards({ summary }) {
  return (
    <div className="summary-grid" aria-label="Thống kê kết quả">
      <div><span>Khớp lọc</span><strong>{summary.totalMatched}</strong></div>
      <div><span>Có vị trí</span><strong>{summary.totalMapped}</strong></div>
      <div><span>Chưa định vị</span><strong>{summary.totalUnmapped}</strong></div>
    </div>
  );
}
