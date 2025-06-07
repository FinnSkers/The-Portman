"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function OnboardingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
        <div className="flex items-center justify-center min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-all" aria-hidden="true" />
          </Transition.Child>
          <span className="inline-block align-middle h-screen" aria-hidden="true">&#8203;</span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
            leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-8 my-8 align-middle transition-all transform bg-white/90 dark:bg-gray-900/90 shadow-xl rounded-2xl border border-indigo-200 dark:border-indigo-800 glass">
              <Dialog.Title as="h3" className="text-2xl font-bold text-indigo-700 dark:text-indigo-200 mb-4">
                Welcome to PORTMAN!
              </Dialog.Title>
              <div className="text-gray-700 dark:text-gray-200 text-base mb-6">
                <ul className="list-disc pl-5 space-y-2 text-left">
                  <li>Upload your CV and let AI do the work</li>
                  <li>Benchmark your skills with industry leaders</li>
                  <li>Customize and launch your portfolio in minutes</li>
                  <li>Manage your data and privacy easily</li>
                </ul>
              </div>
              <button
                className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow transition"
                onClick={onClose}
                autoFocus
              >
                Get Started
              </button>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
