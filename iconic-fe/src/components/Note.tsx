import { useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export default function NoteAndSetting() {
  const [note, setNote] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  // State cho video links
  const [videoLinks, setVideoLinks] = useState([]);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newVideoDate, setNewVideoDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // YYYY-MM-DD
  });

  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Kiểm tra đăng nhập và tải dữ liệu nếu thành công
  const checkLoginStatus = async () => {
    try {
      // Nếu gọi /note và /videos thành công thì coi như đã đăng nhập
      await fetchNote();
      await fetchVideoLinks();
      setIsLoggedIn(true);
    } catch (error) {
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  // Lấy ghi chú từ API (API trả về object có trường 'content')
  const fetchNote = async () => {
    try {
      const response = await api.get("/note");
      setNote(response.data.content);
    } catch (error) {
      console.error("Lỗi khi lấy ghi chú:", error);
    }
  };

  // Lấy danh sách video link từ API
  const fetchVideoLinks = async () => {
    try {
      const response = await api.get("/videos");
      setVideoLinks(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách video:", error);
    }
  };

  // Xử lý đăng nhập
  const handleLogin = async () => {
    try {
      await api.post("/login?useCookies=true&useSessionCookies=true", {
        email,
        password,
      });
      setIsLoggedIn(true);
      setEmail("");
      setPassword("");
      await fetchNote();
      await fetchVideoLinks();
    } catch (error) {
      alert("Sai email hoặc mật khẩu! Vui lòng thử lại.");
    }
  };

  // Xử lý đăng xuất
  // const handleLogout = async () => {
  //   try {
  //     await api.delete("/logout");
  //   } catch (error) {
  //     console.error("Lỗi khi đăng xuất:", error);
  //   } finally {
  //     setIsLoggedIn(false);
  //     setNote("");
  //     setVideoLinks([]);
  //   }
  // };

  // Lưu ghi chú lên server
  const handleSaveNote = async () => {
    try {
      await api.put("/note", null, { params: { newContent: note } });
      alert("✅ Ghi chú đã lưu!");
    } catch (error) {
      alert("Lưu ghi chú thất bại, vui lòng thử lại!");
    }
  };

  // Thêm video link
  const handleAddVideo = async () => {
    if (!newVideoUrl.trim()) {
      alert("Vui lòng nhập URL video.");
      return;
    }
    try {
      // Chuyển đổi newVideoDate (YYYY-MM-DD) thành DateTime có giờ UTC
      const utcDate = new Date(newVideoDate + "T00:00:00Z");

      const newVideo = { url: newVideoUrl, dateShow: utcDate.toISOString() };
      await api.post("/videos", [newVideo]);
      alert("✅ Video đã thêm!");
      setNewVideoUrl("");
      await fetchVideoLinks();
    } catch (error) {
      console.error("Lỗi khi thêm video:", error);
      alert("Thêm video thất bại, vui lòng thử lại!");
    }
  };

  // Xóa video link theo id
  const handleDeleteVideo = async (id: any) => {
    try {
      await api.delete(`/videos/${id}`);
      await fetchVideoLinks();
    } catch (error) {
      console.error("Lỗi khi xóa video:", error);
      alert("Xóa video thất bại, vui lòng thử lại!");
    }
  };

  if (loading) return <p>⏳ Đang tải...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      {isLoggedIn ? (
        <>
          {/* Notepad Section */}
          <h2 className="text-xl font-bold mb-4">📄 Notepad</h2>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full h-96 p-4 border rounded-lg mb-4"
            placeholder="Nhập nội dung tại đây..."
          />
          <div className="flex justify-center mb-8">
            <button
              onClick={handleSaveNote}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-4"
            >
              💾 Lưu Ghi chú
            </button>
          </div>

          {/* Video Links Section */}
          <div className="border-t pt-4">
            <h2 className="text-xl font-bold mb-4">🎥 Video Links</h2>
            <div className="mb-4 flex flex-col gap-2">
              <input
                type="text"
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Nhập URL video..."
              />
              <input
                type="date"
                value={newVideoDate}
                onChange={(e) => setNewVideoDate(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              <button
                onClick={handleAddVideo}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                ➕ Thêm Video
              </button>
            </div>
            <ul>
              {videoLinks.map((video: any) => (
                <li
                  key={video.id}
                  className="flex items-center justify-between p-2 border-b"
                >
                  <span className="truncate max-w-[60%]">{video.url}</span>
                  <div>
                    <span className="text-sm text-gray-600 min-w-[80px] text-right mr-2">
                      {new Date(video.dateShow).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleDeleteVideo(video.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded-lg text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">🔐 Đăng nhập</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-lg mb-4"
            placeholder="Nhập email..."
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-lg mb-4"
            placeholder="Nhập mật khẩu..."
          />
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            🔑 Đăng nhập
          </button>
        </div>
      )}
    </div>
  );
}
