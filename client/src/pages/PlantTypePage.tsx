import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const plantTypes = [
  { name: "Indoor Plants", path: "/indoor-plants" },
  { name: "Outdoor Plants", path: "/outdoor-plants" },
  { name: "Succulents", path: "/succulents" },
  { name: "Air Purifying", path: "/air-purifying" }
];

export default function PlantTypePage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <motion.section
      className="container mx-auto p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: isMounted ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-semibold mb-8">Plants Type</h1>
      <ul className="space-y-4">
        {plantTypes.map((plant) => (
          <motion.li
            key={plant.name}
            className="group p-4 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg shadow-lg hover:shadow-2xl"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Link to={plant.path} className="flex justify-between items-center">
              <span className="text-lg font-semibold">{plant.name}</span>
              <span className="transform group-hover:translate-x-2 transition-all">→</span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </motion.section>
  );
}
