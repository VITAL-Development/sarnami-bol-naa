import type { ContentBundle } from "@/domain/types";
import { greetingsVocab } from "./vocab/greetings";
import { pronounsVocab } from "./vocab/pronouns";
import { nounsVocab } from "./vocab/nouns";
import { grammarVocab } from "./vocab/grammar";
import { unit01Basics } from "./units/unit-01-basics";

export const contentBundle: ContentBundle = {
  units: [unit01Basics],
  vocab: [...greetingsVocab, ...pronounsVocab, ...nounsVocab, ...grammarVocab],
};
