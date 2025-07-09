"use client";
import { motion } from "framer-motion";
import { AlertTriangle, Activity, Clock } from "lucide-react";

interface DashboardStatsProps {
  stats: {
    alarms: number;
    process: number;
    hours: number;
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              ALARMS
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400">
              {stats.alarms}
            </p>
          </div>
          <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              PROCESO
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
              {stats.process}
            </p>
          </div>
          <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              HOURS
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.hours}
            </p>
          </div>
          <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
        </div>
      </motion.div>
    </div>
  );
}
