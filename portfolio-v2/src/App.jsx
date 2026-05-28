import {
  ArrowRight,
  BriefcaseBusiness,
  Code2,
  Download,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Menu,
  Newspaper,
  Server,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  certifications,
  education,
  experience,
  profile,
  projects,
  publications,
  skillGroups,
} from "./portfolioData";

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;
const resumeHref = asset("resume/Vikram_Sharma_Python_Backend_Engineer.pdf");
const defaultProjectImage = "images/Projects/headlines.png";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const featuredProjects = projects.filter((project) => project.featured);
  const libraryProjects = projects.filter((project) => !project.featured);

  const filters = useMemo(() => {
    const tags = projects.flatMap((project) => project.tags);
    return ["All", ...Array.from(new Set(tags)).slice(0, 9)];
  }, []);

  const shownProjects = libraryProjects.filter(
    (project) => activeFilter === "All" || project.tags.includes(activeFilter)
  );

  return (
    <div className="app-shell">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main>
        <section className="hero section-dark" id="home">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Python Backend Engineer</p>
              <h1>
                Building reliable APIs, AWS serverless systems, and production-ready backend services.
              </h1>
              <p className="hero-summary">{profile.summary}</p>

              <div className="hero-actions" aria-label="Primary actions">
                <a className="button button-primary" href="#projects">
                  View work <ArrowRight size={18} aria-hidden="true" />
                </a>
                <a className="button button-secondary" href={resumeHref} download>
                  Resume <Download size={18} aria-hidden="true" />
                </a>
              </div>

              <dl className="impact-strip" aria-label="Profile highlights">
                <div>
                  <dt>2.5+ yrs</dt>
                  <dd>Software engineering</dd>
                </div>
                <div>
                  <dt>10+</dt>
                  <dd>Lambda refactors</dd>
                </div>
                <div>
                  <dt>20+</dt>
                  <dd>Security fixes</dd>
                </div>
              </dl>
            </div>

            <div className="hero-panel" aria-label="Portfolio focus">
              <div className="portrait-frame">
                <img src={asset("images/Dp.png")} alt="Vikram Sharma" />
              </div>
              <div className="focus-list">
                {profile.focus.map((item) => (
                  <span key={item}>
                    <ShieldCheck size={16} aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section section-tight" id="experience">
          <SectionHeading
            icon={<BriefcaseBusiness size={20} />}
            kicker="Experience"
            title="Backend work in production environments"
            text="Resume-led experience focused on service reliability, API delivery, cloud systems, and maintainable engineering."
          />
          <div className="timeline">
            {experience.map((item) => (
              <article className="timeline-item" key={`${item.company}-${item.title}`}>
                <div className="timeline-logo">
                  <img src={asset(item.image)} alt={`${item.company} logo`} loading="lazy" />
                </div>
                <div>
                  <div className="timeline-head">
                    <div>
                      <h3>{item.title}</h3>
                      <p>
                        {item.company} - {item.location}
                      </p>
                    </div>
                    <span>{item.dates}</span>
                  </div>
                  <ul>
                    {item.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section skill-band" id="skills">
          <SectionHeading
            icon={<Server size={20} />}
            kicker="Technical Stack"
            title="Backend-first skill set with cloud and testing depth"
            text="Grouped around the way engineering leads review practical production readiness."
          />
          <div className="skill-grid">
            {skillGroups.map((group) => (
              <article className="skill-card" key={group.title}>
                <h3>{group.title}</h3>
                <div>
                  {group.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="projects">
          <SectionHeading
            icon={<Code2 size={20} />}
            kicker="Projects"
            title="Selected engineering work, with the full project history kept intact"
            text="The first row is intentionally stronger for backend and engineering review; the rest stays available for context."
          />

          <div className="featured-grid">
            {featuredProjects
              .map((project) => (
                <ProjectCard key={project.title} project={project} featured />
              ))}
          </div>

          <div className="project-tools" aria-label="Project filters">
            {filters.map((filter) => (
              <button
                className={filter === activeFilter ? "filter active" : "filter"}
                key={filter}
                onClick={() => setActiveFilter(filter)}
                type="button"
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="project-grid">
            {shownProjects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </section>

        <section className="section section-split" id="research">
          <div>
            <SectionHeading
              icon={<Newspaper size={20} />}
              kicker="Publications"
              title="Research background that supports the engineering story"
              text="Machine learning and recommendation research from 2023-2024."
            />
          </div>
          <div className="publication-list">
            {publications.map((publication) => (
              <a
                className="publication-item"
                href={publication.href}
                key={publication.title}
                rel="noreferrer"
                target="_blank"
              >
                <img src={asset(publication.image)} alt={`${publication.venue} logo`} loading="lazy" />
                <span>
                  <strong>{publication.title}</strong>
                  <small>
                    {publication.venue} - {publication.date}
                  </small>
                </span>
                <ExternalLink size={18} aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>

        <section className="section proof-section" id="credentials">
          <div className="proof-panel">
            <div>
              <p className="eyebrow">Education</p>
              <h2>{education.degree}</h2>
              <p>
                {education.school} - {education.dates}
              </p>
              <strong>{education.detail}</strong>
            </div>
          </div>

          <div className="cert-panel">
            <div className="cert-head">
              <Sparkles size={20} aria-hidden="true" />
              <h2>Certifications and presentations</h2>
            </div>
            <div className="cert-list">
              {certifications.map((certification) => (
                <span key={certification}>{certification}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-section section-dark" id="contact">
          <div className="contact-inner">
            <p className="eyebrow">Contact</p>
            <h2>Backend engineering, API reliability, and cloud systems are the lane.</h2>
            <p>
              Reach out for Python backend roles, AWS serverless work, or engineering conversations around
              production systems.
            </p>
            <div className="contact-actions">
              <a className="button button-primary" href={`mailto:${profile.email}`}>
                Email <Mail size={18} aria-hidden="true" />
              </a>
              <a className="button button-secondary" href={profile.socials.linkedin} rel="noreferrer" target="_blank">
                LinkedIn <Linkedin size={18} aria-hidden="true" />
              </a>
              <a className="button button-secondary" href={profile.socials.github} rel="noreferrer" target="_blank">
                GitHub <Github size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Header({ menuOpen, setMenuOpen }) {
  const navItems = [
    ["Experience", "#experience"],
    ["Skills", "#skills"],
    ["Projects", "#projects"],
    ["Research", "#research"],
    ["Contact", "#contact"],
  ];

  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label="Vikram Sharma home">
        <span>VS</span>
        <strong>Vikram Sharma</strong>
      </a>

      <nav className={menuOpen ? "nav open" : "nav"} aria-label="Primary navigation">
        {navItems.map(([label, href]) => (
          <a href={href} key={label} onClick={() => setMenuOpen(false)}>
            {label}
          </a>
        ))}
      </nav>

      <button
        className="menu-button"
        type="button"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setMenuOpen((current) => !current)}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
    </header>
  );
}

function SectionHeading({ icon, kicker, title, text }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">
        {icon}
        {kicker}
      </p>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function ProjectCard({ project, featured = false }) {
  const projectImage = project.image || defaultProjectImage;

  return (
    <article className={featured ? "project-card featured" : "project-card"}>
      <div className="project-image">
        <img src={asset(projectImage)} alt={`${project.title} preview`} loading="lazy" />
      </div>
      <div className="project-body">
        <p className="project-subtitle">{project.subtitle}</p>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <strong>{project.impact}</strong>
        <div className="tag-row">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="link-row">
          {project.links.map((link) => (
            <a href={link.href} key={link.href} rel="noreferrer" target="_blank">
              {link.label}
              <ExternalLink size={15} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

export default App;
