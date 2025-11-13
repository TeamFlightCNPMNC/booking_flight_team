import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function ThongKe() {
  const [year, setYear] = useState(2025);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data mỗi khi year thay đổi
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Thử fetch với timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
        
        const res = await fetch(`${API_BASE}?year=${year}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const json = await res.json();
        console.log("✅ API Response:", json);
        setData(json);
      } catch (err) {
        console.error("❌ Fetch error:", err);
        
        // Hiển thị lỗi chi tiết hơn
        if (err.name === 'AbortError') {
          setError("Timeout: API không phản hồi sau 10 giây");
        } else if (err.message.includes('Failed to fetch')) {
          setError("Không thể kết nối đến API server. Kiểm tra: 1) Server có đang chạy không? 2) CORS đã được config chưa? 3) URL có đúng không?");
        } else {
          setError(err.message || "Không thể tải dữ liệu");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6 text-center uppercase tracking-wider">
        Thống kê doanh thu năm {year}
      </h1>

      <div className="flex items-center gap-3 mb-6 p-4">
        <label className="font-medium text-white">Chọn năm:</label>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border border-gray-600 bg-gray-800/50 text-white p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none backdrop-blur-sm"
        >
          <option value={2025}>2025</option>
          <option value={2024}>2024</option>
          <option value={2023}>2023</option>
        </select>
      </div>

      {loading && (
        <div className="text-white font-bold text-center py-8">
          <div className="animate-pulse">Đang tải dữ liệu...</div>
        </div>
      )}
      
      {error && (
        <div className="text-red-400 bg-red-900/30 backdrop-blur-sm p-4 rounded-lg border border-red-500/50">
          <div className="font-semibold mb-2">Lỗi kết nối API</div>
          <div className="text-sm">{error}</div>
        </div>
      )}

      {!loading && !error && !data?.months && (
        <div className="text-gray-400 text-center py-8">
          Không có dữ liệu
        </div>
      )}

      {data?.months && (
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="text-white">
                <tr className="border-b border-white/30">
                  <th className="p-3 text-left font-semibold border-r border-white/70">Tháng</th>
                  <th className="p-3 text-center font-semibold border-r border-white/70">Tổng chuyến bay</th>
                  <th className="p-3 text-center font-semibold border-r border-white/70">Đã thanh toán</th>
                  <th className="p-3 text-center font-semibold border-r border-white/70">Đã hủy</th>
                  <th className="p-3 text-right font-semibold border-r border-white/70">Tổng tiền</th>                
                  <th className="p-3 text-right font-semibold border-white/70">Tiền hủy</th>
                </tr>
              </thead>
              <tbody className="text-white">
                {data.months.map((m, index) => (
                  <tr 
                    key={m.month} 
                    className="border-b border-white/70 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-3 font-medium border-r border-white/70">
                      Tháng {m.month}
                    </td>
                    <td className="p-3 text-center border-r border-white/70">
                      <span className={m.totalFlights > 0 ? 'font-semibold text-blue-400' : 'text-white'}>
                        {m.totalFlights || 0}
                      </span>
                    </td>
                    <td className="p-3 text-center border-r border-white/70">
                      <span className={m.paidCount > 0 ? 'font-semibold text-green-400' : 'text-white'}>
                        {m.paidCount || 0}
                      </span>
                    </td>
                    <td className="p-3 text-center border-r border-white/70">
                      <span className={m.canceledCount > 0 ? 'font-semibold text-red-400' : 'text-white'}>
                        {m.canceledCount || 0}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono border-r border-white/70">
                      <span className={m.paidCount > 0 ? 'text-green-400 font-semibold' : 'text-white'}>
                        {m.paidTotal || '0 VND'}
                      </span>
                    </td>            
                    <td className="p-3 text-right font-mono">
                      <span className={m.canceledCount > 0 ? 'text-red-400 font-semibold' : 'text-white'}>
                        {m.canceledTotal || '0 VND'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tổng kết */}
          <div className="p-6 border-t-2 border-white/90 mt-4">
            <div className="grid grid-cols-3 gap-6 text-white">
              <div className="text-center">
                <div className="text-sm text-gray-300 mb-2 uppercase tracking-wide">Tổng chuyến bay</div>
                <div className="text-3xl font-bold text-white">
                  {data.months.reduce((sum, m) => sum + (m.totalFlights || 0), 0)}
                </div>
              </div>
              <div className="text-center border-x border-white/70">
                <div className="text-sm text-gray-300 mb-2 uppercase tracking-wide">Đã thanh toán</div>
                <div className="text-3xl font-bold text-white">
                  {data.months.reduce((sum, m) => sum + (m.paidCount || 0), 0)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-300 mb-2 uppercase tracking-wide">Đã hủy</div>
                <div className="text-3xl font-bold text-w">
                  {data.months.reduce((sum, m) => sum + (m.canceledCount || 0), 0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}