import { GoogleGenAI, Type } from "@google/genai";

class StoryApp {
  private ai: GoogleGenAI;
  private appContainer: HTMLDivElement;
  private fullscreenOverlay: HTMLDivElement;
  private topicInput: HTMLTextAreaElement;
  private langSelect: HTMLSelectElement;
  private ageSelect: HTMLSelectElement;
  private generateBtn: HTMLButtonElement;
  private storyFrame: HTMLIFrameElement;
  private loader: HTMLDivElement;
  private controls: HTMLDivElement;
  private narrateBtn: HTMLButtonElement;
  private replayBtn: HTMLButtonElement;
  private downloadBtn: HTMLButtonElement;
  private backBtn: HTMLButtonElement;
  private themeSwitcher: HTMLButtonElement;
  private typingTextElement: HTMLSpanElement;
  private uploadHtmlInput: HTMLInputElement;


  constructor() {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    this.appContainer = document.getElementById('app') as HTMLDivElement;
    this.fullscreenOverlay = document.getElementById('fullscreen-overlay') as HTMLDivElement;
    this.topicInput = document.getElementById('topic-input') as HTMLTextAreaElement;
    this.langSelect = document.getElementById('lang-select') as HTMLSelectElement;
    this.ageSelect = document.getElementById('age-select') as HTMLSelectElement;
    this.generateBtn = document.getElementById('generate-btn') as HTMLButtonElement;
    this.storyFrame = document.getElementById('story-frame') as HTMLIFrameElement;
    this.loader = document.getElementById('loader') as HTMLDivElement;
    this.controls = document.getElementById('controls') as HTMLDivElement;
    this.narrateBtn = document.getElementById('narrate-btn') as HTMLButtonElement;
    this.replayBtn = document.getElementById('replay-btn') as HTMLButtonElement;
    this.downloadBtn = document.getElementById('download-btn') as HTMLButtonElement;
    this.backBtn = document.getElementById('back-btn') as HTMLButtonElement;
    this.themeSwitcher = document.getElementById('theme-switcher') as HTMLButtonElement;
    this.typingTextElement = document.getElementById('typing-text') as HTMLSpanElement;
    this.uploadHtmlInput = document.getElementById('upload-html') as HTMLInputElement;

    this.init();
  }

  private init(): void {
    this.generateBtn.addEventListener('click', () => this.generateStoryAndAnimation());
    this.narrateBtn.addEventListener('click', () => this.postMessageToFrame({ action: 'narrate' }));
    this.replayBtn.addEventListener('click', () => this.postMessageToFrame({ action: 'replay' }));
    this.downloadBtn.addEventListener('click', () => this.downloadGeneratedHTML());
    this.backBtn.addEventListener('click', () => this.hideStoryView());
    this.themeSwitcher.addEventListener('click', () => this.toggleTheme());
    this.uploadHtmlInput.addEventListener('change', (e) => this.uploadHTML(e));

    this.loadTheme();
    this.initTypingEffect();
    this.storyFrame.src = 'about:blank';
  }

  private initTypingEffect(): void {
    const textToType = `Expanding kids imagination, thinking and questioning-abilities.`;
    let i = 0;
    if(!this.typingTextElement) return;
    this.typingTextElement.textContent = ""; // Clear it first
    const typingInterval = setInterval(() => {
        if (i < textToType.length) {
            this.typingTextElement.textContent = textToType.substring(0, i + 1);
            i++;
        } else {
            clearInterval(typingInterval);
        }
    }, 100);
  }
  
  private loadTheme(): void {
    const theme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark-neon', theme === 'dark-neon');
    this.themeSwitcher.textContent = theme === 'dark-neon' ? '☀️' : '🌙';
  }

  private toggleTheme(): void {
    const isDark = document.body.classList.toggle('dark-neon');
    localStorage.setItem('theme', isDark ? 'dark-neon' : 'light');
    this.themeSwitcher.textContent = isDark ? '☀️' : '🌙';
  }

