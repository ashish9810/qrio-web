import Image from 'next/image'
import { SAMPLE_VIDEOS } from '@/lib/content'

const iconProps = {
  width: 28,
  height: 28,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

function HeartIcon() {
  return (
    <svg {...iconProps} fill="currentColor" stroke="none">
      <path d="M12 21s-7.5-4.6-9.6-9.3C1 8.4 3 5 6.3 5c2 0 3.7 1.1 5.7 3.3C14 6.1 15.7 5 17.7 5 21 5 23 8.4 21.6 11.7 19.5 16.4 12 21 12 21z" />
    </svg>
  )
}
function BookmarkIcon() {
  return (
    <svg {...iconProps}>
      <path d="M6 3.500h12v17l-6-4.2-6 4.200z" />
    </svg>
  )
}
function ShareIcon() {
  return (
    <svg {...iconProps}>
      <path d="M21 3 10.5 13.500M21 3l-6.5 18-4-7.500L3 9.500z" />
    </svg>
  )
}
function SoundIcon() {
  return (
    <svg {...iconProps} width={16} height={16}>
      <path d="M4 9.500v5h3.500L12 18.500v-13L7.5 9.500zM16 9a4 4 0 0 1 0 6" />
    </svg>
  )
}

/** Renders "a *word* b" with the starred word highlighted, like auto-captions. */
function Caption({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*(.+?)\*/).map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="reel-caption-hl">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  )
}

/**
 * Phone mockup built from HTML and CSS. The frames, titles, creator handles and
 * counts are illustrative sample content, not real videos or people (the photos
 * are stock). The auto-scroll is pure CSS and stops under prefers-reduced-motion.
 */
export default function PhoneMockup() {
  const frames = SAMPLE_VIDEOS.slice(0, 3)

  return (
    <div className="phone" aria-hidden="true">
      <div className="phone-screen">
        <div className="phone-notch" />
        <div className="reel-track">
          {frames.map((video, index) => (
            <div key={video.title} className={`reel tone-${video.tone}`}>
              <Image
                src={video.image}
                alt=""
                fill
                sizes="270px"
                quality={60}
                fetchPriority={index === 0 ? 'auto' : 'low'}
                className="object-cover"
                style={{ objectPosition: video.focus }}
              />
              <div className="reel-shade" />

              <div className="reel-top">
                <span className="reel-tag">{video.topic}</span>
                <span className="reel-sound">
                  <SoundIcon />
                </span>
              </div>

              <p className="reel-caption">
                <Caption text={video.caption} />
              </p>

              <div className="reel-side">
                <div>
                  <HeartIcon />
                  <span>{video.likes}</span>
                </div>
                <div>
                  <BookmarkIcon />
                  <span>Save</span>
                </div>
                <div>
                  <ShareIcon />
                  <span>Share</span>
                </div>
              </div>

              <div className="reel-bottom">
                <div className="reel-creator">
                  <Image
                    src={video.avatar}
                    alt=""
                    width={30}
                    height={30}
                    className="reel-avatar"
                  />
                  <span className="reel-handle">{video.creator}</span>
                  <span className="reel-follow">Follow</span>
                </div>
                <h3 className="reel-title">{video.title}</h3>
              </div>

              <div className="reel-progress" style={{ ['--p' as string]: video.progress }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
