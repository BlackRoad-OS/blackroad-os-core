'use client';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-bold">
              <span className="text-gradient">applier</span>
              <span className="text-white">-pro</span>
            </a>
            <div className="flex gap-4">
              <a href="/" className="text-gray-300 hover:text-white transition">Home</a>
              <a href="/dashboard" className="text-gray-300 hover:text-white transition">Dashboard</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-applier-orange/10 via-transparent to-applier-pink/10" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              ALEXA LOUISE AMUNDSON
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Lakeville, MN • <a href="mailto:blackroad@gmail.com" className="text-gradient hover:underline">blackroad@gmail.com</a> • (507) 828-0842
            </p>
            <div className="flex gap-4 justify-center text-gray-300">
              <a href="https://linkedin.com/in/alexaamundson" target="_blank" rel="noopener noreferrer" className="hover:text-applier-pink transition">
                LinkedIn →
              </a>
              <a href="https://github.com/blackboxprogramming" target="_blank" rel="noopener noreferrer" className="hover:text-applier-pink transition">
                GitHub →
              </a>
            </div>
          </div>

          {/* Professional Summary */}
          <section className="mb-12 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-lg border border-gray-700">
            <h2 className="text-3xl font-bold text-gradient mb-4">Professional Summary</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              AI Orchestration Founder directing the development of a production-grade enterprise operating system with cognitive AI at its core.
              Rare hybrid of <span className="text-applier-orange font-semibold">Deep AI Architecture (466K+ LOC orchestrated)</span> +
              <span className="text-applier-pink font-semibold"> Enterprise Sales Execution ($26.8M closed)</span> +
              <span className="text-applier-purple font-semibold"> FINRA Series 7/63/65</span>.
              Expert at bridging the gap between complex cognitive systems and aggressive revenue growth in regulated environments.
            </p>
          </section>

          {/* Platform Metrics */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gradient mb-6">Platform Metrics (Verified Audit 2025)</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Code Scale</h3>
                <ul className="space-y-2 text-gray-300">
                  <li><span className="text-applier-orange font-bold">466,408</span> Lines of Code</li>
                  <li><span className="text-applier-orange font-bold">28,538</span> Files</li>
                  <li><span className="text-applier-orange font-bold">297</span> Modules</li>
                  <li><span className="text-applier-orange font-bold">5,937</span> Commits</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Architecture</h3>
                <ul className="space-y-2 text-gray-300">
                  <li><span className="text-applier-pink font-bold">23</span> Microservices</li>
                  <li><span className="text-applier-pink font-bold">22</span> Apps</li>
                  <li><span className="text-applier-pink font-bold">79</span> API Route Domains</li>
                  <li><span className="text-applier-pink font-bold">2,119</span> Endpoints</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">AI/Automation</h3>
                <ul className="space-y-2 text-gray-300">
                  <li><span className="text-applier-purple font-bold">145</span> Autonomous Agents & Bots</li>
                  <li><span className="text-applier-purple font-bold">437</span> CI/CD Workflows</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Cloud/Infrastructure</h3>
                <ul className="space-y-2 text-gray-300">
                  <li><span className="text-applier-blue font-bold">89</span> Terraform Modules</li>
                  <li><span className="text-applier-blue font-bold">17</span> Production K8s Configs</li>
                  <li><span className="text-applier-blue font-bold">89</span> Docker Containers</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Experience */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gradient mb-6">Experience</h2>

            <div className="space-y-8">
              {/* BlackRoad OS */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-lg border border-gray-700">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">BLACKROAD OS, INC. / Prism Console</h3>
                    <p className="text-xl text-applier-orange">Founder & Chief Architect</p>
                  </div>
                  <div className="text-gray-400 mt-2 md:mt-0 md:text-right">
                    <p>Remote</p>
                    <p>May 2025 – Present</p>
                  </div>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li><span className="text-applier-pink font-bold">AI/ML & Cognitive Orchestration (45 Modules):</span> Built the Lucidia AI Engine, a multi-modal stack managing 76 autonomous agents and 69 enterprise bots for GitHub automation, Athena orchestration, and domain-specific reasoning.</li>
                  <li><span className="text-applier-pink font-bold">Enterprise API Routes (79 Domains):</span> Engineered 2,119 endpoints covering Finance (Treasury/RevRec), CRM (CPQ/Partner Portal), HR (WFM/LMS), and IT Ops (CMDB).</li>
                  <li><span className="text-applier-pink font-bold">Infrastructure-as-Code (40 Modules):</span> Managed 89 Terraform modules and 17 production Kubernetes configurations; built a 369-workflow CI/CD pipeline with self-healing remediation.</li>
                  <li><span className="text-applier-pink font-bold">Data & Compliance Infrastructure (20 Modules):</span> Developed 5 high-throughput connectors (Snowflake, GitHub, Linear) and a Go-based SOX compliance rule engine with full audit provenance via PS-SHA∞.</li>
                  <li><span className="text-applier-pink font-bold">Hardware & Edge AI (15 Modules):</span> Orchestrated a Raspberry Pi/Jetson fleet for edge inference and holographic scene control via MQTT and the Pi-Cortex stack.</li>
                  <li><span className="text-applier-pink font-bold">Quantum & Research (20 Modules):</span> Integrated Qiskit and TorchQuantum on IBM hardware for circuit simulation; built a distributed Collatz conjecture verifier and a C-based linear math library.</li>
                </ul>
              </div>

              {/* Securian */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-lg border border-gray-700">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">SECURIAN FINANCIAL</h3>
                    <p className="text-xl text-applier-orange">Internal Annuity Wholesaler / Senior Sales Analyst</p>
                  </div>
                  <div className="text-gray-400 mt-2 md:mt-0 md:text-right">
                    <p>St. Paul, MN</p>
                    <p>Jul 2024 – Jun 2025</p>
                  </div>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li><span className="text-applier-pink font-bold">KPIs:</span> Sold $26.8M in annuities in 11 months (92% of goal; +38% territory growth).</li>
                  <li><span className="text-applier-pink font-bold">Strategy:</span> Selected as presenter for LPL conference for Securian's 24,000 advisor network; delivered keynotes at the 2024 Winter Sales Conference on Salesforce automation and KPI optimization.</li>
                  <li><span className="text-applier-pink font-bold">Automation:</span> Led Salesforce click-to-dial and record-cleanup efforts → eliminated 3,000 CRM errors to 0.</li>
                  <li><span className="text-applier-pink font-bold">Financial Engineering:</span> Built Excel rate calculator integrating bond yields, inflation, and S&P 500 forecasts for bi-weekly pricing adjustments.</li>
                </ul>
              </div>

              {/* Ameriprise */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-lg border border-gray-700">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">AMERIPRISE FINANCIAL</h3>
                    <p className="text-xl text-applier-orange">Financial Advisor / Advisor in Training</p>
                  </div>
                  <div className="text-gray-400 mt-2 md:mt-0 md:text-right">
                    <p>Minneapolis, MN</p>
                    <p>Aug 2023 – May 2024</p>
                  </div>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li><span className="text-applier-pink font-bold">Growth:</span> Identified $14M pipeline gap → 400% GDC growth potential; reduced at-risk assets by 50%.</li>
                  <li><span className="text-applier-pink font-bold">Thought Leadership:</span> Earned Sales Training Thought-Leadership Award for automating call-note workflows, saving 1–2 minutes per call.</li>
                  <li><span className="text-applier-pink font-bold">Execution:</span> Completed 2,400+ calls with a 10% appointment conversion rate; ranked #1 on training team.</li>
                </ul>
              </div>

              {/* EXP Realty */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-lg border border-gray-700">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">EXP REALTY</h3>
                    <p className="text-xl text-applier-orange">Real Estate Agent (Pemberton Homes Team)</p>
                  </div>
                  <div className="text-gray-400 mt-2 md:mt-0 md:text-right">
                    <p>Remote</p>
                    <p>Aug 2022 – Aug 2023</p>
                  </div>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li>Negotiated competitive offers using escalation clauses and appraisal contingencies; maintained a 10% conversion rate on 1,000+ cold calls.</li>
                </ul>
              </div>

              {/* Enterprise Holdings */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-lg border border-gray-700">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">ENTERPRISE HOLDINGS</h3>
                    <p className="text-xl text-applier-orange">Customer Experience Representative</p>
                  </div>
                  <div className="text-gray-400 mt-2 md:mt-0 md:text-right">
                    <p>Bloomington, MN</p>
                    <p>Jun 2019 – Aug 2019</p>
                  </div>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li>Achieved 63% upsell conversion rate; three-time monthly sales award recipient.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Leadership & Awards */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gradient mb-6">Leadership & Awards</h2>
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-lg border border-gray-700">
              <ul className="grid md:grid-cols-2 gap-4 text-gray-300">
                <li className="flex items-start">
                  <span className="text-applier-pink mr-2">•</span>
                  National Speech & Debate Finalist / MN State Finalist
                </li>
                <li className="flex items-start">
                  <span className="text-applier-pink mr-2">•</span>
                  3× Enterprise Top Sales Award
                </li>
                <li className="flex items-start">
                  <span className="text-applier-pink mr-2">•</span>
                  Presenter — 2025 LPL Due Diligence & Winter Sales Conferences
                </li>
                <li className="flex items-start">
                  <span className="text-applier-pink mr-2">•</span>
                  Ameriprise Sales Training Thought-Leadership Award
                </li>
              </ul>
            </div>
          </section>

          {/* Education & Licenses */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gradient mb-6">Education & Licenses</h2>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-2">University of Minnesota – Twin Cities</h3>
                <p className="text-gray-300">B.A., Strategic Communication (Advertising & Public Relations)</p>
              </div>
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-2">Licenses</h3>
                <div className="flex flex-wrap gap-3">
                  {['SIE', 'Series 7', 'Series 66 (63/65)', 'Life & Health Insurance', 'Real Estate License (inactive)'].map(license => (
                    <span key={license} className="px-4 py-2 bg-gradient-to-r from-applier-orange to-applier-pink text-white rounded-full text-sm font-semibold">
                      {license}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Download Resume */}
          <div className="text-center">
            <button
              onClick={() => window.print()}
              className="px-8 py-4 bg-gradient-to-r from-applier-orange to-applier-pink text-white font-bold rounded-lg hover:shadow-lg hover:shadow-applier-pink/50 transition-all"
            >
              📄 Download Resume (PDF)
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p className="text-sm">
              Built with <span className="text-gradient">Claude Code</span> • Part of the <span className="text-gradient">BlackRoad OS</span> ecosystem
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
