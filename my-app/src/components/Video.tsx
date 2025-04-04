import { useState, useEffect } from "react";
import axios from "axios";
import { LoginForm } from "./LoginForm.tsx";
import { VideoForm } from "./VideoForm.tsx";
import { toast } from "react-toastify";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import React from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeEdit, setActiveEdit] = useState(false);
  const [fetch, setFetch] = useState(false);
  const [editVideo, setEditVideo] = useState(0);

  // Sample data - replace with your actual images
  const images = [
    { id: "1", url: "images1.png" },
    { id: "2", url: "images2.png" },
    { id: "3", url: "images3.png" },
    { id: "4", url: "images4.png" },
  ];

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleSelectImage = (index: number) => {
    setActiveIndex(index);
  };
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [activeLink, setActiveLink] = useState(0);
  const [setActiveLinkNote] = useState(0);

  const [chacha, setChacha] = useState(false);
  const [url, setUrl] = useState("");
  const [videos, setVideos] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);

  const [openedVideos, setOpenedVideos] = useState<any>([]);
  const [openedNotes, setOpenedNotes] = useState<any>([]);
  const deleteVideo = async (videoId) => {
    try {
      await api.delete(`/videos/${videoId}`);
      setVideos((prevVideos) =>
        prevVideos.filter((video) => video.id !== videoId)
      );
      setFetch(!fetch);
      setEditVideo(0);
    } catch (error) {
      console.error("Lỗi khi xóa video:", error);
    }
  };

  // Gọi API lấy danh sách video
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get("/videos");
        // Kiểm tra data có phải mảng không
        const todayVideos = response.data ?? [];
        setVideos(todayVideos);
        setActiveLink(todayVideos[0].id ?? 0);
      } catch (error) {
        console.error("Lỗi khi lấy video:", error);
      }
    };

    const fetchNotes = async () => {
      try {
        const response = await api.get("/notes");
        // Kiểm tra data có phải mảng không

        setNotes(response?.data ?? []);
        setActiveLinkNote(response.data[0].id ?? 0);
      } catch (error) {
        console.error("Lỗi khi lấy note:", error);
      }
    };

    fetchVideos();
    fetchNotes();
  }, [fetch]);
  const deleteAllNotes = async () => {
    try {
      await api.delete("/notes");
      setNotes([]); // Xóa hết notes trong state
      setActiveLinkNote(0); // Đặt active về 0
    } catch (error) {
      console.error("Lỗi khi xóa tất cả notes:", error);
    }
  };
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

  useEffect(() => {
    const savedLastWatchedId = localStorage.getItem("lastWatchedNoteId");
    if (savedLastWatchedId) {
      const lastWatchedId = JSON.parse(savedLastWatchedId);
      const nextNote = notes.find((note) => note.id > lastWatchedId);
      console.log(nextNote);
      if (nextNote) {
        setActiveLinkNote(nextNote.id);
      }
    }
  }, [notes]); // Chạy lại khi danh sách notes thay đổi

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleSubmit = async (name, link) => {
    try {
      await api.post("/videos", [
        {
          url: link,
          name,
        },
      ]);
      setFetch(!fetch);
      toast("Video đã gửi thành công!");
    } catch (error) {
      toast("Lưu thất bại, vui lòng thử lại!");
    }
  };
  const handleSearch = async () => {
    try {
      const response = await api.get("/notes");
      const updatedContent = response.data.content
        ? `${response.data.content}\n${url}`
        : url;

      await api.post("/notes", [
        {
          url: updatedContent,
        },
      ]);
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
    // Lấy danh sách video đã mở từ localStorage
    const savedOpenedVideos = localStorage.getItem("openedVideos");
    // Lấy danh sách note đã mở từ localStorage
    const savedOpenedNotes = localStorage.getItem("openedNotes");
    // Lấy thông tin xác thực người dùng
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

    if (savedOpenedVideos) {
      try {
        const parsedOpenedVideos = JSON.parse(savedOpenedVideos);
        if (Array.isArray(parsedOpenedVideos)) {
          setOpenedVideos(parsedOpenedVideos); // Set thẳng thay vì concat vào
        }
      } catch (error) {
        localStorage.removeItem("openedVideos");
      }
    }

    if (savedOpenedNotes) {
      try {
        const parsedOpenedNotes = JSON.parse(savedOpenedNotes);
        if (Array.isArray(parsedOpenedNotes)) {
          setOpenedNotes(parsedOpenedNotes); // Set thẳng thay vì concat vào
        }
      } catch (error) {
        localStorage.removeItem("openedNotes");
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

  const handleOpenNotes = (url: any) => {
    window.open(url, "_blank");
  };
  // Mở video đầu tiên chưa mở
  const openFirstUnopened = () => {
    const firstUnopened = videos.find(
      (video: any) => !openedVideos.includes(video.id)
    );
    if (firstUnopened) {
      handleOpenVideo(firstUnopened.id, firstUnopened.url);
    } else {
      localStorage.removeItem("lastWatchedVideoId");
      localStorage.removeItem("openedVideos");
      setActiveLink(videos[0].id);
      setOpenedVideos([]);
    }
  };
  const copyToClipboard = async (textToCopy) => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        alert("Đã sao chép vào bộ nhớ tạm!");
      } catch (error) {
        console.error("Lỗi khi sao chép:", error);
      }
    } else {
      // Dùng textarea ẩn nếu không phải HTTPS
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;

      // Ẩn textArea ra khỏi viewport
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";

      document.body.appendChild(textArea);
      textArea.select();

      try {
        document.execCommand("copy");
        alert("Đã sao chép vào bộ nhớ tạm!");
      } catch (error) {
        console.error("Lỗi khi sao chép:", error);
      } finally {
        textArea.remove();
      }
    }
  };

  const openFirstNoteUnopened = () => {
    const textContent = notes.map((note) => note.url).join("\n");

    if (!textContent) {
      alert("Không có nội dung để sao chép!");
      return;
    }

    copyToClipboard(textContent);
  };

  console.log(activeLink);
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
      <div className="flex flex-col">
        {/* Tab Navigation */}
        <div className="flex justify-center pt-2 bg-[#1C1C1D] pb-2">
          <div className="w-full max-w-xl flex justify-between items-center px-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black border border-gray-800 text-white font-semibold text-sm">
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
              {notes.length}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            backgroundImage:
              "url('https://s3-alpha-sig.figma.com/img/3bdf/ee0a/20a8c00d6232df27980ebb81e1cbf305?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=JpZIBJTQvNNGj-i7jXjvMVAHZl3YC1G1ev2OZihEoT6ChJ1QhpXNA4AHbAWEGemmb6qUvjeHgDE3AcXfVFHPdmx7RBs-v2RT-UiyTLOwRvbdlgULGkj-j3aV16Iid2dfHQjyaVJ3p1nnueXSL5MSEkuctBLpiEi8FewyctPrQNVZN99Kqy~FL~EdW9PgX3n4J2TFW8BkgRzRmaJBOJl2slr5CHRXVBWR-svq8eGrvzHBuU~O78gRL6tRiBm62t0PYzCcCIV2QHIljrnDc6fgaOU96noYPJmHT92VdRF-Ch-edG1unwC0EAQ3aCM2zZqkNHrZgjB09XGHamQdrfnARQ__')",
          }}
          className="flex justify-center pb-10 w-full bg-repeat bg-top h-[483px]"
        >
          <div className="w-full flex justify-center max-w-xl rounded-xl border border-[#333]">
            <div className="bg-[#1C1C1DB2] w-[343px] m-h-[350px] px-6 pt-6 pb-10 mt-6 border rounded-2xl border-[#FFFFFF4D]">
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
                        <div className="flex justify-center bg-white rounded-[47px] mb-4 px-3 w-full h-[48px] border-2 border-gray-200">
                          {/* Div con chứa nội dung scrollable */}
                          <div className="flex-1 overflow-x-auto no-scrollbar py-1 px-2">
                            <div className="flex w-max space-x-2">
                              {/* Thay mx-2 bằng space-x-2 */}
                              {videos.map((video, i) => (
                                <button
                                  key={video.id}
                                  className={`flex items-center justify-center w-[32px] h-[32px] rounded-full text-sm font-bold transition-all ${
                                    video.id + 1 === activeLink
                                      ? "bg-[#3FF066] text-black scale-110 border-2 border-black"
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
                                  video.id + 1 === activeLink
                                    ? "bg-[#3FF066] text-black"
                                    : "bg-black text-white"
                                }`}
                              >
                                {video.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Watch Video Button */}
                      <button
                        onClick={openFirstUnopened}
                        className="rounded-full h-[34px] w-full bg-[#3FF066] text-black font-extrabold text-sm cursor-pointer"
                      >
                        Watch video
                      </button>
                      <div className=" text-yellow-300 text-center font-extralight text-xl mt-10">
                        Bán tài khoản tiktok lite uy tín zalo 0866535203
                      </div>
                    </>
                  )}
                  {/* Note Tab */}
                  {tab.type === "shop" && (
                    <>
                      <div>
                        {/* Div cha chứa viền và padding */}
                        <div className="flex bg-white rounded-[47px] mb-4 px-3 w-full h-[48px] border-2 border-gray-200">
                          {/* Div con chứa nội dung scrollable */}
                          <div className="flex-1 overflow-x-auto no-scrollbar py-1 px-2">
                            <div className="flex justify-center space-x-2">
                              {/* Thay mx-2 bằng space-x-2 */}
                              {images.map((image, i) => (
                                <button
                                  key={image.id}
                                  onClick={() => handleSelectImage(i)}
                                  className={`flex items-center justify-center w-[32px] h-[32px] rounded-full text-sm font-bold transition-all ${
                                    i === activeIndex
                                      ? "bg-[#3FF066] text-black scale-110 border-2 border-black"
                                      : "bg-black text-white border-2 border-[#3FF066] hover:bg-zinc-800"
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
                      <div className="bg-white rounded-2xl mb-4 border-2 border-zinc-200 p-4 w-full relative h-[152px] mt-8">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={handlePrevious}
                            className="bg-[#3FF066] rounded-full p-1 text-black"
                          >
                            <ChevronLeft className="w-6 h-6" strokeWidth={5} />
                          </button>

                          <div className="w-[103px] h-[103px] bg-black flex items-center justify-center text-white">
                            {activeIndex !== undefined ? (
                              <img
                                src={`./${images[activeIndex].url}`}
                                alt={`Image ${activeIndex + 1}`}
                                width={103}
                                height={103}
                                className="object-cover"
                              />
                            ) : (
                              "image"
                            )}
                          </div>

                          <button
                            onClick={handleNext}
                            className="bg-[#3FF066] rounded-full p-1 text-black"
                          >
                            <ChevronRight className="w-6 h-6" strokeWidth={5} />
                          </button>
                        </div>
                      </div>
                      {/* Watch Video Button */}
                      <button className="rounded-full h-[34px] w-full bg-[#3FF066] text-black font-extrabold text-sm cursor-pointer">
                        Call
                      </button>
                    </>
                  )}
                  {tab.type === "payout" && (
                    <div>
                      {isAuthenticated && !activeEdit ? (
                        <>
                          <div>
                            {/* Div cha chứa viền và padding */}
                            <div className="flex justify-center items-center bg-white rounded-[47px] mb-4 px-3 w-full h-[48px] border-2 border-gray-200">
                              {/* Div con chứa nội dung scrollable */}
                              <div className="flex w-max space-x-2 font-bold text-sm">
                                Collect links
                              </div>
                            </div>
                          </div>

                          {/* Video List */}
                          <div className="bg-white rounded-2xl mb-4 border-2 h-[152px] border-gray-200 p-2 mt-8">
                            {/* Div container bên trong nhỏ hơn để chứa scrollbar */}
                            <div className="overflow-x-auto no-scrollbar max-h-[132px] rounded-xl">
                              <div className="space-y-2">
                                {notes.map((note, i) => (
                                  <button
                                    key={note.id}
                                    onClick={() => handleOpenNotes(note.id)}
                                    className="w-full h-[24px] bg-[#3FF066] text-black border-green-500 border rounded-full text-center font-medium px-2 text-[13px] truncate"
                                  >
                                    Link {i + 1}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                          <>
                            <button
                              onClick={openFirstNoteUnopened}
                              className="rounded-full h-[34px] w-full bg-[#3FF066] text-black font-extrabold text-sm cursor-pointer"
                            >
                              Copy link
                            </button>
                            <button
                              onClick={deleteAllNotes}
                              className="rounded-full my-3 h-[34px] w-full bg-white text-black font-extrabold text-sm cursor-pointer"
                            >
                              Delete all
                            </button>
                            <button
                              onClick={() => setActiveEdit(!activeEdit)}
                              className="rounded-full h-[34px] w-full bg-white text-black font-extrabold text-sm cursor-pointer"
                            >
                              Add link
                            </button>
                          </>
                        </>
                      ) : isAuthenticated && activeEdit ? (
                        <>
                          {/* Video Numbers */}
                          {!isOpen ? (
                            <div>
                              {/* Div cha chứa viền và padding */}
                              <div className="flex justify-center bg-white rounded-[47px] mb-4 px-3 w-full h-[48px] border-2 border-gray-200">
                                {/* Div con chứa nội dung scrollable */}
                                <div className="flex-1 overflow-x-auto no-scrollbar py-1 px-2">
                                  <div className="flex w-max space-x-2">
                                    {/* Thay mx-2 bằng space-x-2 */}
                                    {videos.map((video, i) => (
                                      <button
                                        key={video.id}
                                        className={`flex items-center justify-center w-[32px] h-[32px] rounded-full text-sm font-bold transition-all ${
                                          video.id == editVideo
                                            ? "bg-[#3FF066] text-black scale-110 border-2 border-black"
                                            : "bg-black text-white border-2 border-green-500 hover:bg-gray-800"
                                        }`}
                                      >
                                        {i + 1}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              {/* Video List */}
                              <div className="bg-white rounded-2xl mb-4 border-2 max-h-[152px] border-gray-200 p-2 mt-8">
                                {/* Div container bên trong nhỏ hơn để chứa scrollbar */}
                                <div className="overflow-x-auto no-scrollbar max-h-[132px] rounded-xl">
                                  <div className="space-y-2">
                                    {videos.map((video) => (
                                      <div
                                        key={video.id}
                                        className="flex items-center gap-2"
                                      >
                                        <button
                                          onClick={() => setEditVideo(video.id)}
                                          className={`relative  w-full h-[24px] border-green-500 border rounded-full text-center font-medium px-2 text-[13px] truncate ${
                                            video.id == editVideo
                                              ? "bg-[#3FF066] text-black"
                                              : "bg-black text-white"
                                          }`}
                                        >
                                          {video.name}
                                          {video.id == editVideo && (
                                            <button
                                              onClick={() =>
                                                deleteVideo(video.id)
                                              }
                                              className=" absolute right-0.5 bg-red-500 text-black rounded-full float-end"
                                            >
                                              <X size={18} />
                                            </button>
                                          )}
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Watch Video Button */}
                              <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="rounded-full h-[34px] w-full bg-[#3FF066] text-black font-extrabold text-sm cursor-pointer"
                              >
                                Add Link
                              </button>
                              <button
                                onClick={() => setActiveEdit(!activeEdit)}
                                className="rounded-full h-[34px] w-full bg-white mt-2 text-black font-extrabold text-sm cursor-pointer"
                              >
                                Back
                              </button>
                            </div>
                          ) : (
                            <VideoForm
                              isOpen={isOpen}
                              setIsOpen={setIsOpen}
                              onSubmit={handleSubmit}
                            />
                          )}
                        </>
                      ) : (
                        <LoginForm onLogin={handleLogin} />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <footer className="flex items-center justify-end px-3 py-3 bg-[#1C1C1D] h-[83px]">
        <div className="h-6 w-6 rounded-full bg-[#3FF066] mr-3"></div>
        <div className="text-2xl font-bold text-[#3FF066]">iconic</div>
      </footer>
    </div>
  );
}
