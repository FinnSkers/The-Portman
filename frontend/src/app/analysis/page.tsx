"use client";
import React, { useEffect, useState } from "react";
import { useCVStore } from "@/store/useCVStore";
import { analyzeCVRAG } from "@/utils/api";
import GlassCard from "@/components/GlassCard";
import { motion } from "framer-motion";
import { FaChartBar, FaUserTie, FaLightbulb, FaUsers, FaCheckCircle, FaStar, FaGraduationCap, FaBriefcase, FaLink, FaInfoCircle, FaDownload } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Tab } from "@headlessui/react";
import Tooltip from "@/components/Tooltip";

// Type definitions for report and parsed data
interface UserProfile {
  name?: string;
  industry?: string;
  experience_level?: string;
  skills_count?: number;
}

interface Report {
  user_profile?: UserProfile;
  match_score?: number;
  benchmark?: Record<string, string[] | string>;
  improvement_suggestions?: string[];
  similar_professionals?: Array<{ name: string; title: string; company: string; experience: string }>;
  industry_insights?: Record<string, string[] | string>;
  recommendations?: Record<string, unknown>;
}

interface ParsedCV {
  name?: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  address?: { present?: string; permanent?: { village?: string; postOffice?: string; policeStation?: string; district?: string } };
  summary?: string;
  personalDetails?: Record<string, unknown>;
  skills?: Array<{ skill: string }> | { softSkills?: { skill: string }[]; technicalSkills?: { skill: string }[] };
  education?: unknown[];
  experience?: unknown[];
  links?: Record<string, unknown>;
}

// Utility to download JSON as file (define only once at top level)
function downloadJSON(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}

