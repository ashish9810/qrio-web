import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'
import { getStory } from '@/lib/archive'

export const alt = 'Qrio story'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Share image per story, 1200x630: the cover photo under a dark gradient with
 * the headline. Covers are 800px wide, below the 1200px Google Discover wants,
 * so this is the large image search engines and link previews get.
 */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const story = getStory(slug)
  const font = await readFile(join(process.cwd(), 'assets/Fraunces-SemiBold.ttf'))
  const title = story?.title ?? 'Qrio'

  // Satori cannot read webp, so the cover is converted to jpeg first.
  let cover: string | null = null
  if (story?.cover) {
    try {
      const jpeg = await sharp(join(process.cwd(), 'public', story.cover))
        .resize(size.width, size.height, { fit: 'cover' })
        .jpeg({ quality: 80 })
        .toBuffer()
      cover = `data:image/jpeg;base64,${jpeg.toString('base64')}`
    } catch {
      cover = null
    }
  }

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: '#141428' }}>
        {cover && (
          <img src={cover} alt="" width={size.width} height={size.height} style={{ position: 'absolute', top: 0, left: 0, width: size.width, height: size.height, objectFit: 'cover' }} />
        )}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: size.width,
            height: size.height,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 64,
            color: '#FFFFFF',
            fontFamily: 'Fraunces',
            backgroundImage: 'linear-gradient(180deg, rgba(10,10,30,0.6) 0%, rgba(10,10,30,0.4) 45%, rgba(10,10,30,0.88) 100%)',
          }}
        >
          <div style={{ fontSize: 44, letterSpacing: -1.5 }}>Qrio</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', maxWidth: 1060, fontSize: title.length > 80 ? 50 : 60, lineHeight: 1.12, letterSpacing: -1.5 }}>{title}</div>
            {story && <div style={{ display: 'flex', marginTop: 22, fontSize: 28, color: '#F0A030' }}>{`${story.category.label} · qrioapp.in`}</div>}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: 'Fraunces', data: font, style: 'normal', weight: 600 }] },
  )
}
