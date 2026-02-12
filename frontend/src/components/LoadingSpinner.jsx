import { motion } from "framer-motion";

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center h-64 w-full">
    <motion.div
      className="w-12 h-12 border-4 border-zinc-300 border-t-zinc-800 rounded-full"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    />
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
      className="mt-4 text-zinc-600 font-medium"
    >
      Loading content...
    </motion.p>
  </div>
);

export default LoadingSpinner;