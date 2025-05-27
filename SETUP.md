# Magic Surveys Setup Guide

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Anthropic API key

## Environment Variables

Create a `.env.local` file in the root directory with the following:

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### Getting an Anthropic API Key

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env.local` file

## Installation Steps

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (create `.env.local` file as described above)

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:3000`

## Features

- AI-powered survey creation using Claude 3.5 Sonnet
- Interactive chat interface for survey design
- Modern, responsive UI built with Tailwind CSS
- Real-time streaming responses from the AI

## Usage

1. Navigate to `/create` to start creating a survey
2. Describe your survey goals to the AI assistant
3. The AI will help you design effective questions and survey structure
4. Follow the conversation to refine your survey

## Troubleshooting

- **API Key Issues**: Make sure your `ANTHROPIC_API_KEY` is correctly set in `.env.local`
- **Port Conflicts**: If port 3000 is in use, Next.js will automatically use the next available port
- **Build Issues**: Try deleting `.next` folder and running `npm run dev` again

## Features to Test

1. Click "Start Creating Magic" from the homepage
2. Try asking: "I want to create a customer satisfaction survey"
3. The AI will guide you through designing effective survey questions
4. Ask for specific question types or best practices

Enjoy creating magical surveys! ✨ 