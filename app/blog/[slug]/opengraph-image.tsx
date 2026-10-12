import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getPost } from '@/lib/blog'

export const alt = 'Qrio blog'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/** Share image per post: the headline on the Qrio background. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  const font = await readFile(join(process.cwd(), 'assets/Fraunces-SemiBold.ttf'))
  const title = post?.title ?? 'Qrio'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#FAFAF7',
          color: '#141414',
          padding: 72,
          fontFamily: 'Fraunces',
        }}
      >
        <div style={{ fontSize: 44, letterSpacing: -1.5 }}>Qrio</div>
        <div style={{ fontSize: title.length > 70 ? 56 : 68, lineHeight: 1.12, letterSpacing: -1.5 }}>
          {title}
        </div>
        <div style={{ fontSize: 30, color: '#3B3BD6' }}>qrioapp.in/blog</div>
      </div>
    ),
    { ...size, fonts: [{ name: 'Fraunces', data: font, style: 'normal', weight: 600 }] },
  )
}
