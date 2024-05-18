import Image from "next/image";
import logo from "../../public/Netflix_2015_logo.svg.png";
export default function Home() {
  return (
    <main>
      <section className="bg-[url(../../public/netflixbg.jpg)] min-h-screen bg-cover bg-center">
        <div className="w-full h-screen bg-[rgba(0,0,0,0.5)]">
          <header className="max-w-[1170px] mx-auto">
            <div className="grid sm:grid-cols-2 grid-cols-[30%_auto] px-6 items-center py-8">
              <figure>
                <Image
                  src={logo}
                  alt="Netflix"
                  width={200}
                  height={200}
                  className="w-[148px]"
                />
              </figure>
              <div className="flex justify-end">
                <div>
                  <select name="" id="" className="rounded px-2 py-2 mx-4">
                    <option value="">English</option>
                    <option value="">Hindi</option>
                  </select>
                </div>
                <button className="text-white bg-red-600 rounded px-2 py-1">
                  Sign In
                </button>
              </div>
            </div>
          </header>
        </div>
      </section>
    </main>
  );
}
