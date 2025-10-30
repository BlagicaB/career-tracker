import { GoalCard, Goal } from '../GoalCard'

const mockGoal: Goal = {
  id: "1",
  title: "Apply to 20 companies this month",
  description: "Target companies in the tech sector with strong engineering culture",
  category: "application",
  progress: 65,
  targetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  status: "in-progress",
};

export default function GoalCardExample() {
  return <GoalCard goal={mockGoal} />
}
