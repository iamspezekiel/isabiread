/**
 * @fileOverview Inserts pauses into text based on sentence structure to improve audio clarity.
 *
 * - insertDynamicPauses - A function that inserts pauses into the text.
 * - InsertDynamicPausesInput - The input type for the insertDynamicPauses function.
 * - InsertDynamicPausesOutput - The return type for the insertDynamicPauses function.
 */

import {ai, textModel} from '@/ai/genkit';
import {z} from 'genkit';

const InsertDynamicPausesInputSchema = z.object({
  text: z.string().describe('The text to insert pauses into.'),
});
export type InsertDynamicPausesInput = z.infer<
  typeof InsertDynamicPausesInputSchema
>;

const InsertDynamicPausesOutputSchema = z.object({
  modifiedText: z.string().describe('The text with pauses inserted.'),
});
export type InsertDynamicPausesOutput = z.infer<
  typeof InsertDynamicPausesOutputSchema
>;

export async function insertDynamicPauses(
  input: InsertDynamicPausesInput
): Promise<InsertDynamicPausesOutput> {
  return insertDynamicPausesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'insertDynamicPausesPrompt',
  model: textModel,
  input: {schema: InsertDynamicPausesInputSchema},
  output: {schema: InsertDynamicPausesOutputSchema},
  prompt: `You are an AI assistant that improves the clarity of text by inserting pauses at appropriate places. 

  Insert pauses in the text where it makes sense to improve the listening experience during text-to-speech conversion. Consider sentence structure and punctuation.
  Do not insert pauses at the end of the string.
  You must return valid text.
  
  Text: {{{text}}}`,
});

const insertDynamicPausesFlow = ai.defineFlow(
  {
    name: 'insertDynamicPausesFlow',
    inputSchema: InsertDynamicPausesInputSchema,
    outputSchema: InsertDynamicPausesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
