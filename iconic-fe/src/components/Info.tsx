const Info = () => {
  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
          Tính năng nổi bật
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
            <div className="p-6 pb-4">
              <h3 className="text-sm font-medium text-gray-500">
                Apple Intelligence và macOS
              </h3>
              <h2 className="text-2xl font-bold mt-1 mb-4">
                Dễ sử dụng. Dễ phải lòng.
              </h2>
            </div>
            <div className="px-6 pb-6"></div>
          </div>

          {/* Card 2 - Privacy */}
          <div className="bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-2xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
            <div className="p-6 pb-4">
              <h3 className="text-sm font-medium text-white/80">
                Quyền Riêng Tư Và Bảo Mật
              </h3>
              <h2 className="text-2xl font-bold mt-1 mb-4">
                Việc của bạn. Chỉ của riêng bạn.
              </h2>
            </div>
            <div className="flex justify-center items-center p-6 h-[300px]">
              <div className="bg-white/20 p-8 rounded-full"></div>
            </div>
          </div>

          {/* Card 3 - Durability */}
          <div className="bg-black text-white rounded-2xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
            <div className="p-6 pb-4">
              <h3 className="text-sm font-medium text-white/80">Độ Bền</h3>
              <h2 className="text-2xl font-bold mt-1 mb-4">
                Được thiết kế để trụ vững với thời gian.
              </h2>
            </div>
            <div className="px-6 pb-6"></div>
          </div>

          {/* Card 4 - Core Values */}
          <div className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white rounded-2xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
            <div className="p-6 pb-4">
              <h3 className="text-sm font-medium text-white/80">
                Giá Trị Cốt Lõi
              </h3>
              <h2 className="text-2xl font-bold mt-1 mb-4">
                Giá trị của những gì tôi làm.
              </h2>
            </div>
            <div className="flex justify-center items-center p-6 h-[300px]">
              <div className="bg-white/20 p-8 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Info;
