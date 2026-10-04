import { SAMPLE_VIDEOS } from '@/lib/content'

/**
 * Phone mockup built from HTML and CSS only. The three frames, titles and
 * creator handles are illustrative sample content, not real videos or people.
 * The auto-scroll is pure CSS and switches off under prefers-reduced-motion.
 */
export default function PhoneMockup() {
  const frames = SAMPLE_VIDEOS.slice(0, 3)

  return (
    <div className="phone" aria-hidden="true">
      <div className="phone-screen">
        <div className="phone-notch" />
        <div className="reel-track">
          {frames.map((video) => (
            <div key={video.title} className={`reel tone-${video.tone}`}>
              <div className="reel-tag">{video.topic}</div>
              <h3 className="reel-title">{video.title}</h3>
              <div className="reel-creator">
                <div className="reel-avatar" />
                {video.creator}
                <span className="reel-follow">Follow</span>
              </div>
              <div className="reel-side">
                <div>Like</div>
                <div>Save</div>
                <div>Share</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
