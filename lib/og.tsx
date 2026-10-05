import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { SEO } from './content'

export const OG_SIZE = { width: 1200, height: 630 }

/** 1200x630 share image: Qrio wordmark and tagline on the page background. */
export async function renderOgImage() {
  const font = await readFile(join(process.cwd(), 'assets/Fraunces-SemiBold.ttf'))

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FAFAF7',
          color: '#141414',
          fontFamily: 'Fraunces',
        }}
      >
        <div style={{ fontSize: 168, letterSpacing: -6, lineHeight: 1 }}>Qrio</div>
        <div style={{ marginTop: 28, fontSize: 44, color: '#3B3BD6' }}>
          Short videos that make you smarter every day
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [{ name: 'Fraunces', data: font, style: 'normal', weight: 600 }],
    },
  )
}

export const OG_ALT = SEO.ogAlt
