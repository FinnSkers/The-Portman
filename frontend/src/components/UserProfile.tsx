"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const user = {
  name: "PlayerOne",
  email: "playerone@email.com",
  avatar: "/8bit-avatar1.png", // Placeholder
  bio: "Pixel artist & AI enthusiast.",
  level: 42,
  xp: 8500,
  maxXp: 10000,
};

export default function UserProfile() {
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(user.bio);
  const xpPercentage = (user.xp / user.maxXp) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="w-full max-w-md mx-auto my-16 px-2"
    >
      <div className="glass rounded-3xl shadow-2xl overflow-hidden relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-400/30 to-transparent rounded-full blur-xl"></div>

        <div className="p-8 flex flex-col items-center gap-4 relative z-10">
          {/* Avatar with level indicator */}
          <div className="relative">
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-green-400 glow shadow-lg">
                <Image
                  src={user.avatar}
                  alt="User avatar"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Level badge */}
              <div className="absolute -top-2 -right-2 bg-pink-400 text-black rounded-full w-8 h-8 flex items-center justify-center border-2 border-black">
                <span className="font-8bit text-xs">{user.level}</span>
              </div>
            </motion.div>
          </div>

          {/* User info */}
          <div className="text-center">
            <h3 className="text-2xl font-8bit text-green-400 glow-text mb-1 tracking-wide">
              {user.name}
            </h3>
            <span className="text-green-300 text-sm font-sans">
              {user.email}
            </span>
          </div>

          {/* XP Bar */}
          <div className="w-full max-w-xs">
            <div className="flex justify-between text-xs font-8bit text-green-300 mb-1">
              <span>XP</span>
              <span>
                {user.xp}/{user.maxXp}
              </span>
            </div>
            <div className="w-full bg-black border-2 border-green-400 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-green-400 to-pink-400 rounded-full"
              />
            </div>
          </div>

          {/* Bio section */}
          <div className="w-full">
            {editing ? (
              <label className="w-full block">
                <span className="sr-only">Edit bio</span>
                <textarea
                  className="w-full mt-2 p-3 rounded-lg bg-black/50 border-2 border-green-400 text-green-200 font-sans focus:outline-none focus:border-pink-400 focus:glow-pink transition-all duration-200 resize-none"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="Edit your bio"
                  title="Edit bio"
                />
              </label>
            ) : (
              <div className="mt-2 p-3 rounded-lg bg-black/30 border-2 border-green-400/50">
                <p className="text-green-100 text-center font-sans">{bio}</p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 font-8bit text-black bg-green-400 border-2 border-green-500 rounded-lg hover-3d hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              onClick={() => setEditing(!editing)}
            >
              {editing ? "Save" : "Edit"}
            </motion.button>

            {editing && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 font-8bit text-black bg-pink-400 border-2 border-pink-500 rounded-lg hover-3d hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200"
                onClick={() => {
                  setBio(user.bio);
                  setEditing(false);
                }}
              >
                Cancel
              </motion.button>
            )}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-4 w-full mt-6 pt-6 border-t border-green-400/30">
            <div className="text-center">
              <div className="font-8bit text-green-400 text-lg">12</div>
              <div className="font-sans text-green-300 text-xs">Projects</div>
            </div>
            <div className="text-center">
              <div className="font-8bit text-pink-400 text-lg">5</div>
              <div className="font-sans text-green-300 text-xs">Achievements</div>
            </div>
            <div className="text-center">
              <div className="font-8bit text-blue-400 text-lg">89</div>
              <div className="font-sans text-green-300 text-xs">Score</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
