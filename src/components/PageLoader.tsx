import { motion } from 'framer-motion'

export default function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="h-16 w-16 animate-spin rounded-full border-4 border-t-4 border-gray-200"
          style={{ borderTopColor: '#3498db' }}
        ></motion.div>
      </motion.div>
    </div>
  )
}
