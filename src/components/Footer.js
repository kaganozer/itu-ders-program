import dbData from "../data/courses.json";

export default function Footer() {
    return (
        <footer className=" mt-[1.5rem] text-center text-sm text-gray-600">
            <a className="text-blue-600 hover:underline" href="https://github.com/kaganozer/">Hamza Kağan Özer</a>
            <p>En son {new Date(dbData.lastUpdated).toLocaleString("tr-TR")} tarihinde güncellendi.</p>
        </footer>
    );
}