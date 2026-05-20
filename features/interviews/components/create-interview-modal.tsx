"use client";

import * as React from "react";
import { X } from "lucide-react";

interface CreateInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateInterviewModal({ isOpen, onClose }: CreateInterviewModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" id="interviewModal">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        id="modalBackdrop"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-[684px] bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Create an Interview Session</h2>
            <p className="text-sm text-slate-500 mt-1">Please fill out the form below to add a new interview session.</p>
          </div>
          <button
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
            id="closeModalIcon"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-6 overflow-y-auto">
          <form className="space-y-6" id="newInterviewForm" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Interview Session Title <span className="text-red-500">*</span>
              </label>
              <input
                className="w-[609px] px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="Name of the interview"
                required
                type="text"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Partner's Company Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-[609px] px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                placeholder="Name of the partner's company"
                required
                type="text"
              />
            </div>
            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-[609px] min-h-[100px] px-4 py-[14px] border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                placeholder="Description of the interview"
                required
              ></textarea>
            </div>

            {/* Context */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Context <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-[609px] min-h-[100px] px-4 py-[14px] border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                placeholder="Context of the interview"
                required
              ></textarea>
            </div>

            {/* Objective */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Objective <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-[609px] min-h-[100px] px-4 py-[14px] border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                placeholder="Objective of the interview"
                required
              ></textarea>
            </div>
            <div className="flex gap-[16px]">
              <div className="w-[296.5px]">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Interview Purpose <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select className="w-full h-[48px] px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow appearance-none bg-white text-slate-400" required>
                    <option value="" disabled selected>Choose Purpose</option>
                    <option value="hiring">Hiring</option>
                    <option value="assessment">Internal Assessment</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                  </div>
                </div>
              </div>
              <div className="w-[296.5px]">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Number of Question(s) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select className="w-full h-[48px] px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow appearance-none bg-white text-slate-400" required>
                    <option value="" disabled selected>0</option>
                    <option value="5">5 Questions</option>
                    <option value="10">10 Questions</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Role and Level */}
            <div className="flex gap-[16px]">
              <div className="w-[296.5px]">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Role Target <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select className="w-full h-[48px] px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow appearance-none bg-white text-slate-400" required>
                    <option value="" disabled selected>Choose Level Target</option>
                    <option value="frontend">Frontend Engineer</option>
                    <option value="backend">Backend Engineer</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                  </div>
                </div>
              </div>
              <div className="w-[296.5px]">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Level Target <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select className="w-full h-[48px] px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow appearance-none bg-white text-slate-400" required>
                    <option value="" disabled selected>Choose Level Target</option>
                    <option value="junior">Junior</option>
                    <option value="middle">Middle</option>
                    <option value="senior">Senior</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Technologies */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Technology(s) <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-[609px] min-h-[100px] px-4 py-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                placeholder="Ex. React Js, Springboot, etc"
                required
              ></textarea>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 rounded-b-2xl border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0">
          <button
            type="button"
            className="px-5 py-2.5 bg-[#dcf3f9] text-[#00a8cc] rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors"
            id="closeModalBtn"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2.5 bg-[#0070c9] text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
            type="submit"
            form="newInterviewForm"
          >
            Create Interview
          </button>
        </div>
      </div>
    </div>
  );
}