  private uploadHTML(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const htmlContent = e.target?.result as string;
        const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(htmlBlob);
        this.storyFrame.src = url;
        this.showStoryView();
      } catch (error) {
        console.error('Error uploading HTML:', error);
        alert('Invalid HTML file');
      }
    };
    reader.readAsText(file);
  }
  
  private showStoryView(): void {
    this.appContainer.classList.add('hidden');
    this.fullscreenOverlay.classList.remove('hidden');
  }

  private hideStoryView(): void {
    this.fullscreenOverlay.classList.add('hidden');
    this.appContainer.classList.remove('hidden');
    this.storyFrame.src = 'about:blank'; // Stop execution
  }

  private postMessageToFrame(message: object): void {
    if (this.storyFrame.contentWindow) {
      this.storyFrame.contentWindow.postMessage(message, '*');
    }
  }

  private downloadGeneratedHTML(): void {
    const htmlContent = this.storyFrame.contentDocument?.documentElement.outerHTML;
    if (htmlContent) {
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated-story.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      alert('No HTML content available to download.');
    }
  }
  
  private async generateStoryAndAnimation(): Promise<void> {
    this.showStoryView();
    
    this.loader.classList.remove('hidden');
    this.storyFrame.classList.add('hidden');
    this.controls.classList.add('hidden');
    this.generateBtn.disabled = true;

    const topic = this.topicInput.value;
    const lang = this.langSelect.options[this.langSelect.selectedIndex].text;
    const age = this.ageSelect.value;

    const prompt = `
First, act as a world-class creative director for a children's animation studio. Your task is to write an enchanting story based on the creative brief below.

Part 1: The Creative Brief

Topic: ${topic}

Language: ${lang}

Target Audience: A child in the ${age} age group

Tone & Style: Magical, whimsical, and heartwarming. It should feel like a story from a modern animated movie or a premium bedtime story app.

Characters: [Introduce your main character (e.g., "Sunny, a tiny glowing sunbeam who loves to explore"). Add supporting characters (e.g., "Nimbus, a friendly fluffy cloud who loves telling weather secrets"). Names should be age-appropriate, cute, and imaginative.]

Narrative: [Begin with a curiosity or question your main character has. Then describe their joyful discovery journey. For example: “Sunny wonders why flowers only bloom in the morning. With Nimbus's help, Sunny learns about sunlight, photosynthesis, and the role of the sun in nature — all through fun, colorful adventures.”]

Length: The story should be at least 150 words for expressive and immersive storytelling in ${lang}.

---

Part 2: The Technical & Artistic Specs (🚫 DO NOT EDIT THIS PART)

Now, acting as a senior full-stack developer specializing in creative coding, bring this story to life in a single HTML file using HTML, CSS, and p5.js.

🎨 Visual Style: Bright, pastel, and lively — perfect for young children.

🌈 Palette: Use soft, joyful, candy-like colors on a light background (no black/dark themes). It should feel like a spring morning or a picture book.

🧒 Characters: Big-eyed, bouncy, expressive cartoon characters with fun reactions. They should smile, jump, sparkle, and explore — matching the narration.

🌼 Environment: A dreamy cartoon world with simple animated elements: fluttering leaves, sparkles, floating clouds, etc.

🖼 Format: 2D cartoon illustration (NO 3D). Use smooth motion and expressive effects.

🎤 Podcast Narration:

Use the browser’s SpeechSynthesis API.

Alternate between narrator and character voices with playful tones. Use predefined pitch.

Clicking the Podcast button resets and narrates the full story with synced animation reactions.

Clicking Replay just resets the animation (no sound).

📡 External Control:

Use the 'postMessag' API for external control. The HTML must not include any visible buttons but should listen for these actions:

'''js
{ action: 'narrate' }            // Start narration with synced animation
{ action: 'replay' }             // Replay animation only
{ action: 'downloadThumbnail' }  // Save canvas as image

Responce Example: <!-- HTML + CSS + JS starts below --> 
<!DOCTYPE html>
<!-- 🎨 Full HTML, CSS, and p5.js cartoon animation goes here -->
</html>
`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              htmlCode: {
                type: Type.STRING,
                description: "The complete, self-contained HTML code for the p5.js animation, following all technical and artistic specs."
              }
            }
          }
        }
      });
      
      const jsonResponse = JSON.parse(response.text);
      if (jsonResponse.htmlCode) {
        const htmlBlob = new Blob([jsonResponse.htmlCode], { type: 'text/html' });
        const url = URL.createObjectURL(htmlBlob);
        this.storyFrame.src = url;
        
        this.loader.classList.add('hidden');
        this.storyFrame.classList.remove('hidden');
        this.controls.classList.remove('hidden');

      } else {
          throw new Error("Invalid response structure from API.");
      }

    } catch (error) {
      console.error("Error generating story:", error);
      alert(`Sorry, we couldn't create the story. Please try again. Error: ${error.message}`);
      this.hideStoryView();
    } finally {
      this.generateBtn.disabled = false;
    }
  }
}

// Initialize the app
new StoryApp();