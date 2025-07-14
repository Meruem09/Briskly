import { useState } from "react";
function QuizCard({ index, q }) {
  const [selected, setSelected] = useState('');
  const isCorrect = selected === q.answer;

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="font-semibold mb-2">Q{index + 1}. {q.question}</h2>
      <div className="space-y-2">
        {q.options.map((option, i) => (
          <label key={i} className="flex items-center space-x-2">
            <input
              type="radio"
              name={`q-${index}`}
              value={option}
              onChange={() => setSelected(option)}
              disabled={!!selected} // optional: lock after selection
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      {selected && (
        <p className={`mt-3 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
          {isCorrect ? '✅ Correct!' : `❌ Incorrect. Correct Answer: ${q.answer}`}
        </p>
      )}
    </div>
  );
}

export default QuizCard
