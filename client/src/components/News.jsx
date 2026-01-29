import { useEffect, useRef, useState } from "react";

const API_URL =
  "https://gnews.io/api/v4/top-headlines?lang=en&country=in&max=10&apikey=6af59648007b9440c04c7e1b3f9ba381";

export default function News() {
  const [news, setNews] = useState([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);


  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setNews(data.articles || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);


  useEffect(() => {
    if (!news.length) return;

    timerRef.current = setTimeout(() => {
      setActive((prev) => (prev + 1) % news.length);
    }, 4000);

    return () => clearTimeout(timerRef.current);
  }, [active, news.length]);

  if (loading) {
    return <div className="text-center py-20">Loading news...</div>;
  }

  if (!news.length) {
    return <div className="text-center text-red-500">No news found</div>;
  }

  return (
    <div className="w-full overflow-hidden mx-auto px-4 py-10">
      <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-black">

        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {news.map((item, i) => (
            <div key={i} className="min-w-full flex-shrink-0 relative flex items-center justify-center">
              {/* Make image fully visible and responsive using object-contain and viewport-based heights */}
              <img
                src={item.image || "https://via.placeholder.com/1200x600"}
                alt={item.title}
                className="w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] object-contain object-center bg-black"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />

              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-3xl p-6 sm:p-10 text-white z-10">
                <p className="text-xs uppercase tracking-widest text-green-400 mb-2 text-center sm:text-left">
                  {item.source?.name || "Breaking News"}
                </p>

                <h2 className="text-lg sm:text-2xl md:text-3xl font-bold mb-3 text-center sm:text-left">
                  {item.title}
                </h2>

                <p className="text-sm sm:text-base text-gray-200 line-clamp-2 mb-4 text-center sm:text-left">
                  {item.description}
                </p>

                <div className="flex justify-center sm:justify-start">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-sm font-semibold bg-green-400 text-black px-5 py-2 rounded-full hover:bg-green-300 transition"
                  >
                    Read Full Story →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() =>
            setActive((prev) => (prev === 0 ? news.length - 1 : prev - 1))
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/60 text-white w-10 h-10 rounded-full hover:bg-black transition"
        >
          ❮
        </button>

        <button
          onClick={() => setActive((prev) => (prev + 1) % news.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/60 text-white w-10 h-10 rounded-full hover:bg-black transition"
        >
          ❯
        </button>
      </div>

      <div className="flex justify-center mt-5 gap-2">
        {news.map((_, i) => (
          <span
            key={i}
            onClick={() => setActive(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition ${
              active === i ? "bg-green-500 scale-125" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
