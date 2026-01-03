import './globals.css'

export const metadata = {
  title: 'Reconstruction Tax Calculator | Yavardi',
  description: 'Calculate the hidden tax your firm pays monthly for missing digital proof of authority',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
