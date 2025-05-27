import { tool } from 'ai'
import { z } from 'zod'

export const surveyGenerationTools = () => {
  return {
    triggerSurveyGeneration: tool({
      description: 'Trigger the survey generation button to appear when all requirements have been gathered from the user',
      parameters: z.object({
        message: z.string().describe('A message to display to the user explaining that requirements are complete and they can proceed'),
        requirements: z.array(z.string()).describe('List of requirements that have been gathered'),
      }),
      execute: async ({ message, requirements }) => {
        // This is a client-side tool that will be handled by the frontend
        return {
          action: 'show_survey_generation_button',
          message,
          requirements,
          timestamp: new Date().toISOString()
        }
      },
    }),
  }
} 