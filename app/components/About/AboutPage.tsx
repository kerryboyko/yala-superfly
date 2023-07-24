import AboutMarkdown from "~/static/markdown/about.md";

export const AboutPage = () => (
  <div className="about">
    <div className="about__text">
      <div className="markdown-display">
        <AboutMarkdown />
      </div>
    </div>
  </div>
);

export default AboutPage;
