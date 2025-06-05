"use client";
import React, { useEffect, useState } from "react";
import { useCVStore } from "@/store/useCVStore";
import { analyzeCVRAG } from "@/utils/api";
import GlassCard from "@/components/GlassCard";
import { motion } from "framer-motion";
import { FaChartBar, FaUserTie, FaLightbulb, FaUsers, FaCheckCircle, FaStar, FaGraduationCap, FaBriefcase, FaProjectDiagram, FaLink } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function AnalysisPage() {
  const { data } = useCVStore();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!data) {
      setError("No CV data found. Please upload your CV first.");
      return;
    }
    setLoading(true);
    analyzeCVRAG(data)
      .then(setReport)
      .catch((err) => setError(err.message || "Analysis failed"))
      .finally(() => setLoading(false));
  }, [data]);

  function flattenSkills(skills: any) {
    if (!skills) return [];
    const soft = Array.isArray(skills.softSkills) ? skills.softSkills.map((s: any) => s.skill) : [];
    const tech = Array.isArray(skills.technicalSkills) ? skills.technicalSkills.map((s: any) => s.skill) : [];
    return [...soft, ...tech].filter(Boolean);
  }

  function flattenAddress(address: any) {
    if (!address) return '';
    let out = '';
    if (address.present) out += `Present: ${address.present}`;
    if (address.permanent && typeof address.permanent === 'object') {
      const p = address.permanent;
      out += (out ? ' | ' : '') + `Permanent: ${[p.village, p.postOffice, p.policeStation, p.district].filter(Boolean).join(', ')}`;
    }
    return out;
  }

  function flattenLinks(links: any) {
    if (!links) return [];
    // If value is an object, flatten its keys/values
    return Object.entries(links).flatMap(([k, v]) => {
      if (typeof v === 'object' && v !== null) {
        // If v is an array, flatten each
        if (Array.isArray(v)) {
          return v.map((item, idx) => ({ label: `${k} ${idx+1}`, value: typeof item === 'object' ? JSON.stringify(item) : String(item) }));
        } else {
          // v is an object
          return { label: k, value: JSON.stringify(v) };
        }
      } else {
        return { label: k, value: String(v) };
      }
    });
  }

  function flattenEducation(education: any) {
    if (!Array.isArray(education)) return [];
    return education.map((edu: any) => {
      const main = [edu.type, edu.field, edu.department, edu.university, edu.institution, edu.city].filter(Boolean).join(' | ');
      const years = edu.duration ? ` (${edu.duration})` : '';
      const gpa = edu.gpa ? `, GPA: ${edu.gpa}` : '';
      return { label: main, value: `${years}${gpa}` };
    });
  }

  function flattenExperience(experience: any) {
    if (!Array.isArray(experience)) return [];
    return experience.map((exp: any) => {
      const main = [exp.title, exp.organization, exp.location].filter(Boolean).join(' | ');
      const duration = exp.duration ? ` (${exp.duration})` : '';
      let details = '';
      if (Array.isArray(exp.responsibilities)) {
        details = exp.responsibilities.map((r: any) => `${r.task}${r.description ? ': ' + r.description : ''}`).join('\n');
      }
      return { label: main + duration, value: details };
    });
  }

  function flattenPersonal(personal: any) {
    if (!personal) return [];
    return Object.entries(personal).map(([k, v]) => ({ label: k.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()), value: v }));
  }

  function ParsedCVSection({ parsed }: { parsed: any }) {
    const sections = [
      { key: "personal", label: "Personal Info", icon: <FaUserTie />, fields: [
        { label: "Name", value: parsed?.name },
        { label: "Email", value: parsed?.email },
        { label: "Phone", value: parsed?.phone || parsed?.phoneNumber },
        { label: "Address", value: flattenAddress(parsed?.address) },
        { label: "Summary", value: parsed?.summary },
        ...flattenPersonal(parsed?.personalDetails)
      ].filter(f => f.value) },
      { key: "skills", label: "Skills", icon: <FaStar />, fields: [
        { label: "Skills", value: Array.isArray(parsed?.skills) ? parsed.skills.map((s: any) => s.skill || s).join(", ") : flattenSkills(parsed?.skills).join(", ") },
      ].filter(f => f.value) },
      { key: "education", label: "Education", icon: <FaGraduationCap />, fields: flattenEducation(parsed?.education) },
      { key: "experience", label: "Experience", icon: <FaBriefcase />, fields: flattenExperience(parsed?.experience) },
      { key: "links", label: "Links", icon: <FaLink />, fields: flattenLinks(parsed?.links) },
    ];
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
                  <GlassCard key={i} className="w-full animate-fade-in-up">
                    <div className="text-xs font-semibold text-indigo-500 uppercase mb-1 tracking-wide">{field.label}</div>
                    <div className="text-base text-gray-900 dark:text-gray-100 font-medium break-words whitespace-pre-line">{typeof field.value === 'object' ? JSON.stringify(field.value) : field.value}</div>
                  </GlassCard>
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

  function tryParseRaw(parsed: any) {
    // If parsed is an object with only a 'raw' key, try to extract JSON from it
    if (parsed && typeof parsed === 'object' && Object.keys(parsed).length === 1 && parsed.raw) {
      let raw = parsed.raw;
      // Try to extract JSON from code block or curly braces
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
    return parsed;
  }

  // Only use data.parsed_data, never fallback to data directly
  let parsed = (data && typeof data === 'object' && 'parsed_data' in data) ? data.parsed_data : null;
  parsed = tryParseRaw(parsed);

  // Full window layout
  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-indigo-50/90 via-white/95 to-blue-50/90 dark:from-gray-900/95 dark:via-gray-950/98 dark:to-indigo-950/95 flex flex-col items-center justify-start py-0 px-0">
      <div className="w-full dashboard-container flex flex-col gap-12 py-12">
        {/* 1. Structured Parsed Data Section */}
        <section className="w-full">
          <h2 className="text-3xl font-bold mb-6 text-indigo-700 dark:text-indigo-200 flex items-center gap-2">
            <FaUserTie className="text-2xl text-indigo-400" /> Parsed CV Data
          </h2>
          {/* Hide debug by default, but keep for troubleshooting */}
          {/* {debug} */}
          <div className="bg-white/90 dark:bg-zinc-900/90 rounded-2xl shadow-lg border border-indigo-100 dark:border-indigo-900 p-6">
            {parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0 ? (
              <ParsedCVSection parsed={parsed} />
            ) : (
              <div className="text-gray-400 text-center py-8">No data available.</div>
            )}
          </div>
        </section>
        {/* 2. AI + RAG Analysis Section */}
        <section className="w-full">
          <h2 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-200 flex items-center gap-2">
            <FaChartBar className="text-2xl text-blue-400" /> AI & RAG Analysis
          </h2>
          <GlassCard className="w-full p-0">
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 p-8">
              {loading || !report ? (
                <div className="text-lg font-semibold text-blue-600 flex items-center justify-center gap-2"><FaChartBar /> Analyzing your CV...</div>
              ) : error ? (
                <div className="text-red-600 font-semibold mb-4">{error}</div>
              ) : (
                <>
                  <section>
                    <h3 className="font-semibold text-lg flex items-center gap-2"><FaUserTie className="text-blue-400" /> Your Profile</h3>
                    <div className="text-zinc-700 dark:text-zinc-200 text-base ml-2">
                      <div>Name: {report.user_profile?.name}</div>
                      <div>Industry: {report.user_profile?.industry}</div>
                      <div>Experience Level: {report.user_profile?.experience_level}</div>
                      <div>Skills Count: {report.user_profile?.skills_count}</div>
                      <div>Match Score: <span className="font-bold text-blue-600 dark:text-blue-300">{report.match_score}%</span></div>
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
                      {(report.improvement_suggestions || []).map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </section>
                  <section>
                    <h3 className="font-semibold text-lg flex items-center gap-2 mt-2"><FaUsers className="text-purple-400" /> Similar Professionals</h3>
                    <ul className="ml-2 text-base text-zinc-700 dark:text-zinc-200">
                      {(report.similar_professionals || []).map((p: any, i: number) => (
                        <li key={i} className="mb-1">
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
        </section>
        <div className="flex justify-end mt-6 gap-4">
          <button
            className="px-5 py-2 rounded-lg bg-green-500 text-white font-semibold shadow hover:bg-green-600 transition"
            onClick={() => router.push("/portfolio")}
          >Make Portfolio</button>
          <button
            className="px-5 py-2 rounded-lg bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition"
            onClick={() => router.push("/")}
          >Back to Upload</button>
        </div>
      </div>
    </main>
  );
}
