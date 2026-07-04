import type { ContentBundle } from "@/domain/types";
import { greetingsVocab } from "./vocab/greetings";
import { pronounsVocab } from "./vocab/pronouns";
import { nounsVocab } from "./vocab/nouns";
import { grammarVocab } from "./vocab/grammar";
import { adjectivesVocab } from "./vocab/adjectives";
import { unit01Basics } from "./units/unit-01-basics";
import { unit02Adjectives } from "./units/unit-02-adjectives";

export const contentBundle: ContentBundle = {
  units: [unit01Basics, unit02Adjectives],
  vocab: [...greetingsVocab, ...pronounsVocab, ...nounsVocab, ...grammarVocab, ...adjectivesVocab],
};
