
const ReviewPage = () => {
    return (
        // /* Customer Reviews */}
              <div className="border-t border-gray-200 pt-8">
                <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          {[1, 2, 3, 4].map((_, i) => (
                            <i
                              key={i}
                              className="fas fa-star text-yellow-400"
                            ></i>
                          ))}
                          <i className="far fa-star text-yellow-400"></i>
                        </div>
                        <div className="space-y-2">
                          {[
                            { stars: 5, percentage: 63 },
                            { stars: 4, percentage: 10 },
                            { stars: 3, percentage: 6 },
                            { stars: 2, percentage: 12 },
                            { stars: 1, percentage: 9 },
                          ].map((item) => (
                            <div key={item.stars} className="flex items-center">
                              <span className="w-4">{item.stars}</span>
                              <i className="fas fa-star text-yellow-400 ml-1 mr-2"></i>
                              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                                <div
                                  className="h-full bg-yellow-400 rounded-full"
                                  style={{ width: `${item.percentage}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-sm text-gray-600">
                                {item.percentage}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {[
                      {
                        name: "Emily Selman",
                        rating: 5,
                        comment:
                          "This is the bag of my dreams. I took it on my last vacation and was able to fit an absurd amount of snacks for the many long and hungry flights.",
                        avatar:
                          "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20smiling%20young%20woman%20with%20natural%20lighting%20against%20clean%20background&width=50&height=50&seq=20&orientation=squarish",
                      },
                      {
                        name: "Hector Gibbons",
                        rating: 5,
                        comment:
                          "Before getting the Ruck Snack, I struggled my whole life with pulverized snacks, endless crumbs, and other heartbreaking snack catastrophes. Now, I can stow my snacks with confidence and style!",
                        avatar:
                          "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20confident%20man%20in%20business%20attire%20against%20clean%20background&width=50&height=50&seq=21&orientation=squarish",
                      },
                      {
                        name: "Mark Edwards",
                        rating: 4,
                        comment:
                          "I love how versatile this bag is. It can hold anything ranging from cookies that come in trays to cookies that come in tins.",
                        avatar:
                          "https://readdy.ai/api/search-image?query=casual%20headshot%20of%20a%20young%20man%20with%20friendly%20expression%20against%20clean%20background&width=50&height=50&seq=22&orientation=squarish",
                      },
                    ].map((review, index) => (
                      <div key={index} className="flex space-x-4">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-medium">{review.name}</h3>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={`${i < review.rating ? "fas" : "far"} fa-star text-yellow-400`}
                              ></i>
                            ))}
                          </div>
                          <p className="mt-2 text-gray-600">{review.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <button className="w-full py-3 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 !rounded-button">
                    Write a review
                  </button>
                </div>
              </div>
    )
}
export default ReviewPage