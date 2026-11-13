export default function RootPage(): React.JSX.Element {
  return (
    <main style={{ fontFamily: 'system-ui', padding: '2rem' }}>
      <h1>ReportSaathi API</h1>
      <p>This service exposes the ReportSaathi backend API.</p>
      <ul>
        <li>
          <a href="/api/health">GET /api/health</a>
        </li>
      </ul>
    </main>
  );
}
