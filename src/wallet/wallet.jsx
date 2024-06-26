import { useEffect, useState } from "react";

const Wallet = () => {
  const [color, setColor] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setColor(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [color]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setColor(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [color]);

  return (
    <div className="flex items-center justify-center text-3xl h-[100vh] w-full">
      <p
        className={`transition-all duration-[1s] ${
          color ? "text-red-600 font-bold" : ""
        }`}
      >
        N/A
      </p>
      <div className="fixed bottom-4 right-[29.9%] text-xl z-[550]">❌</div>
    </div>
  );
};

export default Wallet;
