import Link from 'next/link';

export default function Home() {
  return (
    <main className="container">
      <div className="header">
        <h1 className="title">Schools Directory</h1>
        <div className="nav">
          <Link href="/addSchool">Add School</Link>
          <Link href="/showSchools">Show Schools</Link>
        </div>
      </div>
      <p className="subtitle">Mini-project using Next.js + MySQL. Use the navigation above.</p>
    </main>
  )
}
