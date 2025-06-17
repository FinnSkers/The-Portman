import { motion } from "framer-motion";
import Image from "next/image";

export default function FloatingMascot() {
  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50 flex flex-col items-center"
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: [40, -10, 0, -10, 0], opacity: 1 }}
      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      aria-label="Floating Mascot"
    >
      {/* Replace with your 8-bit mascot image or Lottie animation */}
      <div className="bg-black border-4 border-pink-400 rounded-full p-2 shadow-lg">
        <Image src="/8bit-mascot.png" alt="8-bit Mascot" width={56} height={56} className="pixelated" />
      </div>
      <span className="mt-2 text-pink-400 text-xs font-bold pixelated bg-black px-2 py-1 rounded shadow-lg">
        Need help?
      </span>
    </motion.div>
  );
}
