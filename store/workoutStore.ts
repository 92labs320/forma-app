import { create } from "zustand";

interface WorkoutState {
  completedWorkouts: string[];

  toggleWorkout: (workoutDay: string) => void;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  completedWorkouts: [],

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

    set({
      completedWorkouts: [...current, workoutDay],
    });
  },
}));