import ThreeScene from "./components/ThreeScene";

export default function Home() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-black text-white">
      {/* Main Container */}
      <div className="flex gap-8 items-center">
        {/* Text Section */}
        <div className="text-left">
          <h1 className="text-2xl font-bold mb-2">Hey friends,</h1>
          <p className="text-lg font-semibold">I am Shivank.</p>
          <p className="text-sm mt-1 opacity-80">Welcome to my 3D portfolio.</p>
        </div>

        {/* Three.js Canvas */}
        <div
          className="w-[200px] h-[200px] relative "
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255, 255, 255, 0.6) 30%, transparent 5%)",
            backgroundSize: "10px 10px", // Smaller dots, closer together
          }}
        >
          <ThreeScene />
        </div>
      </div>
    </div>
  );
}
