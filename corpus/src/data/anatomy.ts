/**
 * Mock anatomy content — 6 body systems with lessons,
 * quiz questions and interactive atlas objects.
 */

export interface Lesson {
  id: string;
  title: string;
  description: string;
  xp: number;
  minutes: number;
}

export interface BodySystem {
  id: string;
  name: string;
  latin: string;
  icon: string; // lucide icon name
  color: string;
  image: string;
  completed: number;
  total: number;
  lessons: Lesson[];
}

export interface AtlasObject {
  id: string;
  name: string;
  latin: string;
  image: string;
  description: string;
  function: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  image?: string;
  /** % position of the green highlight on the image */
  highlight?: { x: number; y: number };
  options: string[];
  answer: number;
  explanation: string;
}

export const SYSTEMS: BodySystem[] = [
  {
    id: "skeletal",
    name: "Skeletal System",
    latin: "Systema skeletale",
    icon: "bone",
    color: "#6C5CE7",
    image: "/img/skeleton.jpg",
    completed: 12,
    total: 24,
    lessons: [
      { id: "sk-1", title: "Introduction to Bones", description: "Bone types and classification", xp: 20, minutes: 6 },
      { id: "sk-2", title: "The Skull", description: "Cranial and facial bones", xp: 25, minutes: 8 },
      { id: "sk-3", title: "Vertebral Column", description: "Cervical, thoracic and lumbar", xp: 25, minutes: 9 },
      { id: "sk-4", title: "Rib Cage & Sternum", description: "Protection of the thorax", xp: 20, minutes: 7 },
    ],
  },
  {
    id: "muscular",
    name: "Muscular System",
    latin: "Systema musculare",
    icon: "activity",
    color: "#FD79A8",
    image: "/img/muscles.jpg",
    completed: 8,
    total: 24,
    lessons: [
      { id: "mu-1", title: "Muscle Types", description: "Skeletal, cardiac and smooth", xp: 20, minutes: 6 },
      { id: "mu-2", title: "Major Muscle Groups", description: "From deltoids to quadriceps", xp: 25, minutes: 8 },
      { id: "mu-3", title: "How Muscles Contract", description: "Sliding filament theory", xp: 25, minutes: 9 },
    ],
  },
  {
    id: "digestive",
    name: "Digestive System",
    latin: "Systema digestorium",
    icon: "apple",
    color: "#F59E0B",
    image: "/img/stomach.jpg",
    completed: 6,
    total: 24,
    lessons: [
      { id: "di-1", title: "The Digestive Tract", description: "Mouth to large intestine", xp: 20, minutes: 7 },
      { id: "di-2", title: "Stomach & Liver", description: "Chemical digestion", xp: 25, minutes: 8 },
      { id: "di-3", title: "Absorption", description: "Nutrients into the blood", xp: 25, minutes: 8 },
    ],
  },
  {
    id: "respiratory",
    name: "Respiratory System",
    latin: "Systema respiratorium",
    icon: "wind",
    color: "#00B894",
    image: "/img/lungs.jpg",
    completed: 5,
    total: 24,
    lessons: [
      { id: "re-1", title: "Airways", description: "Trachea, bronchi and lungs", xp: 20, minutes: 6 },
      { id: "re-2", title: "Gas Exchange", description: "Alveoli and oxygenation", xp: 25, minutes: 8 },
    ],
  },
  {
    id: "nervous",
    name: "Nervous System",
    latin: "Systema nervosum",
    icon: "brain",
    color: "#A29BFE",
    image: "/img/brain.jpg",
    completed: 7,
    total: 24,
    lessons: [
      { id: "ne-1", title: "The Brain", description: "Cerebrum, cerebellum, stem", xp: 25, minutes: 9 },
      { id: "ne-2", title: "Neurons & Synapses", description: "How signals travel", xp: 25, minutes: 9 },
    ],
  },
  {
    id: "circulatory",
    name: "Circulatory System",
    latin: "Systema circulatorium",
    icon: "heart",
    color: "#EF4444",
    image: "/img/heart.jpg",
    completed: 4,
    total: 24,
    lessons: [
      { id: "ci-1", title: "The Heart", description: "Chambers and valves", xp: 25, minutes: 9 },
      { id: "ci-2", title: "Blood Vessels", description: "Arteries, veins, capillaries", xp: 20, minutes: 7 },
    ],
  },
];

