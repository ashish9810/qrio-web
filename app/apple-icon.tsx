import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Placeholder touch icon. TODO: replace with the final Qrio mark.
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default async function Icon() {
  const font = await readFile(join(process.cwd(), 'assets/Fraunces-SemiBold.ttf'))
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#3B3BD6',
          color: '#fff',
          fontSize: 120,
          fontFamily: 'Fraunces',
        }}
      >
        Q
      </div>
    ),
    { ...size, fonts: [{ name: 'Fraunces', data: font, weight: 600, style: 'normal' }] },
  )
}
