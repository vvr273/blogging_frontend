import { useEffect, useRef } from "react";
import "./About.css";
import travel from "../pages/images/travel.jpg";
import interview from "../pages/images/interview.jpg";
import college from "../pages/images/vit.png";
import office from "../pages/images/office.jpg";
import coding from "../pages/images/coding.jpg";
import { useNavigate } from "react-router-dom";

export default function About() {
  const sectionRef = useRef(null);
  const navigate = useNavigate();
  const isLogin = !!localStorage.getItem("token");

  useEffect(() => {
    const revealTargets = sectionRef.current?.querySelectorAll(".reveal") || [];
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    revealTargets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const themes = [
    { img: travel, title: "Travel Experiences 🌍", desc: "Journeys that teach you life and different perspectives." },
    { img: interview, title: "Interview Experiences 👨‍💻", desc: "Main focus — help others crack interviews through detailed prep and insights." },
    { img: college, title: "College Life 🎓", desc: "Failures, memories, and crucial lessons on growth and discipline." },
    { 
        img: coding, 
        title: "Problem Solving & Debugging 🐛", 
        desc: "Deep dives into complex coding problems and the logical process of fixing bugs." 
    },
  ];

  return (
    <div className="about-container" ref={sectionRef}>
      {isLogin && (
        <button className="nav-link" onClick={() => navigate("/dashboard")} type="button">
          ← Home
        </button>
      )}

      <section className="about-hero reveal">
        <h1 className="hero-title">
          <span className="line-1">This is for me.</span>
          <span className="line-2">This is for you.</span>
          <span className="line-3">This is for all.</span>
        </h1>
        <p className="hero-subtitle">
          A collaborative space dedicated to sharing real-life experiences,
          practical technical solutions, and a mindset of continuous learning.
        </p>
      </section>

      <section className="about-themes">
        <h2 className="themes-heading reveal">Explore Our Categories 📚</h2>
        <div className="card-grid">
          {themes.map((item, i) => (
            <div
              key={i}
              className="theme-card reveal"
            >
              <div className="card-image-wrapper">
                <img src={item.img} alt={item.title} />
              </div>
              <div className="theme-card-content">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="office-experience reveal">
        <div className="office-image-wrap">
          <img src={office} alt="Office experience" />
        </div>
        <div className="office-content">
          <h2>Office Experience 🏢</h2>
          <p>
            Real growth starts when ideas meet execution. My office journey taught
            me how to collaborate in fast-paced teams, communicate clearly, and
            deliver reliable solutions under real deadlines.
          </p>
          <p>
            This space shares practical lessons from workplace projects, team
            culture, ownership, and continuous improvement so you can grow with
            confidence in your own career path.
          </p>
        </div>
      </section>

      <section className="about-mission reveal">
        <h2>Our Core Philosophy ✨</h2>
        <p>
          To let people learn from unfiltered real experiences. This platform
          details the entire journey, from college failures and life lessons to
          practical steps for problem-solving, debugging, and professional growth.
          Continuous learning is our foundation.
        </p>
        <p className="cta-message">
          Join the conversation and share your own growth story!
        </p>
      </section>
    </div>
  );
}
