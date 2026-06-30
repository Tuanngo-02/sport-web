import React from "react";
import { StarIcon } from "@heroicons/react/20/solid";

const ReviewPage = () => {
  return (
    <div className="pt-2 font-sans">
      <h2 className="text-xl font-bold mb-8 text-brand-primary font-display uppercase tracking-tight">
        Đánh giá của khách hàng
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Left Side: Rating Summary (col-span 4) */}
        <div className="md:col-span-4 bg-brand-gray-light/60 border border-brand-gray-border p-6 rounded-2xl h-fit">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-extrabold text-brand-primary font-display">4.8</span>
            <span className="text-sm font-semibold text-brand-gray-text">/ 5.0</span>
          </div>

          <div className="flex items-center text-yellow-400 mb-6">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <StarIcon key={i} className="size-5 shrink-0 text-yellow-400" />
            ))}
            <span className="text-xs font-semibold text-brand-gray-text ml-2">(117 đánh giá)</span>
          </div>

          <div className="space-y-3">
            {[
              { stars: 5, percentage: 73 },
              { stars: 4, percentage: 15 },
              { stars: 3, percentage: 7 },
              { stars: 2, percentage: 3 },
              { stars: 1, percentage: 2 },
            ].map((item) => (
              <div key={item.stars} className="flex items-center text-xs font-semibold text-brand-primary">
                <span className="w-3">{item.stars}</span>
                <StarIcon className="size-3.5 text-yellow-400 ml-1 mr-2.5 shrink-0" />
                <div className="flex-1 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <span className="ml-3 text-brand-gray-text w-8 text-right">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Customer Reviews List (col-span 8) */}
        <div className="md:col-span-8 space-y-6">
          {[
            {
              name: "Emily Selman",
              rating: 5,
              comment:
                "Sản phẩm quá tuyệt vời! Chất liệu áo cực kỳ thoáng khí, thấm hút mồ hôi rất tốt. Tôi đã mặc đi chạy bộ 10km mà vẫn thấy thoải mái.",
              avatar:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
              date: "2 ngày trước",
            },
            {
              name: "Hector Gibbons",
              rating: 5,
              comment:
                "Đế giày êm ái, bám đường rất tốt ngay cả khi trời mưa nhẹ. Form giày ôm chân vừa vặn, cực kỳ hài lòng với sản phẩm này.",
              avatar:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
              date: "1 tuần trước",
            },
            {
              name: "Mark Edwards",
              rating: 4,
              comment:
                "Balo dã ngoại đựng được rất nhiều đồ, chống nước tốt. Giao hàng nhanh và tư vấn nhiệt tình.",
              avatar:
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
              date: "2 tuần trước",
            },
          ].map((review, index) => (
            <div key={index} className="flex gap-4 p-4 border border-brand-gray-border rounded-2xl hover:bg-brand-gray-light/30 transition-colors">
              <img
                src={review.avatar}
                alt={review.name}
                className="w-10 h-10 rounded-full object-cover border border-brand-gray-border"
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-brand-primary">{review.name}</h4>
                  <span className="text-[10px] font-semibold text-brand-gray-text">{review.date}</span>
                </div>
                
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`size-3.5 shrink-0 ${i < review.rating ? "text-yellow-400" : "text-zinc-200"}`}
                    />
                  ))}
                </div>
                
                <p className="text-xs leading-relaxed text-zinc-600 pt-1">{review.comment}</p>
              </div>
            </div>
          ))}

          {/* Action block */}
          <button className="w-full py-3 bg-white border border-brand-gray-border hover:border-brand-primary text-brand-primary text-xs font-bold uppercase tracking-wider rounded-xl transition-all btn-tactile">
            Viết đánh giá của bạn
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;