export type Exercise = {
  name: string;
  sets: string;
  reps: string;
  rest: string;
};

export type WorkoutDay = {
  day: string;
  title: string;
  exercises: Exercise[];
};

export function getWorkoutExercises(goal: string): WorkoutDay[] {
  if (goal === "Lose Fat") {
    return [
      {
        day: "Day 1",
        title: "Full Body Strength",
        exercises: [
          { name: "Bodyweight Squat", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Push Ups", sets: "3", reps: "8–12", rest: "60 sec" },
          { name: "Dumbbell Row", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Plank", sets: "3", reps: "30 sec", rest: "45 sec" },
        ],
      },
      {
        day: "Day 2",
        title: "Conditioning",
        exercises: [
          { name: "Walking", sets: "1", reps: "30 min", rest: "-" },
          { name: "Lunges", sets: "3", reps: "10 each leg", rest: "60 sec" },
          { name: "Mountain Climbers", sets: "3", reps: "30 sec", rest: "45 sec" },
          { name: "Glute Bridge", sets: "3", reps: "15", rest: "45 sec" },
        ],
      },
      {
        day: "Day 3",
        title: "Full Body Burn",
        exercises: [
          { name: "Goblet Squat", sets: "3", reps: "12", rest: "60 sec" },
          { name: "Incline Push Ups", sets: "3", reps: "10–12", rest: "60 sec" },
          { name: "Romanian Deadlift", sets: "3", reps: "12", rest: "75 sec" },
          { name: "Dead Bug", sets: "3", reps: "10 each side", rest: "45 sec" },
        ],
      },
    ];
  }

  if (goal === "Build Muscle") {
    return [
      {
        day: "Day 1",
        title: "Push",
        exercises: [
          { name: "Bench Press", sets: "4", reps: "6–8", rest: "120 sec" },
          { name: "Overhead Press", sets: "3", reps: "8–10", rest: "90 sec" },
          { name: "Incline Dumbbell Press", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Triceps Pushdown", sets: "3", reps: "12", rest: "60 sec" },
        ],
      },
      {
        day: "Day 2",
        title: "Pull",
        exercises: [
          { name: "Pull Ups", sets: "4", reps: "6–10", rest: "120 sec" },
          { name: "Barbell Row", sets: "4", reps: "8", rest: "120 sec" },
          { name: "Lat Pulldown", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Biceps Curl", sets: "3", reps: "12", rest: "60 sec" },
        ],
      },
      {
        day: "Day 3",
        title: "Legs",
        exercises: [
          { name: "Squat", sets: "4", reps: "6–8", rest: "120 sec" },
          { name: "Romanian Deadlift", sets: "4", reps: "8", rest: "120 sec" },
          { name: "Leg Press", sets: "3", reps: "10", rest: "90 sec" },
          { name: "Calf Raises", sets: "4", reps: "15", rest: "60 sec" },
        ],
      },
    ];
  }

  return [
    {
      day: "Day 1",
      title: "Upper Body",
      exercises: [
        { name: "Push Ups", sets: "3", reps: "10–15", rest: "60 sec" },
        { name: "Dumbbell Row", sets: "3", reps: "12", rest: "60 sec" },
        { name: "Shoulder Press", sets: "3", reps: "10", rest: "75 sec" },
        { name: "Plank", sets: "3", reps: "30 sec", rest: "45 sec" },
      ],
    },
    {
      day: "Day 2",
      title: "Lower Body",
      exercises: [
        { name: "Squat", sets: "3", reps: "12", rest: "60 sec" },
        { name: "Lunges", sets: "3", reps: "10 each leg", rest: "60 sec" },
        { name: "Glute Bridge", sets: "3", reps: "15", rest: "45 sec" },
        { name: "Walking", sets: "1", reps: "25 min", rest: "-" },
      ],
    },
  ];
}