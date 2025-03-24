import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { api } from "./Video";
import { toast } from "react-toastify";

export default function NoteAndSetting({ type }: any) {
  const [note, setNote] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openedLinks, setOpenedLinks] = useState<{ url: string }[]>([]);

  const fetchOpenedLinks = async () => {
    try {
      const response = await api.get("/payment-links");
      setOpenedLinks(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách link đã mở:", error);
    }
  };

  useEffect(() => {
    fetchOpenedLinks();
  }, []);

  const [videoLinks, setVideoLinks] = useState([]);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newVideoDate, setNewVideoDate] = useState(new Date());

  const links = note.split("\n").filter((link) => link.trim() !== "");
  const unopenedLinks = links.filter(
    (link) => !openedLinks.some((openedLink) => openedLink.url === link)
  );

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      await Promise.all([fetchNote(), fetchVideoLinks()]);
      setIsLoggedIn(true);
    } catch (error) {
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchNote = async () => {
    try {
      const response = await api.get("/note");
      setNote(response.data.content);
    } catch (error) {
      console.error("Lỗi khi lấy ghi chú:", error);
    }
  };

  useEffect(() => {
    fetchNote();
  }, [type]);

  const fetchVideoLinks = async () => {
    try {
      const response = await api.get("/videos");
      setVideoLinks(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách video:", error);
    }
  };

  const handleClearNote = async () => {
    try {
      await api.put("/note", null, {
        params: { newContent: "" },
      });
      setNote("");
      toast("Đã xóa thành công!");
    } catch (error) {
      toast("Xóathất bại, vui lòng thử lại!");
    }
  };

  const handleSaveNote = () => {
    const content = openedLinks
      .filter((link) => links.includes(link.url))
      .map((link) => link.url)
      .join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "OpenedLinks.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openFirstUnopened = async () => {
    if (unopenedLinks.length > 0) {
      const url = unopenedLinks[0];
      window.open(url, "_blank");

      try {
        await api.post("/payment-links", [{ url }]);
        // Xóa link đã mở khỏi note
        await fetchOpenedLinks();
      } catch (error) {
        console.error("Lỗi khi xử lý link:", error);
      }
    } else {
      toast("Không còn link nào để mở!");
    }
  };

  const handleAddVideo = async () => {
    console.log("aaaaaaa");
    if (!newVideoUrl.trim()) {
      toast("Vui lòng nhập URL video.");
      return;
    }
    try {
      const newVideo = { url: newVideoUrl, dateShow: newVideoDate };
      await api.post("/videos", [newVideo]);
      toast("Video đã thêm!");
      setNewVideoUrl("");
      await fetchVideoLinks();
    } catch (error) {
      console.error("Lỗi khi thêm video:", error);
      toast("Thêm video thất bại, vui lòng thử lại!");
    }
  };

  const handleDeleteVideo = async (id: any) => {
    try {
      await api.delete(`/videos/${id}`);
      await fetchVideoLinks();
    } catch (error) {
      console.error("Lỗi khi xóa video:", error);
      toast("Xóa video thất bại, vui lòng thử lại!");
    }
  };
  const handleGo = async (url: any) => {
    console.log(url);
    await api.post("/payment-links", [{ url }]);
    // Xóa link đã mở khỏi note
    await fetchOpenedLinks();
    window.open(url, "_blank");
  };

  if (loading) return <p>⏳ Đang tải...</p>;

  return (
    <div className="max-w-2xl  mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      {isLoggedIn ? (
        <>
          <h2 className="text-xl font-bold mb-4 flex justify-center">
            Danh sách link chưa mở
          </h2>
          <button
            onClick={openFirstUnopened}
            className="rounded-full hover:cursor-pointer w-full bg-gray-800 hover:bg-gray-700 text-white py-3 md:py-4 text-sm md:text-base font-medium"
          >
            Mở link
          </button>

          <div className="bg-white rounded-xl p-2 border border-gray-200 max-h-80 overflow-y-auto">
            {unopenedLinks.length > 0 ? (
              unopenedLinks.map((link, index) => (
                <div
                  key={index}
                  className="flex justify-between p-2 hover:bg-gray-100 transition"
                >
                  <span className="truncate max-w-[250px]">{link}</span>
                  <button
                    onClick={() => handleGo(link)}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-3 py-1"
                  >
                    Go
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-gray-500">
                Không có link nào
              </p>
            )}
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-bold flex justify-center">
              Link đã mở
            </h2>
            <div className="bg-white rounded-xl p-2 border border-gray-200 max-h-80 overflow-y-auto">
              {openedLinks.filter((link) => links.includes(link.url)).length >
              0 ? (
                openedLinks
                  .filter((link) => links.includes(link.url))
                  .map((link, index) => (
                    <div
                      key={index}
                      className="flex justify-between p-2 hover:bg-gray-100 transition"
                    >
                      <span className="truncate max-w-[250px]">{link.url}</span>
                      <button
                        onClick={() => {
                          window.open(link.url, "_blank");
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-3 py-1"
                      >
                        Go
                      </button>
                    </div>
                  ))
              ) : (
                <p className="text-center py-4 text-gray-500">
                  Chưa có link nào được mở
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={handleSaveNote}
              className="rounded-full hover:cursor-pointer w-full p-3 bg-gray-800 hover:bg-gray-700 text-white py-2 text-sm md:text-base font-medium transition-colors duration-200"
            >
              Tải xuống đã mở
            </button>
            <button
              onClick={handleClearNote}
              className="rounded-full hover:cursor-pointer p-3 w-full   bg-gray-800 hover:bg-gray-700 text-white py-2  text-sm md:text-base font-medium transition-colors duration-200"
            >
              Xóa hết link
            </button>
          </div>

          {/* Phần Video Links giữ nguyên */}
          {/* Video Links Section */}
          <div className="border-t-4 border-indigo-400 pt-4 mt-8 shadow-md bg-white">
            <h2 className="text-xl font-bold mb-4 flex justify-center mt-8 text-gray-700">
              🎥 Video Links
            </h2>
            <div className="mb-4 flex flex-col gap-2 p-4">
              <input
                type="text"
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                className="w-full p-2 border-2 border-indigo-200 rounded-lg"
                placeholder="Nhập URL video..."
              />

              <DatePicker
                selected={newVideoDate}
                onChange={(date: any) => setNewVideoDate(date)}
                dateFormat="dd/MM/yyyy"
                className="w-full p-2 border-2 border-indigo-200 rounded-lg"
              />

              <button
                onClick={handleAddVideo}
                className="rounded-full hover:cursor-pointer w-full bg-gray-800 hover:bg-gray-700 text-white py-3 md:py-4 text-sm md:text-base font-medium transition-colors duration-200"
              >
                Thêm Video
              </button>
            </div>

            <ul>
              {videoLinks.map((video: any) => (
                <li
                  key={video.id}
                  className="flex justify-between p-2 border-b hover:bg-gray-100"
                >
                  <span className="truncate max-w-[60%]">{video.url}</span>
                  <div>
                    <span className="text-sm text-gray-600">
                      {new Date(video.dateShow).toLocaleDateString("vi-VN")}
                    </span>
                    <button
                      onClick={() => handleDeleteVideo(video.id)}
                      className="ml-2 px-2 py-1 bg-red-500 text-white rounded-lg"
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
        <p>🔐 Bạn cần đăng nhập</p>
      )}
    </div>
  );
}
