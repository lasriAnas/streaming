import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center text-center px-4">
      <div className="text-red-600 font-black text-8xl md:text-9xl mb-4 leading-none">404</div>
      <h1 className="text-white font-bold text-2xl md:text-3xl mb-3">Lost your way?</h1>
      <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
        Sorry, we can&apos;t find that page. You&apos;ll find lots to explore on the home page.
      </p>
      <Link
        href="/"
        className="bg-white text-black font-bold px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors"
      >
        StreamVault Home
      </Link>
    </div>
  );
}
