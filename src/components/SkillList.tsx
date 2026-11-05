export function SkillList({ skills }: { skills: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Skills">
      {skills.map((s) => (
        <li
          key={s}
          className="rounded-md bg-accent-soft px-2 py-0.5 font-mono text-xs text-accent"
        >
          {s}
        </li>
      ))}
    </ul>
  );
}
