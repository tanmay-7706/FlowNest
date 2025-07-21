import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaHistory, FaCheckCircle, FaClock } from "react-icons/fa";
import { BiTargetLock } from "react-icons/bi";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useAuth } from "../context/AuthContext";

const RecentActivityWidget = () => {
  const { currentUser } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const collections = [
      { name: "todos", icon: FaCheckCircle, color: "text-green-500" },
      { name: "goals", icon: BiTargetLock, color: "text-blue-500" },
      { name: "reflections", icon: FaClock, color: "text-purple-500" },
    ];

    const unsubscribes = [];
    let allActivities = [];

    collections.forEach(({ name, icon, color }) => {
      const q = query(
        collection(db, name),
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc"),
        limit(3)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const collectionActivities = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          collectionActivities.push({
            id: doc.id,
            type: name,
            title: data.title || data.text || data.name || "Activity",
            timestamp: data.createdAt,
            icon,
            color,
          });
        });

        // Update activities for this collection -->
        allActivities = allActivities.filter((activity) => activity.type !== name);
        allActivities = [...allActivities, ...collectionActivities];

        // Sort by timestamp and take latest 5 activities -->
        allActivities.sort((a, b) => {
          const aTime = a.timestamp ? new Date(a.timestamp) : new Date(0);
          const bTime = b.timestamp ? new Date(b.timestamp) : new Date(0);
          return bTime - aTime;
        });

        setActivities(allActivities.slice(0, 5));
        setLoading(false);
      });

      unsubscribes.push(unsubscribe);
    });

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [currentUser]);

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "Recently";

    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "todos":
        return "Task";
      case "goals":
        return "Goal";
      case "reflections":
        return "Reflection";
      default:
        return "Activity";
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
      <div className="flex items-center mb-4">
        <FaHistory className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : activities.length > 0 ? (
        <div className="space-y-3">
          {activities.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <div
                key={`${activity.type}-${activity.id}`}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 ${activity.color}`}>
                  <IconComponent size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{activity.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {getTypeLabel(activity.type)} • {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6">
          <FaHistory className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">No recent activity</p>
        </div>
      )}
    </motion.div>
  );
};

export default RecentActivityWidget;