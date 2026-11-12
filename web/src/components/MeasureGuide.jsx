export default function MeasureGuide() {
  return (
    <details className="measure-guide">
      <summary>How to measure yourself</summary>
      <div className="guide-body">
        <div className="guide-step">
          <strong>Bust</strong>
          <p>
            Measure around the fullest part of your bust, keeping the measuring
            tape level across your shoulder blades and parallel to the floor.
          </p>
        </div>
        <div className="guide-step">
          <strong>Waist</strong>
          <p>
            Measure around your natural waistline, the narrowest point of your
            torso (usually about 2 to 3 cm above your belly button).
          </p>
        </div>
        <div className="guide-step">
          <strong>Hips</strong>
          <p>
            Stand with your heels together and measure around the fullest part
            of your hips and rear.
          </p>
        </div>
      </div>
    </details>
  );
}

