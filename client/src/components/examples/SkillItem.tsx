import { SkillItem, Skill } from '../SkillItem'

const mockSkill: Skill = {
  id: "1",
  name: "React",
  category: "Frontend",
  proficiency: 85,
};

export default function SkillItemExample() {
  return <SkillItem skill={mockSkill} />
}
