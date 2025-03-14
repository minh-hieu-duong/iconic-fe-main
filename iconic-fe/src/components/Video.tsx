import { useState, useEffect } from "react";
import axios from "axios";
import NoteAndSetting from "./Note";
import { LoginForm } from "./LoginForm";
import Info from "./Info";
import { toast } from "react-toastify";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export default function VideoDownloader() {
  const [tabs] = useState<any[]>([
    { id: "1", title: "Video", type: "video" },
    { id: "2", title: "About", type: "about" },
    { id: "3", title: "Note", type: "note" },
  ]);
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [chacha, setChacha] = useState(false);
  const [url, setUrl] = useState("");
  const [videos, setVideos] = useState<any[]>([]);
  const [openedVideos, setOpenedVideos] = useState<any>([]);

  // Lấy ngày hôm nay theo định dạng YYYY-MM-DD
  const getTodayDate = () => new Date().toISOString().split("T")[0];

  // Gọi API lấy danh sách video
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get("/videos");
        // Kiểm tra data có phải mảng không
        const todayVideos = Array.isArray(response.data)
          ? response.data.filter(
              (video: any) =>
                video.dateShow &&
                video.dateShow.split("T")[0] === getTodayDate()
            )
          : [];
        setVideos(todayVideos);
      } catch (error) {
        console.error("Lỗi khi lấy video:", error);
      }
    };

    fetchVideos();
  }, []);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Giả sử tab hiện tại là note
  const handleSearch = async () => {
    try {
      const response = await api.get("/note");
      const updatedContent = response.data.content
        ? `${response.data.content}\n${url}`
        : url;

      await api.put("/note", null, {
        params: { newContent: updatedContent },
      });
      setUrl("");
      toast("Link đã gửi thành công");
    } catch (error) {
      toast("Lưu thất bại, vui lòng thử lại!");
    }
  };
  // Hàm xử lý đăng nhập
  const handleLogin = (username: string, password: string) => {
    if (username === "admin" && password === "Admin123*") {
      setIsAuthenticated(true);
      const expiresAt = new Date().getTime() + 30 * 60 * 1000;
      localStorage.setItem("auth", JSON.stringify({ expiresAt }));
    } else {
      toast("Tài khoản hoặc mật khẩu không đúng!");
    }
  };
  // Load trạng thái đã mở từ localStorage
  useEffect(() => {
    const savedOpened = localStorage.getItem("openedVideos");
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      const { expiresAt } = JSON.parse(storedAuth);
      if (new Date().getTime() < expiresAt) {
        setIsAuthenticated(true);
      } else {
        // Phiên đã hết hạn
        localStorage.removeItem("auth");
      }
    }
    if (savedOpened) {
      try {
        const parsedOpened = JSON.parse(savedOpened);
        if (Array.isArray(parsedOpened)) {
          setOpenedVideos(parsedOpened); // Set thẳng thay vì concat vào
        }
      } catch (error) {
        console.error("Lỗi khi parse openedVideos từ localStorage:", error);
        localStorage.removeItem("openedVideos"); // Xóa nếu lỗi
      }
    }
  }, []);

  // Khi click vào video -> Mở video & lưu trạng thái
  const handleOpenVideo = (id: any, url: any) => {
    localStorage.setItem("openedVideos", JSON.stringify([...openedVideos, id]));
    setOpenedVideos([...openedVideos, id]);
    window.open(url, "_blank");
  };

  // Mở video đầu tiên chưa mở
  const openFirstUnopened = () => {
    const firstUnopened = videos.find(
      (video: any) => !openedVideos.includes(video.id)
    );
    if (firstUnopened) handleOpenVideo(firstUnopened.id, firstUnopened.url);
  };
  useEffect(() => {
    console.log(openedVideos);
  }, [openedVideos]);

  // Tìm kiếm video từ URL

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex justify-center pt-4">
        <div className="w-full max-w-xl shadow-md rounded-t-lg bg-[#e9eef6]">
          <div className="flex justify-center pt-4">
            <div className="w-full max-w-xl">
              <div className="relative flex w-full overflow-hidden bg-white p-1 shadow-lg">
                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gray-100"></div>

                {/* Active tab indicator - animated line */}
                <div
                  className="absolute bottom-0 h-[2px] bg-indigo-600 transition-all duration-300 ease-in-out"
                  style={{
                    left: `calc(${
                      (tabs.findIndex((tab) => tab.id === activeTab) * 100) /
                      tabs.length
                    }%)`,
                    width: `calc(100% / ${tabs.length})`,
                  }}
                ></div>

                <div className="flex w-full space-x-1 items-center">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setChacha(!chacha);
                      }}
                      className={`
                    group relative cursor-pointer flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium
                    transition-all duration-200 ease-in-out
                    ${
                      activeTab === tab.id
                        ? "text-indigo-700"
                        : "text-gray-600 hover:text-indigo-600"
                    }
                  `}
                    >
                      <div className="relative z-10 flex items-center gap-2">
                        {activeTab === tab.id && (
                          <span className="absolute inset-0 rounded-md bg-indigo-50/80 transition-all duration-200"></span>
                        )}
                        <span className="relative">{tab.title}</span>
                      </div>

                      {/* Hover effect */}
                      <span className="absolute inset-0 rounded-md bg-indigo-50/0 transition-all duration-200 group-hover:bg-indigo-50/50"></span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center pb-10">
        <div className="w-full max-w-xl bg-white shadow-lg border border-gray-200">
          <div className="p-4 md:p-6">
            {/* Tab Content */}
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={activeTab === tab.id ? "block" : "hidden"}
              >
                {/* Video Tab */}
                {tab.type === "video" && (
                  <>
                    {/* Search Input */}
                    <div className="flex items-center w-full bg-white rounded-full overflow-hidden border border-gray-200 mb-3">
                      <div className="flex items-center justify-center bg-gray-100 rounded-full w-10 h-10 md:w-12 md:h-12 min-w-10 md:min-w-12 ml-1">
                        <span className="text-xs md:text-sm font-bold">
                          {videos.length}
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="Nhập link"
                        className="flex-1 px-3 py-2 md:py-3 outline-none text-sm md:text-base"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      />
                      <button
                        onClick={handleSearch}
                        className="flex cursor-pointer items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md transition duration-300 ease-in-out"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          viewBox="0 0 24 24"
                        >
                          <path d="m5 12 7-7 7 7" />
                          <path d="M12 19V5" />
                        </svg>
                      </button>
                    </div>

                    <button
                      onClick={openFirstUnopened}
                      className="rounded-full hover:cursor-pointer w-full bg-gray-800 hover:bg-gray-700 text-white py-3 md:py-4 text-sm md:text-base font-medium transition-colors duration-200"
                    >
                      Xem video
                    </button>

                    {/* Video List */}
                    <div className="bg-white rounded-xl p-2 md:p-3 border border-gray-200">
                      <div className="bg-gray-100 p-2 md:p-3 mb-2 md:mb-3">
                        <h2 className="text-center text-sm md:text-base font-medium">
                          Danh sách link
                        </h2>
                      </div>

                      <div className="space-y-2 md:space-y-3 max-h-[300px] md:max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                        {videos.length > 0 ? (
                          [...videos]
                            .sort((a) => (openedVideos.includes(a.id) ? 1 : -1))
                            .map((video, index) => (
                              <div
                                key={video.id}
                                className={`flex items-center justify-between bg-gray-50 p-2 md:p-3 hover:bg-gray-100 transition-colors duration-200 ${
                                  openedVideos.includes(video.id)
                                    ? "opacity-70"
                                    : ""
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

                {/* About Tab */}

                {/* Note Tab */}
                <div>
                  {tab.type === "note" &&
                    (isAuthenticated ? (
                      <NoteAndSetting type={chacha} />
                    ) : (
                      <LoginForm onLogin={handleLogin} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {activeTab == 2 && <Info />}
    </div>
  );
}
