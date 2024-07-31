export const metadata = {
  title: 'UW UpNext',
  description: 'Finding Events. Reimagined.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
