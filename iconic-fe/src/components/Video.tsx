import { useState, useEffect } from "react";
import axios from "axios";
import NoteAndSetting from "./Note";

export default function VideoDownloader() {
  const [tabs, setTabs] = useState<any[]>([
    { id: "1", title: "Video", type: "video" },
    { id: "2", title: "About", type: "about" },
    { id: "3", title: "Note", type: "note" },
  ]);
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [url, setUrl] = useState("");
  const [videos, setVideos] = useState<any[]>([]);
  const [openedVideos, setOpenedVideos] = useState<Set<any>>(new Set());

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

  // Tìm kiếm video từ URL
  const handleSearch = () => {
    if (!url.trim()) return;

    // Trong thực tế, đây sẽ là nơi gọi API để tìm kiếm video từ URL
    console.log("Searching for:", url);

    // Giả lập thêm video vào danh sách
    const newVideo = {
      id: Date.now(),
      url: url,
      dateShow: new Date().toISOString(),
    };

    setVideos((prev) => [newVideo, ...prev]);
    setUrl("");
  };

  const addTab = () => {
    const newTab = {
      id: Date.now().toString(),
      title: "New Tab",
      type: "video",
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
  };

  return (
    <div className="w-full max-w-md md:max-w-lg lg:max-w-xl transition-all duration-300 shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-3 bg-black p-4 md:p-5 rounded-t-lg border-b border-gray-800">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-400 rounded-full flex-shrink-0"></div>
        <h1 className="text-white text-xl md:text-2xl font-medium">iconic</h1>
      </div>

      {/* Tab Bar */}
      <div className="flex w-full bg-[#e9eef6] px-2 pt-2 overflow-x-auto">
        <div className="flex w-full space-x-1 items-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative flex-1 flex items-center justify-center px-4 py-2 rounded-t-lg text-sm ${
                activeTab === tab.id
                  ? "bg-white text-gray-800"
                  : "bg-[#f4f7fc] text-gray-600 hover:bg-gray-100"
              }`}
            >
              {/* Tab shape with pseudo-elements */}
              <div className="relative z-10 flex items-center gap-2">
                {tab.title}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-b-lg p-4 md:p-6 border border-gray-200">
        {/* Tab Content */}
        <div className="space-y-4 md:space-y-6">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={activeTab === tab.id ? "block" : "hidden"}
            >
              {tab.type === "video" && (
                <>
                  {/* Search Input */}
                  <div className="flex items-center w-full bg-white rounded-full overflow-hidden border border-gray-200">
                    <div className="flex items-center justify-center bg-gray-100 rounded-full w-10 h-10 md:w-12 md:h-12 min-w-10 md:min-w-12 ml-1">
                      <span className="text-xs md:text-sm font-bold">100</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Nhập link vào đây"
                      className="flex-1 px-3 py-2 md:py-3 outline-none text-sm md:text-base"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                      }}
                    />
                    <button
                      onClick={handleSearch}
                      className="rounded-full flex justify-center h-full p-1 md:h-10 md:w-16 mr-1 bg-green-500 hover:bg-green-600 text-white text-sm md:text-base transition-colors duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-arrow-up"
                      >
                        <path d="m5 12 7-7 7 7" />
                        <path d="M12 19V5" />
                      </svg>
                    </button>
                  </div>
                  <button
                    onClick={openFirstUnopened}
                    className="w-full mt-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 md:py-3 text-sm md:text-base font-medium transition-colors duration-200"
                  >
                    Xem video
                  </button>

                  {/* Video List */}
                  <div className="bg-white rounded-xl p-2 md:p-3 border border-gray-200">
                    <div className="bg-gray-100 rounded-lg p-2 md:p-3 mb-2 md:mb-3">
                      <h2 className="text-center text-sm md:text-base font-medium">
                        Danh sách link
                      </h2>
                    </div>

                    <div className="space-y-2 md:space-y-3 max-h-[300px] md:max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                      {videos.length > 0 ? (
                        videos.map((video, index) => (
                          <div
                            key={video.id}
                            className={`flex items-center justify-between bg-gray-50 rounded-lg p-2 md:p-3 hover:bg-gray-100 transition-colors duration-200 ${
                              openedVideos.has(video.id) ? "opacity-70" : ""
                            }`}
                          >
                            <div className="flex items-center gap-2 md:gap-3">
                              <div className="flex items-center justify-center bg-white rounded-full w-6 h-6 md:w-8 md:h-8 min-w-6 md:min-w-8 border border-gray-200">
                                <span className="text-xs md:text-sm font-bold">
                                  {index + 1}
                                </span>
                              </div>
                              <span className="truncate max-w-[180px] md:max-w-[250px] text-sm md:text-base">
                                {video.url.length > 30
                                  ? `${video.url.substring(0, 30)}...`
                                  : video.url}
                              </span>
                            </div>
                            <button
                              onClick={() =>
                                handleOpenVideo(video.id, video.url)
                              }
                              className="rounded-full h-7 w-10 md:h-8 md:w-12 bg-blue-500 hover:bg-blue-600 text-white text-xs md:text-sm transition-colors duration-200"
                            >
                              Go
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500 text-sm md:text-base">
                          Không có video nào
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {tab.type === "about" && (
                <div className="p-4 md:p-6">
                  <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
                    About
                  </h2>
                  <p className="text-sm md:text-base text-gray-600">
                    Ứng dụng này giúp bạn tải xuống video từ nhiều nguồn khác
                    nhau. Chỉ cần dán liên kết video vào ô tìm kiếm và nhấn nút
                    "Tìm" để thêm video vào danh sách tải xuống của bạn.
                  </p>
                </div>
              )}

              {tab.type === "note" && <NoteAndSetting />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
