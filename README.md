# Outside of Egg 3.0

**Outside of Egg** is an imaginative web application that crafts unique, AI-generated stories for children. Designed to spark curiosity and learning, it transforms simple user prompts into engaging, animated narratives tailored to specific age groups and languages.

## ✨ Features

*   **AI-Powered Story Generation:** Leverages advanced AI to create personalized stories from user-provided topics.
*   **Age-Appropriate Content:** Stories are adapted for different developmental stages:
    *   Under 5 years
    *   5-7 years
    *   8-10 years
*   **Multilingual Support:** Offers stories in a variety of languages including English, Bengali (বাংলা), Hindi (हिंदी), and Spanish (Español).
*   **Immersive Animated Presentation:** Stories are displayed as animated narratives within an interactive iframe.
*   **Interactive Controls:** Fullscreen viewing with options to narrate, replay animations, and download story thumbnails.
*   **Dual Theme Support:** Switch between a bright, cheerful Light theme and a sleek, modern Dark Neon theme to suit preferences.
*   **Responsive Design:** A fluid and adaptive interface that provides an optimal experience across all devices, from mobile phones to desktops.
*   **Modern UI/UX:** Features a clean, glassmorphic design with intuitive controls and smooth transitions.

## 🚀 Technologies Used

*   **Frontend:**
    *   HTML5: Semantic structure and content.
    *   CSS3: Styling, theming, animations, responsive layout (including glassmorphism and media queries).
    *   JavaScript (ES Modules): For interactivity, dynamic content loading, theme management, and UI control.
*   **AI Backend Integration:** `@google/genai` library, accessed via esm.sh for client-side integration.
*   **Video Hosting:** Cloudinary for hosting the background video asset.

## 💡 How to Use

1.  **Enter Your Topic:** In the "What should the story be about?" text area, describe the theme or subject for the story (e.g., "A brave little kitten who wants to fly").
2.  **Select Age Group:** Choose the appropriate age range for the intended audience from the dropdown menu.
3.  **Choose Language:** Select your preferred language for the story.
4.  **Generate Story:** Click the prominent "✨ Generate Story" button.
5.  **Experience the Animation:** The application will display a loading animation while the story is generated. Once ready, the animated story will appear in fullscreen.
    *   Use the **sidebar controls** to navigate back, listen to the narration, replay the animation, or download a thumbnail.
6.  **Switch Themes:** Click the 🌙/☀️ icon in the top-right corner to toggle between the Light and Dark Neon visual themes.

## 🛠️ Local Development Setup

To run this project locally, you'll need a local web server that can serve ES Modules correctly.

1.  **Clone the Repository:**
    ```bash
    git clone <your-repository-url>
    cd your-project-directory
    ```
2.  **Serve the Application:**
    Navigate to the root of your project directory in your terminal. You can use tools like Node.js's `http-server` or Vite.

    *   **Using `http-server` (install globally if needed: `npm install -g http-server`):**
        ```bash
        http-server . -c-1 --cors -p 8080
        ```
    *   **Using Vite (install globally if needed: `npm install -g vite`):**
        ```bash
        vite
        ```
3.  **Open in Browser:**
    Open your web browser and go to `http://localhost:8080` (or the port specified by your server).

## 📝 Project Structure

```
outside-of-egg-3.0
   README.md
   index.css
   index.html
   index.tsx
   metadata.json
   package.json
   tsconfig.json
   vite.config.ts
```



**How to use this README:**

1.  Save the content above into a file named `README.md` in the root directory of your project.
2.  Replace `<your-repository-url>` with the actual URL if you host this project on platforms like GitHub, GitLab, etc.
3.  If you have a `LICENSE.md` file (which is recommended), make sure it's in the root and contains the MIT License text.
4.  If your project has specific dependencies that require `npm install` or `yarn install`, add those commands to the "Local Development Setup" section.