// Move ParsedCVSection and helpers here
function ParsedCVSection({ parsed, loading = false, onEdit }: { parsed: ParsedCV | null, loading?: boolean, onEdit?: (cv: ParsedCV) => void }) {
  const [editState, setEditState] = useState(parsed || {});
  useEffect(() => { setEditState(parsed || {}); }, [parsed]);
  useEffect(() => { if (onEdit && parsed) onEdit(editState); }, [editState]);
  function handleFieldSave(field: string, val: string) {
    setEditState((prev) => ({ ...prev, [field]: val }));
  }
  // Helper functions in scope
  function flattenSkills(skills: ParsedCV["skills"]) {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills.map((s) => s.skill || s).filter(Boolean);
    const soft = Array.isArray(skills.softSkills) ? skills.softSkills.map((s) => s.skill) : [];
    const tech = Array.isArray(skills.technicalSkills) ? skills.technicalSkills.map((s) => s.skill) : [];
    return [...soft, ...tech].filter(Boolean);
  }
  function flattenAddress(address: ParsedCV["address"]) {
    if (!address) return '';
    let out = '';
    if (address.present) out += `Present: ${address.present}`;
    if (address.permanent && typeof address.permanent === 'object') {
      const p = address.permanent;
      out += (out ? ' | ' : '') + `Permanent: ${[p.village, p.postOffice, p.policeStation, p.district].filter(Boolean).join(', ')}`;
    }
    return out;
  }
  function flattenLinks(links: ParsedCV["links"]) {
    if (!links) return [];
    return Object.entries(links).flatMap(([k, v]) => {
      if (typeof v === 'object' && v !== null) {
        if (Array.isArray(v)) {
          return v.map((item, idx) => ({ label: `${k} ${idx+1}`, value: typeof item === 'object' ? JSON.stringify(item) : String(item) }));
        } else {
          return { label: k, value: JSON.stringify(v) };
        }
      } else {
        return { label: k, value: String(v) };
      }
    });
  }
  function flattenEducation(education: ParsedCV["education"]) {
    if (!Array.isArray(education)) return [];
    return education.map((edu, i) => {
      const e = edu as Record<string, unknown>;
      const main = [e.type, e.field, e.department, e.university, e.institution, e.city].filter(Boolean).join(' | ');
      const years = e.duration ? ` (${e.duration})` : '';
      const gpa = e.gpa ? `, GPA: ${e.gpa}` : '';
      return { label: main, value: `${years}${gpa}` };
    });
  }
  function flattenExperience(experience: ParsedCV["experience"]) {
    if (!Array.isArray(experience)) return [];
    return experience.map((exp, i) => {
      const e = exp as Record<string, unknown>;
      const main = [e.title, e.organization, e.location].filter(Boolean).join(' | ');
      const duration = e.duration ? ` (${e.duration})` : '';
      let details = '';
      if (Array.isArray(e.responsibilities)) {
        details = (e.responsibilities as Array<Record<string, unknown>>).map((r) => `${r.task}${r.description ? ': ' + r.description : ''}`).join('\n');
      }
      return { label: main + duration, value: details };
    });
  }
  function flattenPersonal(personal: ParsedCV["personalDetails"]) {
    if (!personal) return [];
    return Object.entries(personal).map(([k, v]) => ({ label: k.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()), value: v }));
  }

  // Inline editable field component
  function InlineEditableField({ label, value, onSave, type = "text", multiline = false, tooltip }: { label: string, value: string, onSave: (v: string) => void, type?: string, multiline?: boolean, tooltip?: string }) {
    const [editing, setEditing] = useState(false);
    const [val, setVal] = useState(value || "");
    const inputRef = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    useEffect(() => { setVal(value || ""); }, [value]);

    useEffect(() => {
      if (editing && inputRef.current) inputRef.current.focus();
    }, [editing]);

    function handleSave() {
      setEditing(false);
      if (val !== value) onSave(val);
    }

    function handleKeyDown(e: React.KeyboardEvent) {
      if (e.key === "Enter" && !multiline) handleSave();
      if (e.key === "Escape") { setEditing(false); setVal(value || ""); }
    }

    return (
      <div className="flex items-center gap-2 group">
        <div className="text-xs font-semibold text-indigo-500 uppercase mb-1 tracking-wide flex items-center gap-1">
          {label}
          {tooltip && <Tooltip content={tooltip}><FaInfoCircle className="text-indigo-400 cursor-pointer" /></Tooltip>}
        </div>
        {editing ? (
          multiline ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              className="border rounded px-2 py-1 text-base w-full min-h-[48px]"
              value={val}
              onChange={e => setVal(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              aria-label={`Edit ${label}`}
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              className="border rounded px-2 py-1 text-base w-full"
              type={type}
              value={val}
              onChange={e => setVal(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              aria-label={`Edit ${label}`}
            />
          )
        ) : (
          <span
            className="text-base text-gray-900 dark:text-gray-100 font-medium break-words whitespace-pre-line cursor-pointer group-hover:underline"
            onClick={() => setEditing(true)}
            onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setEditing(true); }}
            aria-label={`Edit ${label}`}
          >
            {value || <span className="text-gray-400">(empty)</span>}
          </span>
        )}
      </div>
    );
  }

  const sections = [
    { key: "personal", label: "Personal Info", icon: <FaUserTie />, fields: [
      { label: "Name", value: editState?.name, editable: true, field: "name", tooltip: "Your full name as it should appear on your CV." },
      { label: "Email", value: editState?.email, editable: true, field: "email", tooltip: "Your primary contact email." },
      { label: "Phone", value: editState?.phone || editState?.phoneNumber, editable: true, field: "phone", tooltip: "Your contact phone number." },
      { label: "Address", value: flattenAddress(editState?.address as any), editable: false },
      { label: "Summary", value: editState?.summary, editable: true, field: "summary", tooltip: "A brief professional summary or objective.", multiline: true },
      ...flattenPersonal(editState?.personalDetails as any).map((f) => ({ ...f, editable: false }))
    ].filter(f => f.value || f.editable) },
    { key: "skills", label: "Skills", icon: <FaStar />, fields: [
      { label: "Skills", value: Array.isArray(editState?.skills) ? editState.skills.map((s: any) => s.skill || s).join(", ") : flattenSkills(editState?.skills as any).join(", "), editable: true, field: "skills", tooltip: "Comma-separated list of your main skills." },
    ].filter(f => f.value || f.editable) },
    { key: "education", label: "Education", icon: <FaGraduationCap />, fields: flattenEducation(editState?.education as any).map((f) => ({ ...f, editable: false })) },
    { key: "experience", label: "Experience", icon: <FaBriefcase />, fields: flattenExperience(editState?.experience as any).map((f) => ({ ...f, editable: false })) },
    { key: "links", label: "Links", icon: <FaLink />, fields: flattenLinks(editState?.links as any).map((f) => ({ ...f, editable: false })) },
  ];
  if (loading) {
    return (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {[...Array(2)].map((_, idx) => (
          <div key={idx} className="space-y-3">
            <Skeleton className="h-6 w-32 mb-2" />
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ))}
      </div>
    );
  }
  // If parsed is null, show a message
  if (!parsed) {
    return <div className="text-gray-400 text-center py-8 col-span-2">No data available.</div>;
  }
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
      {sections.map((section, idx) => (
        section.fields.length > 0 && (
          <motion.div
            key={section.key}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.07 }}
            className=""
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg text-indigo-600 dark:text-indigo-300">{section.icon}</span>
              <span className="font-semibold text-indigo-700 dark:text-indigo-200 text-lg">{section.label}</span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {section.fields.map((field: any, i: number) => (
                field.editable ? (
                  <GlassCard key={i} className="w-full animate-fade-in-up">
                    <InlineEditableField
                      label={field.label}
                      value={field.value}
                      onSave={(val: string) => handleFieldSave(field.field, val)}
                      type={field.label === "Email" ? "email" : "text"}
                      multiline={!!field.multiline}
                      tooltip={field.tooltip}
                    />
                  </GlassCard>
                ) : (
                  <GlassCard key={i} className="w-full animate-fade-in-up">
                    <div className="text-xs font-semibold text-indigo-500 uppercase mb-1 tracking-wide flex items-center gap-1">{field.label}{field.tooltip && <Tooltip content={field.tooltip}><FaInfoCircle className="text-indigo-400 cursor-pointer" /></Tooltip>}</div>
                    <div className="text-base text-gray-900 dark:text-gray-100 font-medium break-words whitespace-pre-line">{typeof field.value === 'object' ? JSON.stringify(field.value) : field.value}</div>
                  </GlassCard>
                )
              ))}
            </div>
          </motion.div>
        )
      ))}
      {sections.every(s => s.fields.length === 0) && (
        <div className="text-gray-400 text-center py-8 col-span-2">No data available.</div>
      )}
    </div>
  );
}

