export default function BackgroundBlobs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div
        className="blob animate-blob"
        style={{
          width: '600px',
          height: '600px',
          background: '#5277ff',
          top: '-200px',
          left: '-100px',
          animationDelay: '0s',
        }}
      />
      <div
        className="blob animate-blob"
        style={{
          width: '500px',
          height: '500px',
          background: '#008cff',
          top: '30%',
          right: '-150px',
          animationDelay: '3s',
          opacity: 0.08,
        }}
      />
      <div
        className="blob animate-blob"
        style={{
          width: '400px',
          height: '400px',
          background: '#0080FF',
          bottom: '10%',
          left: '20%',
          animationDelay: '6s',
          opacity: 0.1,
        }}
      />
      <div
        className="blob"
        style={{
          width: '300px',
          height: '300px',
          background: '#0084ff',
          top: '60%',
          right: '30%',
          opacity: 0.05,
        }}
      />
    </div>
  );
}
