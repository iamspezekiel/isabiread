# **App Name**: IsabiRead

## Core Features:

- PDF Upload: Allows users to upload PDF files via a drag-and-drop interface or a file selection dialog.
- File Size Validation: Checks if the uploaded PDF is within the size limit (2MB for non-logged-in users, higher limit for logged-in users).
- TTS Conversion: Converts the text from the uploaded PDF into high-quality audio using an AI TTS service.
- Audio Player: Provides an in-browser audio player to stream the converted MP3 file, with standard controls (play, pause, volume, seek).
- User Authentication: Integrates with Firebase Authentication for user signup/login to enable larger file uploads and access to personal dashboard.
- User Dashboard: Allows logged-in users to view and manage their uploaded PDFs and generated audio files, along with streaming and download options.
- Dynamic Pause Insertion: Use AI to decide if long sentences can be split on punctuation and the resultant audio rendered with pauses. A tool that improves clarity and enjoyment for the user.

## Style Guidelines:

- Primary color: Muted teal (`#3F51B5`) evokes tranquility and focus, like the experience of being read to.
- Background color: Off-white (#F2F4F3) for a clean, distraction-free reading and listening environment.
- Accent color: Light khaki (`#03A9F4`) provides subtle visual interest and highlights key interactive elements.
- Body font: 'Inter' (sans-serif) for a clean, readable interface. Headline font: 'Space Grotesk' (sans-serif) for a modern, slightly techy feel, matching the app's AI features
- Use a consistent set of simple, outline-style icons from a library like Phosphor or Remix Icon, in the accent color. Ensure icons are intuitive and clearly represent their actions.
- Mobile-first design with a focus on clear, hierarchical information architecture. Use Tailwind's grid and flexbox utilities to create a responsive layout that adapts to various screen sizes. Maximize readability with generous whitespace and consistent padding.
- Use subtle, tasteful animations for transitions and feedback, such as the progress bar during file upload and audio conversion, providing a smooth and engaging user experience.