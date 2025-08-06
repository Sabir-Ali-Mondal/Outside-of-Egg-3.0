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

    this.init();
  }

  private init(): void {
    this.generateBtn.addEventListener('click', () => this.generateStoryAndAnimation());
    this.narrateBtn.addEventListener('click', () => this.postMessageToFrame({ action: 'narrate' }));
    this.replayBtn.addEventListener('click', () => this.postMessageToFrame({ action: 'replay' }));
    this.downloadBtn.addEventListener('click', () => this.postMessageToFrame({ action: 'downloadThumbnail' }));
    this.backBtn.addEventListener('click', () => this.hideStoryView());
    this.themeSwitcher.addEventListener('click', () => this.toggleTheme());

    this.loadTheme();
    this.initTypingEffect();
    this.storyFrame.src = 'about:blank';
  }

  private initTypingEffect(): void {
    const textToType = `Expanding kids imagination, thinking and questioning-abilities.`;
    let i = 0;
    if(!this.typingTextElement) return;
    this.typingTextElement.innerHTML = ""; // Clear it first
    const typingInterval = setInterval(() => {
        if (i < textToType.length) {
            this.typingTextElement.textContent += textToType.charAt(i);
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
      You are a creative coder and a children's storyteller. Your task is to generate a heartwarming story and a corresponding p5.js animation inside a single HTML file.

      **Creative Brief:**
      - **Topic:** ${topic}
      - **Language:** ${lang}
      - **Target Audience:** A child in the ${age} age group.
      - **Tone & Style:** Magical, whimsical, and heartwarming.
      - **Characters:** Create a main character (e.g., 'Tuni, a curious little drop of water') and a supporting character (e.g., 'Megh Mama, a big, wise cloud'). Give them simple, cute names appropriate for the language.
      - **Narrative:** The story should be a joyful discovery journey about the topic, around 150 words.

      **Technical & Artistic Specs for the HTML file:**
      - **Structure:** A single, self-contained HTML file. Include p5.js from "https://cdn.jsdelivr.net/npm/p5@1.9.0/lib/p5.js".
      - **Visuals:** A 2D cartoon illustration with a bright, pastel, candy-like color palette on a light background. Characters should be big-eyed, bouncy, and expressive.
      - **Animation:** The animation must visually represent the story. Key moments should trigger simple animations.
      - **Narration:** Use the browser's SpeechSynthesis API to narrate the full story text. Sync the animation to the narration. Get voices using \`speechSynthesis.getVoices()\` and select one appropriate for the language code (e.g., 'bn-BD' for Bengali, 'en-US' for English, 'hi-IN' for Hindi, 'es-ES' for Spanish).
      - **Control via postMessage:** The HTML file must NOT contain any visible buttons. It should be controlled from the parent window. Implement listeners for 'message' events with these specific actions:
        - \`{ action: 'narrate' }\`: Resets the animation and starts the full narration with synced animations.
        - \`{ action: 'replay' }\`: Resets the animation to the beginning without narration.
        - \`{ action: 'downloadThumbnail' }\`: Calls the p5.js \`saveCanvas('thumbnail.png')\` function.
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