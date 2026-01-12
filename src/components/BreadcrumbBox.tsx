
const BreadcrumbBox = () => {
    return (
        <div className="mb-6">
          <ul className="flex items-center text-sm">
            <li className="flex items-center">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                TRANG CHỦ
              </a>
              <i className="fas fa-chevron-right mx-2 text-gray-400 text-xs"></i>
            </li>
            <li className="flex items-center">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                MÔN THỂ THAO
              </a>
              <i className="fas fa-chevron-right mx-2 text-gray-400 text-xs"></i>
            </li>
            <li className="flex items-center">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                CHẠY BỘ & ĐI BỘ
              </a>
              <i className="fas fa-chevron-right mx-2 text-gray-400 text-xs"></i>
            </li>
            <li>
              <span className="text-gray-900">CHẠY ĐỊA HÌNH (TRAIL)</span>
            </li>
          </ul>
        </div>
    )
}
export default BreadcrumbBox;