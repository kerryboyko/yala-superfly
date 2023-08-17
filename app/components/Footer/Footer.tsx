import { Link } from "@remix-run/react";

export const Footer = () => (
  <div className="footer">
    <div className="col-1">
      <div className="link">
        <Link to="/privacy-policy">Privacy Policy</Link>
      </div>
      <div className="link">
        <Link to="/terms-of-service">Terms of Service</Link>
      </div>
      <div className="link">
        <Link to="/about">About Page</Link>
      </div>
      <div className="link">
        <Link to="/roadmap">Our Roadmap</Link>
      </div>
    </div>
    <div className="col-2">
      {/* <div className="link">
        <Link to="/api-docs">Public API Documentation</Link>
      </div> */}
      {/* <div className="link">
        <Link to="/media-guides">Media Guides</Link>
      </div> */}
      {/* <div className="link">
        <Link to="/credits">Credits</Link>
      </div> */}
      <div className="link">
        <Link to="https://github.com/kerryboyko/yala-superfly">
          Source Code @ Github
        </Link>
      </div>
    </div>
    <div className="col-2">
      <div className="donate-to-yala">
        (Coming Soon): Donate To YALA Project
      </div>
    </div>
  </div>
);

export default Footer;
