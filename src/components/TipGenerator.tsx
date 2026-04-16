import type { Tip } from '../data/tips';

interface TipGeneratorProps {
  tip: Tip | null;
  count: number;
}

const TipGenerator = ({ tip, count }: TipGeneratorProps) => {
  return (
    <section className="tip-panel">
      <h2>Tip result</h2>
      {count === 0 ? (
        <p>No tips are available for this category and range. Please choose a different filter.</p>
      ) : tip ? (
        <article>
          <h3>{tip.title}</h3>
          <p>{tip.description}</p>
          <div className="tip-meta">
            <span>Category: {tip.category}</span>
            <span>Value: {tip.value}</span>
          </div>
        </article>
      ) : (
        <p>Pick a category and range, then press Generate random tip.</p>
      )}
    </section>
  );
};

export default TipGenerator;
