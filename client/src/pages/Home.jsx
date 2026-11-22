import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="home">
      <div className="home-copy">
        <p className="eyebrow"><span /> Personal photo archive</p>
        <h1>Every memory<br />has a <em>place.</em></h1>
        <p className="home-lead">A quiet place to collect the moments you never want to lose and discover stories shared by others.</p>
        <Link className="primary-link" to="/gallery"><span>Open the collection</span><b>↗</b></Link>
      </div>
      <div className="home-art" aria-label="Photo collection preview">
        <div className="art-card art-card-main">
          <div className="art-photo art-photo-one" />
          <span>01 / STORIES</span>
        </div>
        <div className="art-card art-card-small">
          <div className="art-photo art-photo-two" />
          <span>NEW MEMORY</span>
        </div>
        <div className="art-stamp">A · Z</div>
      </div>
    </section>
  );
}
