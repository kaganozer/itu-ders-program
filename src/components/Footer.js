import dbData from "../data/courses.json";

export default function Footer() {
    return (
        <footer className="mt-12 border-t border-gray-200 pt-8 pb-12">
            <div className="flex flex-col items-center justify-center gap-2 text-center">
                <a 
                    href="https://github.com/kaganozer/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-gray-900 hover:text-black transition-colors flex items-center gap-2"
                >
                    <span>Hamza Kağan Özer</span>
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Son Güncelleme: {new Date(dbData.updatedAt || dbData.lastUpdated).toLocaleString("tr-TR")}
                </div>

                <p className="text-[10px] text-gray-400 mt-2 max-w-md">
                    Bu proje açık kaynaklıdır ve İTÜ öğrencileri için geliştirilmiştir. Resmi İTÜ uygulaması değildir.
                </p>
            </div>
        </footer>
    );
}