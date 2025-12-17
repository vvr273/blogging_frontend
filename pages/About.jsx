import { useEffect, useRef } from "react";
import "./About.css";
import travel from "../pages/images/travel.jpg";
import interview from "../pages/images/interview.jpg";
import college from "../pages/images/vit.png";
// You will need to add images for the new themes (e.g., 'coding.jpg', 'aws.png')
import coding from "../pages/images/coding.jpg"; // Placeholder for Coding/Debugging image
import { useNavigate } from "react-router-dom";
// import cloud from "../pages/images/aws.png"; // Placeholder for Cloud/Full-Stack image

export default function About() {
//   const token = localStorage.getItem("token");

    const isLogin =  true;
  const cardsRef = useRef([]);
  const navigate = useNavigate()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.2 }
    );

    // Observe all card elements
    cardsRef.current.filter(el => el).forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // RESTORED and EXPANDED Themes
  const themes = [
    // --- Original Themes ---
    { img: travel, title: "Travel Experiences 🌍", desc: "Journeys that teach you life and different perspectives." },
    { img: interview, title: "Interview Experiences 👨‍💻", desc: "Main focus — help others crack interviews through detailed prep and insights." },
    { img: college, title: "College Life 🎓", desc: "Failures, memories, and crucial lessons on growth and discipline." },
    
    // --- New Themes (Based on your strengths) ---
    { 
        img: coding, 
        title: "Problem Solving & Debugging 🐛", 
        desc: "Deep dives into complex coding problems and the logical process of fixing bugs." 
    },
    // { 
    //     img: cloud, 
    //     title: "Full-Stack & Cloud Insights ☁️", 
    //     desc: "Sharing practical experience with MERN, Flask, Node.js, and scaling apps on AWS." 
    // },
  ];

  return (
    <div className="about-container">

        {isLogin&& <span className="nav-link" onClick={() => navigate("/dashboard")}>
          ← Home
        </span>}

      {/* 1. Hero Section - Focus on the Core Motto */}
      <section className="about-hero">
        <h1 className="hero-title">
          <span className="line-1">This is for me.</span>
          <span className="line-2">This is for you.</span>
          <span className="line-3">This is for all.</span>
        </h1>
        <p className="hero-subtitle">
            A collaborative space dedicated to sharing real-life experiences, technical solutions, and continuous learning.
        </p>
      </section>

      {/* 2. Theme Cards - Using Grid for layout */}
      <section className="about-themes">
        <h2 className="themes-heading reveal">Explore Our Categories 📚</h2>
        <div className="card-grid">
          {themes.map((item, i) => (
            <div
              key={i}
              className="theme-card reveal"
              ref={el => cardsRef.current[i] = el}
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

      {/* 3. Mission & Philosophy - Cleaned up to be the closing thought */}
      <section className="about-mission reveal">
        <h2>Our Core Philosophy ✨</h2>
        <p>
          To let people learn from **unfiltered real experiences**. This platform details the entire journey—from the failures and memories of college life to the logical steps required for **problem-solving, debugging, and achieving certification (like AWS)**. Continuous learning is our foundation.
        </p>
        <p className="cta-message">
            Join the conversation and share your own growth story!
        </p>
      </section>

    </div>
  );
}