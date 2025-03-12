import { useState, useEffect } from "react";
import axios from "axios";

export default function VideoList() {
  const [videos, setVideos] = useState([]);
  const [openedVideos, setOpenedVideos] = useState(new Set());

  // ✅ Lấy ngày hôm nay theo định dạng YYYY-MM-DD
  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // ✅ Gọi API lấy danh sách video và lọc theo ngày hôm nay
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("/api/videos");
        const todayVideos = response.data.filter(
          (video: any) => video.dateShow.split("T")[0] === getTodayDate()
        );
        setVideos(todayVideos);
      } catch (error) {
        console.error("Lỗi khi lấy video:", error);
      }
    };

    fetchVideos();
  }, []);

  // ✅ Load trạng thái đã mở từ localStorage
  useEffect(() => {
    const savedOpened = localStorage.getItem("openedVideos");
    if (savedOpened) {
      setOpenedVideos(new Set(JSON.parse(savedOpened)));
    }
  }, []);

  // ✅ Cập nhật localStorage khi danh sách thay đổi
  useEffect(() => {
    if (openedVideos.size > 0) {
      localStorage.setItem(
        "openedVideos",
        JSON.stringify(Array.from(openedVideos))
      );
    }
  }, [openedVideos]);

  // ✅ Khi click vào video -> Mở video & lưu trạng thái
  const handleOpenVideo = (id: any, url: any) => {
    window.open(url, "_blank");

    setOpenedVideos((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });

    // Cập nhật localStorage ngay lập tức
    const updatedVideos = new Set(openedVideos);
    updatedVideos.add(id);
    localStorage.setItem(
      "openedVideos",
      JSON.stringify(Array.from(updatedVideos))
    );
  };

  // ✅ Mở video đầu tiên chưa mở
  const openFirstUnopened = () => {
    const firstUnopened = videos.find(
      (video: any) => !openedVideos.has(video.id)
    ) as any;
    if (firstUnopened) handleOpenVideo(firstUnopened.id, firstUnopened.url);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">📋 Danh sách video hôm nay</h2>
      <button
        onClick={openFirstUnopened}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        🚀 Mở video đầu tiên chưa mở
      </button>
      <ul>
        {videos.map((video: any) => (
          <li key={video.id} className="flex justify-between p-2 border-b">
            <a
              href="#"
              onClick={() => handleOpenVideo(video.id, video.url)}
              className={`text-blue-500 hover:underline overflow-hidden text-ellipsis ${
                openedVideos.has(video.id) ? "line-through text-gray-400" : ""
              }`}
            >
              {video.url}
            </a>
            {openedVideos.has(video.id) && (
              <span className="text-green-500">✅</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
