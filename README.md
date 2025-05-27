# Magic Surveys ✨

A delightful survey creation tool powered by AI that helps you design engaging surveys that people actually want to fill out.

## Features

- 🎨 Beautiful, modern UI design
- 🤖 AI-powered survey creation assistant
- 💬 Interactive chat interface for survey design
- 📝 Expert guidance on survey best practices
- 🎯 Tailored question suggestions based on your goals

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Anthropic API key

### Environment Setup

1. Create a `.env.local` file in the root directory:

```bash
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

To get an Anthropic API key:
1. Visit [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env.local` file

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables (see Environment Setup above)

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Visit the homepage and describe what you want to discover
2. Click "Start Creating Magic" to open the chat interface
3. Tell the AI assistant about your survey goals, target audience, and objectives
4. Get personalized recommendations for:
   - Question types and wording
   - Survey structure and flow
   - Best practices for your specific use case
   - Sample questions tailored to your needs

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **AI**: Anthropic Claude 3.5 Sonnet via Vercel AI SDK
- **Language**: TypeScript
- **UI**: React 19

## Project Structure

```
magic-surveys/
├── src/
│   ├── app/
│   │   ├── api/chat/          # Chat API endpoint
│   │   ├── create/            # Survey creation page
│   │   └── page.tsx           # Homepage
│   └── ...
├── public/                    # Static assets
└── ...
```

## Environment Variables

- `ANTHROPIC_API_KEY` - Your Anthropic API key (required)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
