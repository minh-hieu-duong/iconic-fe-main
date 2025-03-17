import { useState, useEffect } from "react";
import axios from "axios";
import NoteAndSetting from "./Note";
import { LoginForm } from "./LoginForm";
import Info from "./Info";
import { toast } from "react-toastify";

export const api = axios.create({
  baseURL: "/api", ///api
  withCredentials: true,
});

export default function VideoDownloader() {
  const [tabs] = useState<any[]>([
    { id: "1", title: "Video", type: "video" },
    { id: "2", title: "Shop", type: "shop" },
    { id: "3", title: "Payout", type: "payout" },
  ]);
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [activeLink, setActiveLink] = useState(0);

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
        setActiveLink(todayVideos[0].id);
      } catch (error) {
        console.error("Lỗi khi lấy video:", error);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    const savedLastWatchedId = localStorage.getItem("lastWatchedVideoId");
    if (savedLastWatchedId) {
      const lastWatchedId = JSON.parse(savedLastWatchedId);
      const nextVideo = videos.find((video) => video.id > lastWatchedId);

      if (nextVideo) {
        setActiveLink(nextVideo.id);
      }
    }
  }, [videos]); // Chạy lại khi danh sách video thay đổi
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
    localStorage.setItem("lastWatchedVideoId", JSON.stringify(id));
    setActiveLink(id + 1);
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

  // Tìm kiếm video từ URL

  return (
    <div>
      <header className="w-full flex items-center justify-between px-3 py-3 bg-[#1C1C1D] h-[45px]">
        <div className="text-2xl font-bold text-[#3FF066]">iconic</div>
        <div className="relative w-[240px]">
          <div className="flex items-center border border-green-500 rounded-full overflow-hidden h-[33px]">
            <input
              type="text"
              placeholder="Link"
              className="pr-3 py-1 bg-transparent text-white outline-none w-full pl-3 h-8"
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              value={url}
            />
            <button
              onClick={handleSearch}
              className="flex items-center justify-center w-5 h-5 aspect-square mx-1 bg-[#3FF066] rounded-full hover:cursor-pointer"
            >
              <img src="./arrow.png" alt="Arrow" className="w-3 h-3" />
            </button>
          </div>
        </div>
      </header>
      <div className="min-h-screen flex flex-col">
        {/* Tab Navigation */}
        <div className="flex justify-center pt-2 bg-[#1C1C1D] pb-2">
          <div className="w-full max-w-xl flex justify-between items-center px-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black border border-gray-800 text-white font-bold">
              {videos.length}
            </div>
            <div className="relative flex justify-center w-[224px] h-[32px] overflow-hidden bg-black p-1 rounded-lg border border-[#333]">
              <div className="flex items-center justify-between w-full overflow-hidden">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setChacha(!chacha);
                    }}
                    className={`
                   flex-1 text-sm font-medium cursor-pointer text-center py-1
                   transition-all duration-200 ease-in-out
                   ${
                     activeTab === tab.id
                       ? "text-white bg-[#222] rounded-[8px]"
                       : "text-gray-400"
                   }
                 `}
                  >
                    <div>{tab.title}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black border border-gray-800 text-white font-bold">
              {videos.length}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex justify-center pb-10 w-full bg-[url('/bg-i.png')] bg-repeat bg-top h-[483px]">
          <div className="w-full flex justify-center max-w-xl rounded-xl border border-[#333]">
            <div className="bg-[#1C1C1DB2] w-[313px] h-[300px] mt-6">
              {/* Tab Content */}
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={activeTab === tab.id ? "block" : "hidden"}
                >
                  {/* Video Tab */}
                  {tab.type === "video" && (
                    <>
                      {/* Video Numbers */}
                      <div>
                        {/* Div cha chứa viền và padding */}
                        <div className="flex bg-white rounded-[47px] mb-4 px-4 w-full h-[48px] border-2 border-gray-200">
                          {/* Div con chứa nội dung scrollable */}
                          <div className="flex-1 overflow-x-auto no-scrollbar py-1">
                            <div className="flex w-max space-x-2">
                              {/* Thay mx-2 bằng space-x-2 */}
                              {videos.map((video, i) => (
                                <button
                                  key={video.id}
                                  className={`flex items-center justify-center w-[32px] h-[32px] rounded-full text-lg font-bold transition-all ${
                                    video.id === activeLink
                                      ? "bg-[#3FF066]-500 text-black scale-110 border-2 border-black"
                                      : "bg-black text-white border-2 border-green-500 hover:bg-gray-800"
                                  }`}
                                >
                                  {i + 1}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Video List */}
                      <div className="bg-white rounded-2xl mb-4 border-2 max-h-[152px] border-gray-200 p-2 mt-8">
                        {/* Div container bên trong nhỏ hơn để chứa scrollbar */}
                        <div className="overflow-x-auto no-scrollbar max-h-[132px] rounded-xl">
                          <div className="space-y-2">
                            {videos.map((video, i) => (
                              <button
                                key={video.id}
                                onClick={() =>
                                  handleOpenVideo(video.id, video.url)
                                }
                                className={`w-full h-[24px] border-green-500 border rounded-full text-center font-medium px-2 text-[13px] truncate  ${
                                  video.id == activeLink
                                    ? "bg-[#3FF066]-500 text-black"
                                    : "bg-black text-white"
                                }`}
                              >
                                Video {i + 1}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Watch Video Button */}
                      <button
                        onClick={openFirstUnopened}
                        className="rounded-full h-[34px] w-full bg-[#3FF066]-500  hover:bg-[#3FF066]-600 text-black text-base font-bold cursor-pointer"
                      >
                        Watch video
                      </button>
                    </>
                  )}
                  {/* Note Tab */}
                  {tab.type === "Shop" && (
                    <div>
                      <Info />
                    </div>
                  )}
                  {/* Note Tab */}
                  {tab.type === "payout" && (
                    <div>
                      {isAuthenticated ? (
                        <NoteAndSetting type={chacha} />
                      ) : (
                        <LoginForm onLogin={handleLogin} />
                      )}
                    </div>
                  )}

                  {/* Payout Tab */}
                  {tab.type === "payout" && (
                    <div className="bg-[#222] rounded-xl p-4 border border-[#333]">
                      <h2 className="text-xl font-bold text-center mb-4 text-white">
                        Payout
                      </h2>
                      <p className="text-center text-gray-300">
                        Payout content goes here
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
