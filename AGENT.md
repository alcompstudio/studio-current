# Agent Guidelines for AlcompStudio Project

## Build/Test Commands
- `npm run dev` - Start development server on port 3000
- `npm run build` - Build the project for production
- `npm run lint` - Run ESLint on the codebase
- `npm run typecheck` - Run TypeScript type checking
- `npm run check-docs` - Verify documentation checkpoints
- `npm run update-docs` - Update documentation files

## Code Style Guidelines
- **Imports**: Group by external/internal, alphabetize, use path aliases (@/)
- **Types**: Define interfaces for props at component top, use strict typing
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Components**: Use functional components with React.forwardRef pattern
- **UI**: Utilize the shared UI component library with consistent styling
- **CSS**: Use Tailwind with the cn utility for class merging
- **Error Handling**: Try/catch blocks with appropriate error logging
- **TypeScript**: Enable strict mode, use proper type declarations