function tryParseRaw(parsed: unknown): ParsedCV | null {
  if (parsed && typeof parsed === 'object' && parsed !== null && Object.keys(parsed).length === 1 && (parsed as any).raw) {
    const raw = (parsed as any).raw;
    let jsonStr = '';
    const codeBlock = raw.match(/```json\s*([\s\S]+?)```/);
    if (codeBlock) {
      jsonStr = codeBlock[1];
    } else {
      const braceStart = raw.indexOf('{');
      const braceEnd = raw.lastIndexOf('}');
      if (braceStart !== -1 && braceEnd !== -1 && braceEnd > braceStart) {
        jsonStr = raw.substring(braceStart, braceEnd + 1);
      }
    }
    if (jsonStr) {
      try {
        return JSON.parse(jsonStr);
      } catch (e) {
        return null;
      }
    }
  }
  return parsed as ParsedCV;
}

// Skeleton loader component
function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gradient-to-r from-indigo-100 via-white to-blue-100 dark:from-zinc-800 dark:via-zinc-900 dark:to-indigo-900 rounded ${className}`} />;
}

export default function AnalysisPage() {
  const { data } = useCVStore();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState({
    parsed: true,
    ai: true,
  });
  const [activeTab, setActiveTab] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [editedCV, setEditedCV] = useState<ParsedCV | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!data) {
      setError("No CV data found. Please upload your CV first.");
      return;
    }
    setLoading(true);
    analyzeCVRAG(data)
      .then(setReport)
      .catch((err: Error) => setError(err.message || "Analysis failed"))
      .finally(() => setLoading(false));
  }, [data]);

  // Only use data.parsed_data, never fallback to data directly
  let parsedCVData = (data && typeof data === 'object' && 'parsed_data' in data) ? data.parsed_data : null;
  parsedCVData = tryParseRaw(parsedCVData);

  // Tab definitions for navigation
  const tabs: { label: string }[] = [
    { label: "CV Details" },
    { label: "AI Recommendations" },
  ];

  // Full window layout
  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-indigo-50/90 via-white/95 to-blue-50/90 dark:from-gray-900/95 dark:via-gray-950/98 dark:to-indigo-950/95 flex flex-col items-center justify-start py-0 px-0">
      <div className="w-full dashboard-container flex flex-col gap-12 py-12">
        {/* Top Bar: Tabs, Help, Download */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 px-2">
          <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
            <Tab.List className="flex gap-2 bg-white/80 dark:bg-zinc-900/80 rounded-lg p-1 shadow border border-indigo-100 dark:border-indigo-900">
              {tabs.map((tab) => (
                <Tab
                  key={tab.label}
                  className={({ selected }) => `px-4 py-2 rounded-lg font-semibold text-base transition ${selected ? 'bg-indigo-600 text-white shadow' : 'text-indigo-700 dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-indigo-800'}`}
                >
                  {tab.label}
                </Tab>
              ))}
            </Tab.List>
          </Tab.Group>
          <div className="flex gap-2 items-center">
            <button className="p-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-800 transition" onClick={() => setShowHelp(true)} aria-label="Show Help"><FaInfoCircle className="text-xl text-indigo-500" /></button>
            <button
              className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-green-800 transition"
              aria-label="Download CV"
              onClick={() => downloadJSON(editedCV || parsedCVData, "improved_cv.json")}
            >
              <FaDownload className="text-xl text-green-600" />
            </button>
            <button className="px-5 py-2 rounded-lg bg-green-500 text-white font-semibold shadow hover:bg-green-600 transition" onClick={() => router.push("/portfolio")}>Make Portfolio</button>
            <button className="px-5 py-2 rounded-lg bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition" onClick={() => router.push("/")}>Back to Upload</button>
          </div>
        </div>
        {/* Tab Panels */}
        <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
          <Tab.Panels>
            <Tab.Panel>
              {/* CV Details Section (Parsed Data) */}
              <section className="w-full" id="parsed-cv-section" aria-labelledby="parsed-cv-heading">
                <div className="flex items-center gap-2 mb-2">
                  <h2 id="parsed-cv-heading" className="text-3xl font-bold text-indigo-700 dark:text-indigo-200 flex items-center gap-2">
                    <FaUserTie className="text-2xl text-indigo-400" /> Parsed CV Data
                  </h2>
                  <button
                    className="ml-2 px-3 py-1 text-xs rounded bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 hover:bg-indigo-200 dark:hover:bg-indigo-700 transition"
                    onClick={() => setShowDetails(s => ({ ...s, parsed: !s.parsed }))}
                    aria-expanded={showDetails.parsed}
                    aria-controls="parsed-cv-section"
                  >
                    {showDetails.parsed ? 'Hide' : 'Show'}
                  </button>
                </div>
                {showDetails.parsed && (
                  <div className="bg-white/90 dark:bg-zinc-900/90 rounded-2xl shadow-lg border border-indigo-100 dark:border-indigo-900 p-6">
                    {loading ? (
                      <ParsedCVSection parsed={{}} loading={true} />
                    ) : parsedCVData && typeof parsedCVData === 'object' && Object.keys(parsedCVData).length > 0 ? (
                      <ParsedCVSection parsed={parsedCVData} onEdit={setEditedCV} />
                    ) : (
                      <div className="text-gray-400 text-center py-8">No data available.</div>
                    )}
                  </div>
                )}
              </section>
            </Tab.Panel>
            <Tab.Panel>
              {/* AI Recommendations Section (AI & RAG Analysis) */}
              <section className="w-full" id="ai-analysis-section" aria-labelledby="ai-analysis-heading">
                <div className="flex items-center gap-2 mb-2">
                  <h2 id="ai-analysis-heading" className="text-3xl font-bold text-blue-700 dark:text-blue-200 flex items-center gap-2">
                    <FaChartBar className="text-2xl text-blue-400" /> AI & RAG Analysis
                  </h2>
                  <button
                    className="ml-2 px-3 py-1 text-xs rounded bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-700 transition"
                    onClick={() => setShowDetails(s => ({ ...s, ai: !s.ai }))}
                    aria-expanded={showDetails.ai}
                    aria-controls="ai-analysis-section"
                  >
                    {showDetails.ai ? 'Hide' : 'Show'}
                  </button>
                </div>
                {showDetails.ai && (
                  <GlassCard className="w-full p-0">
                    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 p-8">
                      {loading || !report ? (
                        <div>
                          <Skeleton className="h-8 w-48 mb-4" />
                          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 w-full mb-4" />)}
                        </div>
                      ) : error ? (
                        <div className="text-red-600 font-semibold mb-4">{error}</div>
                      ) : (
                        <>
                          <section>
                            <h3 className="font-semibold text-lg flex items-center gap-2"><FaUserTie className="text-blue-400" /> Your Profile</h3>
                            <div className="text-zinc-700 dark:text-zinc-200 text-base ml-2">
                              <div className="flex items-center gap-1">
                                <div>Name:</div>
                                <div className="font-semibold text-indigo-700 dark:text-indigo-200">{report.user_profile?.name}</div>
                              </div>
                              <div className="flex items-center gap-1">
                                <div>Industry:</div>
                                <div className="inline-block px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs font-semibold ml-1">{report.user_profile?.industry}</div>
                                <Tooltip content="The industry you are currently working in or most experienced with.">
                                  <FaInfoCircle className="text-indigo-400 text-xs" />
                                </Tooltip>
                              </div>
                              <div className="flex items-center gap-1">
                                <div>Experience Level:</div>
                                <div className="inline-block px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-indigo-700 dark:text-indigo-200 text-xs font-semibold ml-1">{report.user_profile?.experience_level}</div>
                                <Tooltip content="Your overall level of experience, based on your work history and skills.">
                                  <FaInfoCircle className="text-indigo-400 text-xs" />
                                </Tooltip>
                              </div>
                              <div className="flex items-center gap-1">
                                <div>Skills Count:</div>
                                <div className="inline-block px-2 py-0.5 rounded bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-200 text-xs font-semibold ml-1">{report.user_profile?.skills_count}</div>
                                <Tooltip content="The total number of unique skills identified in your CV.">
                                  <FaInfoCircle className="text-indigo-400 text-xs" />
                                </Tooltip>
                              </div>
                              <div className="flex items-center gap-1">
                                <div>Match Score:</div>
                                <div className="font-bold text-yellow-600 dark:text-yellow-300 text-lg ml-1">{report.match_score}%</div>
                                <Tooltip content="How well your CV matches the desired profile for your target jobs, based on skills, experience, and industry.">
                                  <FaInfoCircle className="text-indigo-400 text-xs" />
                                </Tooltip>
                              </div>
                            </div>
                          </section>
                          <section>
                            <h3 className="font-semibold text-lg flex items-center gap-2 mt-2"><FaCheckCircle className="text-green-400" /> Benchmark</h3>
                            <div className="text-zinc-700 dark:text-zinc-200 text-base ml-2">
                              {Object.entries(report.benchmark || {}).map(([k, v]) => (
                                <div key={k}><span className="font-medium capitalize">{k.replace(/_/g, ' ')}:</span> {Array.isArray(v) ? v.join(", ") : v+""}</div>
                              ))}
                            </div>
                          </section>
                          <section>
                            <h3 className="font-semibold text-lg flex items-center gap-2 mt-2"><FaLightbulb className="text-yellow-400" /> Suggestions</h3>
                            <ul className="list-disc ml-6 text-base text-zinc-700 dark:text-zinc-200">
                              {(report.improvement_suggestions || []).map((s: string) => (
                                <li key={s}>{s}</li>
                              ))}
                            </ul>
                          </section>
                          <section>
                            <h3 className="font-semibold text-lg flex items-center gap-2 mt-2"><FaUsers className="text-purple-400" /> Similar Professionals</h3>
                            <ul className="ml-2 text-base text-zinc-700 dark:text-zinc-200">
                              {(report.similar_professionals || []).map((p: { name: string; title: string; company: string; experience: string }) => (
                                <li key={p.name} className="mb-1">
                                  <span className="font-medium">{p.name}</span> — {p.title} at {p.company} ({p.experience})
                                </li>
                              ))}
                            </ul>
                          </section>
                          <section>
                            <h3 className="font-semibold text-lg flex items-center gap-2 mt-2"><FaChartBar className="text-blue-400" /> Industry Insights</h3>
                            <div className="ml-2 text-base text-zinc-700 dark:text-zinc-200">
                              {Object.entries(report.industry_insights || {}).map(([k, v]) => (
                                <div key={k}><span className="font-medium capitalize">{k.replace(/_/g, ' ')}:</span> {Array.isArray(v) ? v.join(", ") : v+""}</div>
                              ))}
                            </div>
                          </section>
                          <section>
                            <h3 className="font-semibold text-lg flex items-center gap-2 mt-2"><FaLightbulb className="text-pink-400" /> Personalized Recommendations</h3>
                            <div className="ml-2 text-base text-zinc-700 dark:text-zinc-200">
                              {Object.entries(report.recommendations || {}).map(([k, v]) => (
                                <div key={k}><span className="font-medium capitalize">{k.replace(/_/g, ' ')}:</span> {typeof v === 'object' ? JSON.stringify(v) : v+""}</div>
                              ))}
                            </div>
                          </section>
                        </>
                      )}
                    </div>
                  </GlassCard>
                )}
              </section>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
        {/* Help Modal */}
        {showHelp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="help-modal-title">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 max-w-lg w-full relative">
              <button className="absolute top-3 right-3 p-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-800" onClick={() => setShowHelp(false)} aria-label="Close Help"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
              <h2 id="help-modal-title" className="text-2xl font-bold mb-4 text-indigo-700 dark:text-indigo-200 flex items-center gap-2"><FaInfoCircle /> How to Use This Page</h2>
              <ol className="list-decimal ml-6 text-base text-zinc-700 dark:text-zinc-200 space-y-2">
                <li>Review your parsed CV details and make inline edits if needed.</li>
                <li>Switch to the "AI Recommendations" tab to see benchmarking, suggestions, and industry insights.</li>
                <li>Hover over info icons for more context on ambiguous fields.</li>
                <li>Download your improved, ATS-friendly CV using the download button.</li>
                <li>Use the floating help/pro tip for additional guidance.</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
// END OF FILE
