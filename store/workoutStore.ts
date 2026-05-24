import { create } from "zustand";

interface WorkoutState {
  completedWorkouts: string[];
  completedWorkoutDates: string[];

  toggleWorkout: (workoutDay: string) => void;
  getCurrentStreak: () => number;
}

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);

  return nextDate;
}

function calculateCurrentStreak(dates: string[]) {
  const completedDays = new Set(dates);
  const today = new Date();
  const todayKey = getDateKey(today);
  const yesterdayKey = getDateKey(addDays(today, -1));

  if (!completedDays.has(todayKey) && !completedDays.has(yesterdayKey)) {
    return 0;
  }

  let cursor = completedDays.has(todayKey) ? today : addDays(today, -1);
  let streak = 0;

  while (completedDays.has(getDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  completedWorkouts: ["Day 1"],
  completedWorkoutDates: [
    getDateKey(new Date()),
    getDateKey(addDays(new Date(), -1)),
    getDateKey(addDays(new Date(), -2)),
  ],

  toggleWorkout: (workoutDay) => {
    const current = get().completedWorkouts;

    const exists = current.includes(workoutDay);

    if (exists) {
      set({
        completedWorkouts: current.filter(
          (item) => item !== workoutDay
        ),
      });

      return;
    }

    const today = getDateKey(new Date());
    const completedWorkoutDates = get().completedWorkoutDates;

    set({
      completedWorkouts: [...current, workoutDay],
      completedWorkoutDates: completedWorkoutDates.includes(today)
        ? completedWorkoutDates
        : [today, ...completedWorkoutDates],
    });
  },

  getCurrentStreak: () =>
    calculateCurrentStreak(get().completedWorkoutDates),
}));