export const ATLAS_OBJECTS: AtlasObject[] = [
  {
    id: "heart",
    name: "Heart",
    latin: "Cor",
    image: "/img/heart.jpg",
    description:
      "A muscular organ that pumps blood throughout the body, beating roughly 70–75 times per minute.",
    function: "Circulation of blood",
  },
  {
    id: "brain",
    name: "Brain",
    latin: "Encephalon",
    image: "/img/brain.jpg",
    description:
      "The control centre of the nervous system — responsible for thought, memory and coordination.",
    function: "Information processing",
  },
  {
    id: "lungs",
    name: "Lungs",
    latin: "Pulmo",
    image: "/img/lungs.jpg",
    description:
      "Paired respiratory organs where oxygen enters the blood and carbon dioxide is expelled.",
    function: "Gas exchange",
  },
  {
    id: "stomach",
    name: "Stomach",
    latin: "Gaster",
    image: "/img/stomach.jpg",
    description:
      "A dilated part of the digestive tract that breaks food down mechanically and chemically.",
    function: "Digestion",
  },
  {
    id: "kidney",
    name: "Kidney",
    latin: "Ren",
    image: "/img/kidney.svg",
    description:
      "Bean-shaped organs that filter blood and produce urine, keeping water–salt balance.",
    function: "Filtration",
  },
  {
    id: "skeleton",
    name: "Skeleton",
    latin: "Skeleton",
    image: "/img/skeleton.jpg",
    description:
      "The body's framework of 206 bones that supports structure and protects vital organs.",
    function: "Support & protection",
  },
];

export const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "Which bone is highlighted in the image?",
    image: "/img/ribs.jpg",
    highlight: { x: 50, y: 42 },
    options: ["Sternum", "Clavicle", "Scapula", "Humerus"],
    answer: 0,
    explanation: "The sternum (breastbone) sits at the centre of the chest and anchors the ribs.",
  },
  {
    id: "q2",
    prompt: "Which bone forms the thigh?",
    image: "/img/femur.jpg",
    options: ["Tibia", "Fibula", "Femur", "Patella"],
    answer: 2,
    explanation: "The femur is the longest and strongest bone in the human body.",
  },
  {
    id: "q3",
    prompt: "Which organ pumps blood around the body?",
    image: "/img/heart.jpg",
    options: ["Lungs", "Liver", "Brain", "Heart"],
    answer: 3,
    explanation: "The heart beats ~70–75 times per minute to circulate blood.",
  },
  {
    id: "q4",
    prompt: "Gas exchange with the blood happens in the…",
    image: "/img/lungs.jpg",
    options: ["Trachea", "Alveoli", "Bronchi", "Larynx"],
    answer: 1,
    explanation: "Alveoli are tiny air sacs where oxygen and CO₂ are exchanged.",
  },
  {
    id: "q5",
    prompt: "Which part of the brain controls balance and coordination?",
    image: "/img/brain.jpg",
    options: ["Cerebrum", "Cerebellum", "Brainstem", "Thalamus"],
    answer: 1,
    explanation: "The cerebellum fine-tunes movement, balance and posture.",
  },
  {
    id: "q6",
    prompt: "The skull is made up of which two regions?",
    image: "/img/skull.jpg",
    options: ["Cranium & face", "Cranium & neck", "Face & jaw", "Calvaria & spine"],
    answer: 0,
    explanation: "The skull divides into the cranial vault and the facial skeleton.",
  },
];
