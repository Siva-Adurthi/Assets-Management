import { ArrowRight, BarChart3, Box, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";

export default function Home() {
  return (
    <div className="landing">
      <PublicHeader />

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">ENGINEERING COLLEGE • SMART CAMPUS</div>
          <h1>Department Asset <span>Management Portal</span></h1>
          <p>
            Track, manage and view departmental assets easily and efficiently.
            A simple and smart solution for engineering college departments.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-orange btn-lg">Get Started <ArrowRight size={18}/></Link>
            <a href="#features" className="btn btn-outline btn-lg">Learn More</a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="campus-card">
            <div className="campus-sky"/>
            <div className="campus-building">ENGINEERING<br/>COLLEGE</div>
            <div className="asset-desk">
              <div className="mini-laptop">Asset<span>Portal</span></div>
              <div className="asset-stack">LAPTOPS<br/>PROJECTORS<br/>LAB EQUIPMENT<br/>FURNITURE</div>
              <div className="mini-printer">▰</div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="feature-grid">
        <Feature icon={Box} title="Easy Tracking" text="Track all department assets in one place"/>
        <Feature icon={ShieldCheck} title="Secure & Reliable" text="Safe data with authentication"/>
        <Feature icon={Users} title="Department Wise" text="Manage assets by department"/>
        <Feature icon={BarChart3} title="Smart Reports" text="View asset utilization and reports"/>
      </section>

      <section id="about" className="landing-about">
        <div>
          <span className="eyebrow">ABOUT THE PROJECT</span>
          <h2>One place for your department assets.</h2>
        </div>
        <p>
          AssetPortal digitizes the basic asset workflow: faculty can view and
          search assets while administrators manage assets and department allocation.
        </p>
      </section>
    </div>
  );
}

function Feature({ icon: Icon, title, text }) {
  return (
    <div className="feature-card">
      <div className="feature-icon"><Icon size={22}/></div>
      <div><h3>{title}</h3><p>{text}</p></div>
      <ArrowRight size={18}/>
    </div>
  );
}
