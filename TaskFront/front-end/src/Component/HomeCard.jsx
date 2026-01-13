import { motion } from "framer-motion";
function HomeCard({ title, desc, action, color }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={action}
      className={`cursor-pointer p-6 rounded-2xl text-white
      bg-linear-to-br ${color} shadow-lg`}
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm opacity-90">{desc}</p>
    </motion.div>
  );
}
export default HomeCard;
